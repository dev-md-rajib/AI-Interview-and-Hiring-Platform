const User = require('../models/User');
const TeamInterview = require('../models/TeamInterview');
const logger = require('../config/logger');

// ─────────────────────────────────────────────
// @desc  Get interviewer profile
// @route GET /api/interviewer/profile
// @access Private (INTERVIEWER)
// ─────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// @desc  Update interviewer profile (expertise, availability, bio)
// @route PUT /api/interviewer/profile
// @access Private (INTERVIEWER)
// ─────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { expertise, availabilitySlots, bio, isActive } = req.body;

    const updateData = {};
    if (expertise !== undefined) updateData['interviewerProfile.expertise'] = expertise;
    if (availabilitySlots !== undefined) updateData['interviewerProfile.availabilitySlots'] = availabilitySlots;
    if (bio !== undefined) updateData['interviewerProfile.bio'] = bio;
    if (isActive !== undefined) updateData['interviewerProfile.isActive'] = isActive;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, message: 'Profile updated successfully.', user });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// @desc  Get interviewer dashboard stats
// @route GET /api/interviewer/dashboard
// @access Private (INTERVIEWER)
// ─────────────────────────────────────────────
const getDashboard = async (req, res, next) => {
  try {
    const interviewerId = req.user._id;

    const [total, pending, completed, upcoming] = await Promise.all([
      TeamInterview.countDocuments({ interviewer: interviewerId }),
      TeamInterview.countDocuments({ interviewer: interviewerId, status: 'scheduled' }),
      TeamInterview.countDocuments({ interviewer: interviewerId, status: 'completed' }),
      TeamInterview.find({
        interviewer: interviewerId,
        status: 'scheduled',
        scheduledAt: { $gte: new Date() },
      })
        .populate('candidate', 'name profileImage')
        .sort({ scheduledAt: 1 })
        .limit(5),
    ]);

    const completedInterviews = await TeamInterview.find({
      interviewer: interviewerId,
      status: 'completed',
      interviewerScore: { $ne: null },
    }).select('interviewerScore passed');

    const avgScore = completedInterviews.length
      ? Math.round(completedInterviews.reduce((sum, i) => sum + i.interviewerScore, 0) / completedInterviews.length)
      : 0;

    const passRate = completedInterviews.length
      ? Math.round((completedInterviews.filter((i) => i.passed).length / completedInterviews.length) * 100)
      : 0;

    res.json({
      success: true,
      stats: { total, pending, completed, avgScore, passRate },
      upcoming,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, getDashboard };
