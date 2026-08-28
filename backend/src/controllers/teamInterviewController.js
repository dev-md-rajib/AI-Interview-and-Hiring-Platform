const TeamInterview = require('../models/TeamInterview');
const CandidateProfile = require('../models/CandidateProfile');
const User = require('../models/User');
const { createMeeting, deleteMeeting } = require('../services/zoomService');
const { createNotification } = require('../services/notificationService');
const { isSector } = require('../config/sectors');
const logger = require('../config/logger');

const PASS_THRESHOLD = 50; // score >= 50 = passed
const COOLDOWN_DAYS = 0;

// ─────────────────────────────────────────────
// Helper: find the earliest available interviewer with a 30-min rest gap
// ─────────────────────────────────────────────
function formatBangladeshDateTime(date) {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    timeZone: 'Asia/Dhaka',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }) + ' (BST, Bangladesh Time)';
}

async function findEarliestAvailableInterviewer(stack, excludeIds = [], interviewType = null) {
  const stackIsSector = (interviewType === 'business') || isSector(stack);
  const escapedStack = stack.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const stackRegex = new RegExp(`^${escapedStack}$`, 'i');

  const expertiseQuery = stackIsSector
    ? {
        $or: [
          { 'interviewerProfile.sectors': stack },
          { 'interviewerProfile.sectors': stackRegex },
        ],
      }
    : {
        $or: [
          { 'interviewerProfile.expertise': stack },
          { 'interviewerProfile.expertise': stackRegex },
        ],
      };

  const interviewers = await User.find({
    role: 'INTERVIEWER',
    isVerified: true,
    isBanned: false,
    'interviewerProfile.isActive': true,
    ...expertiseQuery,
    _id: { $nin: excludeIds },
  }).sort({ 'interviewerProfile.totalInterviewsConducted': -1 });

  if (!interviewers || interviewers.length === 0) {
    return null;
  }

  const now = new Date();
  const minStartTime = new Date(now.getTime() + 1 * 60 * 1000); // minimum 1 min buffer from now
  const INTERVIEW_DURATION_MS = 60 * 60 * 1000; // 60 minutes
  const BUFFER_MS = 1 * 60 * 1000; // 1 minute cooldown/gap time between interviews

  let earliestMatch = null;

  // Search over the upcoming 14 days in Bangladesh Local Time (BST, UTC+6)
  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const bdNowMs = now.getTime() + 6 * 60 * 60 * 1000; // Bangladesh is UTC+6
    const targetBdDate = new Date(bdNowMs + dayOffset * 24 * 60 * 60 * 1000);
    const bdDayOfWeek = targetBdDate.getUTCDay(); // 0 = Sunday, 1 = Monday, ...
    const bdYear = targetBdDate.getUTCFullYear();
    const bdMonth = targetBdDate.getUTCMonth();
    const bdDate = targetBdDate.getUTCDate();

    for (const interviewer of interviewers) {
      const slots = interviewer.interviewerProfile?.availabilitySlots || [];
      const daySlots = slots.filter((s) => s.dayOfWeek === bdDayOfWeek);
      if (daySlots.length === 0) continue;

      // Query all existing interviews for this interviewer around this target date (in UTC)
      const dayStart = new Date(Date.UTC(bdYear, bdMonth, bdDate, -6, 0, 0));
      const dayEnd = new Date(Date.UTC(bdYear, bdMonth, bdDate + 1, -6, 0, 0));

      const existingInterviews = await TeamInterview.find({
        interviewer: interviewer._id,
        status: { $in: ['pending', 'scheduled', 'active'] },
        scheduledAt: {
          $gte: new Date(dayStart.getTime() - 2 * 60 * 60 * 1000),
          $lte: new Date(dayEnd.getTime() + 2 * 60 * 60 * 1000),
        },
      });

      for (const slot of daySlots) {
        if (!slot.startTime || !slot.endTime) continue;
        const [sh, sm] = slot.startTime.split(':').map(Number);
        const [eh, em] = slot.endTime.split(':').map(Number);

        // Convert BD local slot time to UTC timestamp: (BD hour - 6)
        const slotStartTime = new Date(Date.UTC(bdYear, bdMonth, bdDate, sh - 6, sm, 0));
        const slotEndTime = new Date(Date.UTC(bdYear, bdMonth, bdDate, eh - 6, em, 0));

        // Iterate candidate start times in 15-minute intervals within the slot
        for (
          let candidateTime = new Date(slotStartTime.getTime());
          candidateTime.getTime() + INTERVIEW_DURATION_MS <= slotEndTime.getTime();
          candidateTime = new Date(candidateTime.getTime() + 15 * 60 * 1000)
        ) {
          if (candidateTime < minStartTime) continue;

          const cStart = candidateTime.getTime();
          const cEnd = cStart + INTERVIEW_DURATION_MS;

          // Check if candidate time violates the 1-minute rest cooldown around any existing interview
          const hasConflict = existingInterviews.some((ex) => {
            const exStart = new Date(ex.scheduledAt).getTime();
            const exEnd = exStart + INTERVIEW_DURATION_MS;
            // Buffer zone: [exStart - BUFFER_MS, exEnd + BUFFER_MS]
            return cStart < (exEnd + BUFFER_MS) && cEnd > (exStart - BUFFER_MS);
          });

          if (!hasConflict) {
            if (!earliestMatch || candidateTime < earliestMatch.scheduledAt) {
              earliestMatch = {
                interviewer,
                scheduledAt: candidateTime,
              };
            }
          }
        }
      }
    }

    // If an earliest match was found for this day or earlier, no future day can beat it
    if (earliestMatch && earliestMatch.scheduledAt < new Date(Date.UTC(bdYear, bdMonth, bdDate + 1, -6, 0, 0))) {
      break;
    }
  }

  return earliestMatch;
}

