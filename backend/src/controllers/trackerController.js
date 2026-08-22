const path = require('path');
const fs = require('fs');
const TrackerSession = require('../models/TrackerSession');
const TrackerScreenshot = require('../models/TrackerScreenshot');
const Interview = require('../models/Interview');
const AiAgentInterview = require('../models/AiAgentInterview');
const TeamInterview = require('../models/TeamInterview');
const { emitToCandidate, emitToInterview } = require('../services/socketService');
const logger = require('../config/logger');

// Ensure screenshots upload directory exists
const screenshotsDir = path.join(__dirname, '../../uploads/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// @desc    Get next or active interview for tracker app
// @route   GET /api/tracker/next-interview
// @access  Private (CANDIDATE)
const getNextInterview = async (req, res, next) => {
  try {
    const candidateId = req.user._id;

    // 1. Check for upcoming / active scheduled Team Interview
    const teamInterview = await TeamInterview.findOne({
      candidate: candidateId,
      status: { $in: ['scheduled', 'active', 'pending'] },
    }).sort({ scheduledAt: 1 });

    if (teamInterview) {
      return res.status(200).json({
        interviewId: String(teamInterview._id),
        candidateId: String(candidateId),
        jobTitle: `${teamInterview.stack} Live Interview`,
        stack: teamInterview.stack,
        level: `Level ${teamInterview.level}`,
        scheduledAt: teamInterview.scheduledAt ? teamInterview.scheduledAt.toISOString() : new Date().toISOString(),
        interviewUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/candidate/interview/team`,
      });
    }

    // 2. Check for active Standard Interview
    const standardInterview = await Interview.findOne({
      candidate: candidateId,
      status: 'active',
    }).sort({ updatedAt: -1 });

    if (standardInterview) {
      return res.status(200).json({
        interviewId: String(standardInterview._id),
        candidateId: String(candidateId),
        jobTitle: `${standardInterview.stack} Standard Assessment`,
        stack: standardInterview.stack,
        level: `Level ${standardInterview.level}`,
        scheduledAt: standardInterview.startedAt ? standardInterview.startedAt.toISOString() : new Date().toISOString(),
        interviewUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/candidate/interview/${standardInterview._id}`,
      });
    }

    // 3. Check for active AI Agent Interview
    const aiInterview = await AiAgentInterview.findOne({
      candidate: candidateId,
      status: 'active',
    }).sort({ updatedAt: -1 });

    if (aiInterview) {
      return res.status(200).json({
        interviewId: String(aiInterview._id),
        candidateId: String(candidateId),
        jobTitle: `${aiInterview.stack} AI Voice Interview`,
        stack: aiInterview.stack,
        level: `Level ${aiInterview.level}`,
        scheduledAt: aiInterview.startedAt ? aiInterview.startedAt.toISOString() : new Date().toISOString(),
        interviewUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/candidate/interview/ai-agent/${aiInterview._id}`,
      });
    }

    // 4. Default / General session for Candidate taking an interview
    return res.status(200).json({
      interviewId: `session_${candidateId}_${Date.now()}`,
      candidateId: String(candidateId),
      jobTitle: 'Candidate Interview Assessment',
      stack: 'General Assessment',
      level: 'Level 1',
      scheduledAt: new Date().toISOString(),
      interviewUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/candidate/interview`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check if candidate has an active running tracker session
// @route   GET /api/tracker/status
// @access  Private (CANDIDATE)
const getTrackerStatus = async (req, res, next) => {
  try {
    const candidateId = req.user._id;

    // Check for active session with heartbeat within the last 60 seconds
    const cutoff = new Date(Date.now() - 60 * 1000);
    const session = await TrackerSession.findOne({
      candidate: candidateId,
      status: 'active',
      lastHeartbeat: { $gte: cutoff },
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      active: Boolean(session),
      session: session || null,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Record consent from tracker app
// @route   POST /api/tracker/consent
// @access  Private (CANDIDATE)
const sendConsent = async (req, res, next) => {
  try {
    const candidateId = req.user?._id || req.body.candidateId;
    const { interviewId, consentedAt, consentVersion } = req.body;

    const session = await TrackerSession.findOneAndUpdate(
      { candidate: candidateId, status: { $in: ['idle', 'ready', 'active'] } },
      {
        candidate: candidateId,
        interviewId: interviewId || '',
        consentedAt: consentedAt ? new Date(consentedAt) : new Date(),
        consentVersion: consentVersion || 'v1',
        lastHeartbeat: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

// @desc    Record ready state from tracker app
// @route   POST /api/tracker/ready
// @access  Private (CANDIDATE)
const sendReady = async (req, res, next) => {
  try {
    const candidateId = req.user?._id || req.body.candidateId;
    const { interviewId } = req.body;

    const session = await TrackerSession.findOneAndUpdate(
      { candidate: candidateId },
      {
        candidate: candidateId,
        interviewId: interviewId || '',
        status: 'ready',
        lastHeartbeat: new Date(),
      },
      { upsert: true, new: true }
    );

    emitToCandidate(candidateId, 'tracker:status_change', {
      candidateId,
      interviewId,
      status: 'ready',
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload screenshot from tracker app (normal interval or closed window)
// @route   POST /api/tracker/screenshot
// @access  Private (CANDIDATE)
const uploadScreenshot = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No screenshot file provided' });
    }

    const candidateId = req.user?._id || req.body.candidateId;
    const {
      interviewId,
      captureSource,
      category,
      targetName,
      reason,
      capturedAt,
    } = req.body;

    const normalizedCategory =
      category === 'Closed Windows' || captureSource === 'closed-windows'
        ? 'closed_windows'
        : 'normal_interval';

    const imageUrl = `/uploads/screenshots/${req.file.filename}`;

    let assignedInterviewId = interviewId || '';
    if (!assignedInterviewId || assignedInterviewId.startsWith('session_')) {
      const activeSession = await TrackerSession.findOne({
        candidate: candidateId,
        status: 'active',
      });
      if (activeSession && activeSession.interviewId && !activeSession.interviewId.startsWith('session_')) {
        assignedInterviewId = activeSession.interviewId;
      }
    }

    const screenshot = await TrackerScreenshot.create({
      candidate: candidateId,
      interviewId: assignedInterviewId,
      imageUrl,
      category: normalizedCategory,
      captureSource: captureSource || (normalizedCategory === 'closed_windows' ? 'closed-windows' : 'fixed-interval'),
      targetName: targetName || '',
      reason: reason || '',
      capturedAt: capturedAt ? new Date(capturedAt) : new Date(),
    });

    logger.info(`Saved screenshot: ${req.file.filename} (Category: ${normalizedCategory}) for interview ${assignedInterviewId}`);

    res.status(201).json({ success: true, screenshot });
  } catch (err) {
    next(err);
  }
};

// @desc    End interview from tracker app
// @route   POST /api/tracker/end
// @access  Private (CANDIDATE)
const endInterview = async (req, res, next) => {
  try {
    const candidateId = req.user?._id || req.body.candidateId;
    const { interviewId, endedBy, endedAt } = req.body;

    // 1. Update TrackerSession
    await TrackerSession.updateMany(
      { candidate: candidateId, status: { $in: ['ready', 'active'] } },
      {
        status: 'completed',
        endedAt: endedAt ? new Date(endedAt) : new Date(),
        endedBy: endedBy || 'candidate',
        lastHeartbeat: new Date(),
      }
    );

    // 2. Notify website in real-time via Socket.IO
    emitToCandidate(candidateId, 'tracker:interview_ended', {
      candidateId,
      interviewId,
      endedBy: endedBy || 'candidate',
      endedAt: endedAt || new Date().toISOString(),
    });

    if (interviewId) {
      emitToInterview(interviewId, 'tracker:interview_ended', {
        candidateId,
        interviewId,
        endedBy: endedBy || 'candidate',
        endedAt: endedAt || new Date().toISOString(),
      });
    }

    res.status(200).json({ success: true, message: 'Interview session ended successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all screenshots for an interview session
// @route   GET /api/tracker/screenshots/:interviewId
// @access  Private (CANDIDATE, RECRUITER, ADMIN)
const getScreenshotsForInterview = async (req, res, next) => {
  try {
    const { interviewId } = req.params;

    if (!interviewId || interviewId === 'undefined' || interviewId === 'null') {
      return res.status(400).json({ success: false, message: 'Interview ID is required' });
    }

    // Query strictly for this specific interview
    const screenshots = await TrackerScreenshot.find({ interviewId: String(interviewId) })
      .sort({ capturedAt: -1 })
      .lean();

    const normalScreenshots = screenshots.filter((s) => s.category === 'normal_interval');
    const closedWindowScreenshots = screenshots.filter((s) => s.category === 'closed_windows');

    res.status(200).json({
      success: true,
      totalCount: screenshots.length,
      normalCount: normalScreenshots.length,
      closedWindowsCount: closedWindowScreenshots.length,
      screenshots: {
        normal: normalScreenshots,
        closedWindows: closedWindowScreenshots,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Report a proctoring violation from the website (e.g. paste attempt) and trigger tracker screenshot capture
// @route   POST /api/tracker/violation
// @access  Private (CANDIDATE)
const reportViolation = async (req, res, next) => {
  try {
    const candidateId = req.user?._id;
    const { interviewId, reason, targetName } = req.body;

    logger.warn(`Proctoring violation reported for candidate ${candidateId}: ${reason} (Target: ${targetName})`);

    // Emit to candidate's tracker desktop app to trigger an immediate violation capture
    if (candidateId) {
      emitToCandidate(candidateId, 'tracker:trigger_violation_capture', {
        candidateId,
        interviewId: interviewId || '',
        reason: reason || 'Clipboard Paste Attempt - Pasting text into answer box',
        targetName: targetName || 'Candidate Answer Box',
      });
    }

    res.status(200).json({ success: true, message: 'Violation reported to proctoring tracker' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNextInterview,
  getTrackerStatus,
  sendConsent,
  sendReady,
  uploadScreenshot,
  endInterview,
  getScreenshotsForInterview,
  reportViolation,
};
