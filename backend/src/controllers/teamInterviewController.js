const TeamInterview = require('../models/TeamInterview');
const User = require('../models/User');
const { createMeeting, deleteMeeting } = require('../services/zoomService');
const { createNotification } = require('../services/notificationService');
const { isSector } = require('../config/sectors');
const logger = require('../config/logger');

const PASS_THRESHOLD = 50; // score >= 50 = passed
const COOLDOWN_DAYS = 0;

// ─────────────────────────────────────────────
// Helper: find a matching available interviewer
// ─────────────────────────────────────────────
async function findAvailableInterviewer(stack, preferredDateTime, excludeIds = []) {
  const dayOfWeek = new Date(preferredDateTime).getDay(); // 0-6
  const hours = new Date(preferredDateTime).getUTCHours();
  const minutes = new Date(preferredDateTime).getUTCMinutes();
  const requestedTime = hours * 60 + minutes; // minutes since midnight
  const stackIsSector = isSector(stack);

  // Match on sectors array for business sectors, expertise array for tech stacks
  const expertiseQuery = stackIsSector
    ? { 'interviewerProfile.sectors': stack }
    : { 'interviewerProfile.expertise': stack };

  const candidates = await User.find({
    role: 'INTERVIEWER',
    'interviewerProfile.isActive': true,
    ...expertiseQuery,
    _id: { $nin: excludeIds },
  });

  for (const interviewer of candidates) {
    const slots = interviewer.interviewerProfile?.availabilitySlots || [];
    const match = slots.find((slot) => {
      if (slot.dayOfWeek !== dayOfWeek) return false;
      const [sh, sm] = slot.startTime.split(':').map(Number);
      const [eh, em] = slot.endTime.split(':').map(Number);
      const slotStart = sh * 60 + sm;
      const slotEnd = eh * 60 + em;
      return requestedTime >= slotStart && requestedTime < slotEnd;
    });

    if (match) {
      // Make sure this interviewer doesn't have another interview scheduled at same time
      const conflicting = await TeamInterview.findOne({
        interviewer: interviewer._id,
        status: { $in: ['pending', 'scheduled', 'active'] },
        scheduledAt: {
          $gte: new Date(new Date(preferredDateTime).getTime() - 60 * 60 * 1000),
          $lte: new Date(new Date(preferredDateTime).getTime() + 60 * 60 * 1000),
        },
      });
      if (!conflicting) return interviewer;
    }
  }
  return null;
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
// @desc  Request a new team interview
// @route POST /api/team-interviews/request
// @access Private (CANDIDATE)
// ─────────────────────────────────────────────
const requestInterview = async (req, res, next) => {
  try {
    const candidateId = req.user._id;
    const { stack, level, preferredDateTime } = req.body;

    if (!stack || !level || !preferredDateTime) {
      return res.status(400).json({ success: false, message: 'stack/sector, level, and preferredDateTime are required' });
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

    const preferredDate = new Date(preferredDateTime);
    if (preferredDate < new Date()) {
      return res.status(400).json({ success: false, message: 'Please select a future date/time.' });
    }

    const interviewMode = isSector(stack) ? 'business' : 'technical';
    const sector = isSector(stack) ? stack : null;

    // Find matching interviewer
    const interviewer = await findAvailableInterviewer(stack, preferredDate);

    if (!interviewer) {
      // Create with no_interviewer status — inform candidate
      const interview = await TeamInterview.create({
        candidate: candidateId,
        stack,
        sector,
        interviewMode,
        level: parseInt(level),
        preferredDateTime: preferredDate,
        status: 'no_interviewer',
      });
      return res.status(200).json({
        success: true,
        message: 'No interviewer is currently available at your preferred time. Please try a different time slot.',
        interview,
        noInterviewer: true,
      });
    }

    // Create Zoom meeting
    let zoomData;
    try {
      zoomData = await createMeeting({
        topic: `AI Platform Interview — ${stack} Level ${level}`,
        startTime: preferredDate,
        durationMinutes: 60,
        agenda: `Technical interview for ${req.user.name} — ${stack} (Level ${level})`,
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
      preferredDateTime: preferredDate,
      scheduledAt: preferredDate,
      status: 'scheduled',
      zoomMeetingId: zoomData.meetingId,
      zoomJoinUrl: zoomData.joinUrl,
      zoomStartUrl: zoomData.startUrl,
      zoomPassword: zoomData.password,
    });

    // Notify candidate
    await createNotification(candidateId, {
      type: 'interview_scheduled',
      title: '✅ Team Interview Scheduled!',
      message: `Your ${stack} (Level ${level}) team interview has been scheduled with ${interviewer.name}.`,
      data: {
        teamInterviewId: interview._id,
        zoomJoinUrl: zoomData.joinUrl,
        scheduledAt: preferredDate,
        interviewer: { name: interviewer.name },
      },
    });

    // Notify interviewer
    await createNotification(interviewer._id, {
      type: 'interview_scheduled',
      title: '📋 New Interview Assigned',
      message: `You have been assigned to interview ${req.user.name} for ${stack} (Level ${level}) at ${preferredDate.toUTCString()}.`,
      data: {
        teamInterviewId: interview._id,
        zoomStartUrl: zoomData.startUrl,
        zoomJoinUrl: zoomData.joinUrl,
        scheduledAt: preferredDate,
        candidate: { name: req.user.name },
      },
    });

    logger.info(`Team interview ${interview._id} scheduled: ${req.user.name} with ${interviewer.name}`);

    const populated = await TeamInterview.findById(interview._id)
      .populate('interviewer', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully!',
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
    const interviews = await TeamInterview.find({ interviewer: req.user._id })
      .populate('candidate', 'name email profileImage')
      .sort({ scheduledAt: 1 });
    res.json({ success: true, interviews });
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
    const interview = await TeamInterview.findOne({
      _id: req.params.id,
      interviewer: req.user._id,
      status: 'scheduled',
    }).populate('candidate', 'name');

    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found or already handled' });

    const declinedIds = [...(interview.declinedByInterviewers || []), req.user._id];
    interview.declinedByInterviewers = declinedIds;
    interview.interviewerDeclinedAt = new Date();

    // Try to find a replacement interviewer
    const replacement = await findAvailableInterviewer(
      interview.stack,
      interview.scheduledAt,
      declinedIds
    );

    if (replacement) {
      // Reassign to new interviewer — create a new Zoom meeting
      let zoomData;
      try {
        // Delete old meeting
        if (interview.zoomMeetingId) await deleteMeeting(interview.zoomMeetingId);

        zoomData = await createMeeting({
          topic: `AI Platform Interview — ${interview.stack} Level ${interview.level}`,
          startTime: interview.scheduledAt,
          durationMinutes: 60,
          agenda: `Technical interview for ${interview.candidate?.name} — ${interview.stack} (Level ${interview.level})`,
        });
      } catch (zoomErr) {
        logger.error(`Zoom re-creation failed: ${zoomErr.message}`);
        return res.status(500).json({ success: false, message: 'Failed to create new Zoom meeting for reassignment.' });
      }

      interview.interviewer = replacement._id;
      interview.zoomMeetingId = zoomData.meetingId;
      interview.zoomJoinUrl = zoomData.joinUrl;
      interview.zoomStartUrl = zoomData.startUrl;
      interview.zoomPassword = zoomData.password;
      await interview.save();

      // Notify new interviewer
      await createNotification(replacement._id, {
        type: 'interview_scheduled',
        title: '📋 Interview Assigned to You',
        message: `You have been assigned to interview ${interview.candidate?.name} for ${interview.stack} (Level ${interview.level}).`,
        data: {
          teamInterviewId: interview._id,
          zoomStartUrl: zoomData.startUrl,
          scheduledAt: interview.scheduledAt,
        },
      });

      // Notify candidate of reassignment
      await createNotification(interview.candidate._id, {
        type: 'interview_reassigned',
        title: '🔄 Interviewer Reassigned',
        message: `Your interviewer changed. Your ${interview.stack} interview is still on at the same time with a new interviewer.`,
        data: {
          teamInterviewId: interview._id,
          zoomJoinUrl: zoomData.joinUrl,
          scheduledAt: interview.scheduledAt,
        },
      });

      return res.json({ success: true, message: 'Interview declined and reassigned to another interviewer.', reassigned: true });
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