// Helper: check level prerequisite for team interviews
async function checkLevelPrerequisite(candidateId, level) {
  if (level <= 1) return { eligible: true };
  const prevLevel = level - 1;
  const Interview = require('../models/Interview');
  const AiAgentInterview = require('../models/AiAgentInterview');

  const prevPassedStandard = await Interview.findOne({ candidate: candidateId, level: prevLevel, status: 'completed', passed: true });
  const prevPassedAi = await AiAgentInterview.findOne({ candidate: candidateId, level: prevLevel, status: 'completed', passed: true });
  const prevPassedZoom = await TeamInterview.findOne({ candidate: candidateId, level: prevLevel, status: 'completed', passed: true });

  if (!prevPassedStandard && !prevPassedAi && !prevPassedZoom) {
    return { eligible: false, reason: `You must pass Level ${prevLevel} first before requesting a Level ${level} team interview.` };
  }
  return { eligible: true };
}

// ─────────────────────────────────────────────
// @desc  Check candidate eligibility to request
// @route GET /api/team-interviews/eligibility
// @access Private (CANDIDATE)
// ─────────────────────────────────────────────
const checkEligibility = async (req, res, next) => {
  try {
    const candidateId = req.user._id;

    // Check cooldown
    const user = await User.findById(candidateId);
    if (user.teamInterviewCooldownUntil && user.teamInterviewCooldownUntil > new Date()) {
      return res.json({
        eligible: false,
        reason: `You must wait until ${user.teamInterviewCooldownUntil.toLocaleDateString()} before requesting a new team interview.`,
        cooldownUntil: user.teamInterviewCooldownUntil,
      });
    }

    // Check if already has active/pending/scheduled interview
    const active = await TeamInterview.findOne({
      candidate: candidateId,
      status: { $in: ['pending', 'scheduled', 'active'] },
    });

    if (active) {
      return res.json({
        eligible: false,
        reason: 'You already have a team interview in the queue.',
        activeInterview: active,
      });
    }

    // Check level prerequisite if level is provided as query param
    const requestedLevel = parseInt(req.query.level);
    if (requestedLevel && requestedLevel > 1) {
      const levelCheck = await checkLevelPrerequisite(candidateId, requestedLevel);
      if (!levelCheck.eligible) {
        return res.json({ eligible: false, reason: levelCheck.reason, levelLocked: true });
      }
    }

    res.json({ eligible: true });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// @desc  Request a new team interview (Auto-matches first available interviewer time)
// @route POST /api/team-interviews/request
// @access Private (CANDIDATE)
// ─────────────────────────────────────────────
const requestInterview = async (req, res, next) => {
  try {
    const candidateId = req.user._id;
    const { stack, level, interviewType } = req.body;

    if (!stack || !level) {
      return res.status(400).json({ success: false, message: 'stack/sector and level are required' });
    }

    // Eligibility checks
    const user = await User.findById(candidateId);
    if (user.teamInterviewCooldownUntil && user.teamInterviewCooldownUntil > new Date()) {
      return res.status(403).json({
        success: false,
        message: `You are on a cooldown until ${user.teamInterviewCooldownUntil.toLocaleDateString()}.`,
      });
    }

    const existing = await TeamInterview.findOne({
      candidate: candidateId,
      status: { $in: ['pending', 'scheduled', 'active'] },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have an active team interview.' });
    }

    // Level prerequisite check
    const levelCheck = await checkLevelPrerequisite(candidateId, parseInt(level));
    if (!levelCheck.eligible) {
      return res.status(403).json({ success: false, message: levelCheck.reason });
    }

    const interviewMode = (interviewType === 'business' || isSector(stack)) ? 'business' : 'technical';
    const sector = interviewMode === 'business' ? stack : null;

    // Search and auto-match the earliest available slot with 30-min gap
    const match = await findEarliestAvailableInterviewer(stack, [], interviewType);

    if (!match) {
      return res.status(200).json({
        success: true,
        message: 'No interviewer is currently available for this stack/domain in the upcoming schedule. Please check back later or choose another stack.',
        noInterviewer: true,
      });
    }

    const { interviewer, scheduledAt } = match;

    // Create Zoom meeting
    let zoomData;
    try {
      const hostEmail = interviewer.interviewerProfile?.hostEmail || 'rajibmiah978@gmail.com';
      zoomData = await createMeeting({
        topic: `AI Platform Interview — ${stack} Level ${level}`,
        startTime: scheduledAt,
        durationMinutes: 60,
        agenda: `Technical interview for ${req.user.name} — ${stack} (Level ${level})`,
        hostEmail,
      });
    } catch (zoomErr) {
      logger.error(`Zoom meeting creation failed: ${zoomErr.message}`);
      return res.status(500).json({ success: false, message: 'Failed to create Zoom meeting. Please try again.' });
    }

    // Create TeamInterview record
    const interview = await TeamInterview.create({
      candidate: candidateId,
      interviewer: interviewer._id,
      stack,
      sector,
      interviewMode,
      level: parseInt(level),
      preferredDateTime: scheduledAt,
      scheduledAt,
      status: 'scheduled',
      zoomMeetingId: zoomData.meetingId,
      zoomJoinUrl: zoomData.joinUrl,
      zoomStartUrl: zoomData.startUrl,
      zoomPassword: zoomData.password,
    });

    const bdFormattedTime = formatBangladeshDateTime(scheduledAt);

    // Notify candidate with scheduled time
    await createNotification(candidateId, {
      type: 'interview_scheduled',
      title: '✅ Team Interview Scheduled!',
      message: `Your ${stack} (Level ${level}) team interview has been automatically scheduled with ${interviewer.name} for ${bdFormattedTime}.`,
      data: {
        teamInterviewId: interview._id,
        zoomJoinUrl: zoomData.joinUrl,
        scheduledAt,
        interviewer: { name: interviewer.name },
      },
    });

    // Notify interviewer with assigned time
    await createNotification(interviewer._id, {
      type: 'interview_scheduled',
      title: '📋 New Interview Assigned',
      message: `You have been assigned to interview ${req.user.name} for ${stack} (Level ${level}) at ${bdFormattedTime}.`,
      data: {
        teamInterviewId: interview._id,
        zoomStartUrl: zoomData.startUrl,
        zoomJoinUrl: zoomData.joinUrl,
        scheduledAt,
        candidate: { name: req.user.name },
      },
    });

    logger.info(`Team interview ${interview._id} scheduled: ${req.user.name} with ${interviewer.name} at ${scheduledAt.toISOString()}`);

    const populated = await TeamInterview.findById(interview._id)
      .populate('interviewer', 'name profileImage');

    res.status(201).json({
      success: true,
      message: `Interview automatically scheduled for ${bdFormattedTime} with ${interviewer.name}!`,
      interview: populated,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// @desc  Get candidate's own team interviews
// @route GET /api/team-interviews/my
// @access Private (CANDIDATE)
// ─────────────────────────────────────────────
const getMyInterviews = async (req, res, next) => {
  try {
    const interviews = await TeamInterview.find({ candidate: req.user._id })
      .populate('interviewer', 'name profileImage interviewerProfile')
      .sort({ createdAt: -1 });
    res.json({ success: true, interviews });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// @desc  Candidate cancels their interview
// @route POST /api/team-interviews/:id/cancel
// @access Private (CANDIDATE)
// ─────────────────────────────────────────────
const cancelInterview = async (req, res, next) => {
  try {
    const interview = await TeamInterview.findOne({
      _id: req.params.id,
      candidate: req.user._id,
    });

    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    if (!['pending', 'scheduled'].includes(interview.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel an interview that is already active or completed.' });
    }

    // Delete Zoom meeting if exists
    if (interview.zoomMeetingId) {
      await deleteMeeting(interview.zoomMeetingId);
    }

    // Apply 7-day cooldown to candidate
    const cooldownUntil = new Date();
    cooldownUntil.setDate(cooldownUntil.getDate() + COOLDOWN_DAYS);

    await User.findByIdAndUpdate(req.user._id, { teamInterviewCooldownUntil: cooldownUntil });

    interview.status = 'cancelled';
    interview.cancelledBy = 'candidate';
    interview.candidateCancelledAt = new Date();
    interview.cancellationReason = req.body.reason || 'Cancelled by candidate';
    await interview.save();

    // Notify interviewer if assigned
    if (interview.interviewer) {
      await createNotification(interview.interviewer, {
        type: 'interview_cancelled',
        title: '❌ Interview Cancelled',
        message: `The candidate cancelled the ${interview.stack} (Level ${interview.level}) interview scheduled for ${interview.scheduledAt?.toUTCString() || 'TBD'}.`,
        data: { teamInterviewId: interview._id },
      });
    }

    res.json({
      success: true,
      message: `Interview cancelled. You cannot request a new team interview for ${COOLDOWN_DAYS} days.`,
      cooldownUntil,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// @desc  Interviewer gets their assigned interviews
// @route GET /api/team-interviews/interviewer/assigned
// @access Private (INTERVIEWER)
// ─────────────────────────────────────────────
const getAssignedInterviews = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user?.isVerified) {
      return res.json({
        success: true,
        interviews: [],
        isVerified: false,
        message: 'Your interviewer account is pending admin verification. You will be assigned interviews once verified by an Admin.',
      });
    }

    const interviews = await TeamInterview.find({ interviewer: req.user._id })
      .populate('candidate', 'name email profileImage')
      .sort({ scheduledAt: 1 });
    res.json({ success: true, interviews, isVerified: true });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// @desc  Interviewer declines an assignment
// @route POST /api/team-interviews/:id/decline
// @access Private (INTERVIEWER)
// ─────────────────────────────────────────────
const declineInterview = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user?.isVerified) {
      return res.status(403).json({ success: false, message: 'You must be verified by an Admin to manage assignments.' });
    }
    const interview = await TeamInterview.findOne({
      _id: req.params.id,
      interviewer: req.user._id,
      status: 'scheduled',
    }).populate('candidate', 'name');

    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found or already handled' });

    const declinedIds = [...(interview.declinedByInterviewers || []), req.user._id];
    interview.declinedByInterviewers = declinedIds;
    interview.interviewerDeclinedAt = new Date();

    // Try to find a replacement interviewer with earliest available slot
    const replacementMatch = await findEarliestAvailableInterviewer(
      interview.stack,
      declinedIds,
      interview.interviewMode === 'business' ? 'business' : 'tech'
    );

    if (replacementMatch) {
      const { interviewer: replacement, scheduledAt: newScheduledAt } = replacementMatch;

      // Reassign to new interviewer — create a new Zoom meeting
      let zoomData;
      try {
        // Delete old meeting
        if (interview.zoomMeetingId) await deleteMeeting(interview.zoomMeetingId);

        const hostEmail = replacement.interviewerProfile?.hostEmail || 'rajibmiah978@gmail.com';
        zoomData = await createMeeting({
          topic: `AI Platform Interview — ${interview.stack} Level ${interview.level}`,
          startTime: newScheduledAt,
          durationMinutes: 60,
          agenda: `Technical interview for ${interview.candidate?.name} — ${interview.stack} (Level ${interview.level})`,
          hostEmail,
        });
      } catch (zoomErr) {
        logger.error(`Zoom re-creation failed: ${zoomErr.message}`);
        return res.status(500).json({ success: false, message: 'Failed to create new Zoom meeting for reassignment.' });
      }

      interview.interviewer = replacement._id;
      interview.scheduledAt = newScheduledAt;
      interview.preferredDateTime = newScheduledAt;
      interview.zoomMeetingId = zoomData.meetingId;
      interview.zoomJoinUrl = zoomData.joinUrl;
      interview.zoomStartUrl = zoomData.startUrl;
      interview.zoomPassword = zoomData.password;
      await interview.save();

      const bdReassignedTime = formatBangladeshDateTime(newScheduledAt);

      // Notify new interviewer
      await createNotification(replacement._id, {
        type: 'interview_scheduled',
        title: '📋 Interview Assigned to You',
        message: `You have been assigned to interview ${interview.candidate?.name} for ${interview.stack} (Level ${interview.level}) at ${bdReassignedTime}.`,
        data: {
          teamInterviewId: interview._id,
          zoomStartUrl: zoomData.startUrl,
          scheduledAt: newScheduledAt,
        },
      });

      // Notify candidate of reassignment
      await createNotification(interview.candidate._id, {
        type: 'interview_reassigned',
        title: '🔄 Interviewer Reassigned',
        message: `Your interviewer changed. Your ${interview.stack} interview is scheduled with ${replacement.name} for ${bdReassignedTime}.`,
        data: {
          teamInterviewId: interview._id,
          zoomJoinUrl: zoomData.joinUrl,
          scheduledAt: newScheduledAt,
        },
      });

      return res.json({ success: true, message: 'Interview declined and reassigned to another available interviewer.', reassigned: true });
    }

    // No replacement found — cancel the interview
    if (interview.zoomMeetingId) await deleteMeeting(interview.zoomMeetingId);

    interview.status = 'cancelled';
    interview.cancelledBy = 'system';
    interview.cancellationReason = 'No available interviewer after declination';
    await interview.save();

    // Notify candidate
    await createNotification(interview.candidate._id, {
      type: 'interview_cancelled',
      title: '❌ Interview Cancelled',
      message: `Unfortunately, your ${interview.stack} (Level ${interview.level}) team interview was cancelled because no available interviewer was found. Please request a new one.`,
      data: { teamInterviewId: interview._id },
    });

    res.json({ success: true, message: 'Interview declined. No replacement found; interview has been cancelled.', cancelled: true });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// @desc  Interviewer submits score and feedback
// @route POST /api/team-interviews/:id/submit-result
// @access Private (INTERVIEWER)
// ─────────────────────────────────────────────
const submitResult = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user?.isVerified) {
      return res.status(403).json({ success: false, message: 'You must be verified by an Admin to submit interview results.' });
    }

    const { score, feedback, strengths, weaknesses } = req.body;

    if (score == null || score < 0 || score > 100) {
      return res.status(400).json({ success: false, message: 'Score must be between 0 and 100.' });
    }

    const interview = await TeamInterview.findOne({
      _id: req.params.id,
      interviewer: req.user._id,
      status: { $in: ['scheduled', 'active', 'completed'] },
    }).populate('candidate', 'name');

    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });

    const passed = score >= PASS_THRESHOLD;

    interview.interviewerScore = score;
    interview.interviewerFeedback = feedback || '';
    interview.interviewerStrengths = Array.isArray(strengths) ? strengths : [];
    interview.interviewerWeaknesses = Array.isArray(weaknesses) ? weaknesses : [];
    interview.passed = passed;
    interview.feedbackSubmittedAt = new Date();
    interview.resultReleasedAt = new Date();
    interview.status = 'completed';
    interview.completedAt = new Date();
    await interview.save();

    // If passed, update candidate's currentLevel
    if (passed) {
      await CandidateProfile.findOneAndUpdate(
        { user: interview.candidate._id },
        { $max: { currentLevel: interview.level } },
        { upsert: true }
      );
    }

    // If failed, apply 7-day cooldown to candidate
    if (!passed) {
      const cooldownUntil = new Date();
      cooldownUntil.setDate(cooldownUntil.getDate() + COOLDOWN_DAYS);
      await User.findByIdAndUpdate(interview.candidate._id, { teamInterviewCooldownUntil: cooldownUntil });
    }

    // Update interviewer stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'interviewerProfile.totalInterviewsConducted': 1 },
    });

    // Notify candidate
    await createNotification(interview.candidate._id, {
      type: 'interview_result',
      title: passed ? '🎉 Interview Result: Passed!' : '📋 Interview Result Available',
      message: passed
        ? `Congratulations! You passed your ${interview.stack} (Level ${interview.level}) team interview with a score of ${score}/100.`
        : `Your ${interview.stack} (Level ${interview.level}) interview result is available. Score: ${score}/100.`,
      data: {
        teamInterviewId: interview._id,
        score,
        passed,
      },
    });

    res.json({ success: true, message: 'Feedback submitted successfully.', interview });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// @desc  Candidate views their interview result
// @route GET /api/team-interviews/result/:id
// @access Private (CANDIDATE)
// ─────────────────────────────────────────────
const getResult = async (req, res, next) => {
  try {
    const interview = await TeamInterview.findOne({
      _id: req.params.id,
      candidate: req.user._id,
    }).populate('interviewer', 'name profileImage');

    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });

    if (!interview.resultReleasedAt) {
      return res.json({
        success: true,
        resultAvailable: false,
        message: 'Results are not yet available. Please check back after the interview.',
      });
    }

    res.json({
      success: true,
      resultAvailable: true,
      interview,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// @desc  Get single interview details
// @route GET /api/team-interviews/:id
// @access Private
// ─────────────────────────────────────────────
const getInterview = async (req, res, next) => {
  try {
    const interview = await TeamInterview.findById(req.params.id)
      .populate('candidate', 'name email profileImage')
      .populate('interviewer', 'name profileImage interviewerProfile');

    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });

    // Only allow access to candidate or interviewer
    const userId = req.user._id.toString();
    const isCandidate = interview.candidate?._id.toString() === userId;
    const isInterviewer = interview.interviewer?._id.toString() === userId;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isCandidate && !isInterviewer && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, interview });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkEligibility,
  requestInterview,
  getMyInterviews,
  cancelInterview,
  getAssignedInterviews,
  declineInterview,
  submitResult,
  getResult,
  getInterview,
};
