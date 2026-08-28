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
    const { expertise, sectors, availabilitySlots, bio, isActive, hostEmail } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.interviewerProfile) {
      user.interviewerProfile = {
        expertise: [],
        sectors: [],
        availabilitySlots: [],
        isActive: true,
        totalInterviewsConducted: 0,
        bio: '',
        hostEmail: '',
      };
    }

    if (expertise !== undefined) user.interviewerProfile.expertise = expertise;
    if (sectors !== undefined) user.interviewerProfile.sectors = sectors;
    if (availabilitySlots !== undefined) user.interviewerProfile.availabilitySlots = availabilitySlots;
    if (bio !== undefined) user.interviewerProfile.bio = bio;
    if (isActive !== undefined) user.interviewerProfile.isActive = isActive;
    if (hostEmail !== undefined) {
      user.interviewerProfile.hostEmail = (hostEmail || '').trim().toLowerCase();
    }

    user.markModified('interviewerProfile');
    await user.save();

    logger.info(`Interviewer profile saved for user ${user._id} (${user.email}), hostEmail: "${user.interviewerProfile?.hostEmail}"`);

    const updatedUser = await User.findById(req.user._id).select('-password');

    res.json({ success: true, message: 'Profile updated successfully.', user: updatedUser });
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
    const user = await User.findById(interviewerId).select('name email isVerified interviewerProfile');

    const [total, pending, completed, upcoming] = await Promise.all([
      TeamInterview.countDocuments({ interviewer: interviewerId }),
      TeamInterview.countDocuments({
        interviewer: interviewerId,
        status: { $in: ['scheduled', 'active'] },
      }),
      TeamInterview.countDocuments({ interviewer: interviewerId, status: 'completed' }),
      TeamInterview.find({
        interviewer: interviewerId,
        status: { $in: ['scheduled', 'active'] },
      })
        .populate('candidate', 'name email profileImage')
        .sort({ scheduledAt: 1, createdAt: -1 })
        .limit(10),
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
      isVerified: user?.isVerified ?? false,
      stats: { total, pending, completed, avgScore, passRate },
      upcoming,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, getDashboard };
