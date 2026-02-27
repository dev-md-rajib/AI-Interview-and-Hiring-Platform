const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const Interview = require('../models/Interview');
const Job = require('../models/Job');
const Application = require('../models/Application');
const InterviewLevel = require('../models/InterviewLevel');
const QuestionBank = require('../models/QuestionBank');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (ADMIN)
const getAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalCandidates, totalRecruiters, totalJobs, totalInterviews, totalApplications] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'CANDIDATE' }),
        User.countDocuments({ role: 'RECRUITER' }),
        Job.countDocuments(),
        Interview.countDocuments({ status: 'completed' }),
        Application.countDocuments(),
      ]);

    const passRate = await Interview.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, passed: { $sum: { $cond: ['$passed', 1, 0] } }, total: { $sum: 1 } } },
    ]);

    const avgScore = await Interview.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avg: { $avg: '$totalScore' } } },
    ]);

    const recentActivity = await ActivityLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(20);

    const interviewsByLevel = await Interview.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$level', count: { $sum: 1 }, avgScore: { $avg: '$totalScore' }, passed: { $sum: { $cond: ['$passed', 1, 0] } } } },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalJobs,
        totalInterviews,
        totalApplications,
        passRate: passRate[0] ? Math.round((passRate[0].passed / passRate[0].total) * 100) : 0,
        avgScore: avgScore[0] ? Math.round(avgScore[0].avg) : 0,
      },
      interviewsByLevel,
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (ADMIN)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    res.status(200).json({ success: true, total, users });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify or reject recruiter
// @route   PUT /api/admin/users/:id/verify
// @access  Private (ADMIN)
const verifyRecruiter = async (req, res, next) => {
  try {
    const { verified } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: verified }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc    Manage interview levels
// @route   POST /api/admin/levels
// @access  Private (ADMIN)
const createOrUpdateLevel = async (req, res, next) => {
  try {
    const { level, name, description, requiredSkills, minimumPassScore, allowedStacks, durationMinutes, questionCount } = req.body;

    const levelDoc = await InterviewLevel.findOneAndUpdate(
      { level },
      { level, name, description, requiredSkills, minimumPassScore, allowedStacks, durationMinutes, questionCount },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({ success: true, level: levelDoc });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all levels
// @route   GET /api/admin/levels
// @access  Private
const getLevels = async (req, res, next) => {
  try {
    const levels = await InterviewLevel.find().sort({ level: 1 });
    res.status(200).json({ success: true, levels });
  } catch (err) {
    next(err);
  }
};

// @desc    Question bank CRUD
// @route   POST /api/admin/questions
// @access  Private (ADMIN)
const addQuestion = async (req, res, next) => {
  try {
    const question = await QuestionBank.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, question });
  } catch (err) {
    next(err);
  }
};

const getQuestions = async (req, res, next) => {
  try {
    const { stack, level, type } = req.query;
    const query = {};
    if (stack) query.stack = new RegExp(stack, 'i');
    if (level) query.level = parseInt(level);
    if (type) query.type = type;

    const questions = await QuestionBank.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: questions.length, questions });
  } catch (err) {
    next(err);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    await QuestionBank.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Question deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc    Search candidates
// @route   GET /api/admin/candidates/search
// @access  Private (ADMIN, RECRUITER)
const searchCandidates = async (req, res, next) => {
  try {
    const { stack, level, minScore, maxScore, minExp, availability, page = 1, limit = 20 } = req.query;

    // Find candidates matching interview criteria
    const interviewQuery = { status: 'completed', passed: true };
    if (level) interviewQuery.level = parseInt(level);
    if (minScore || maxScore) {
      interviewQuery.totalScore = {};
      if (minScore) interviewQuery.totalScore.$gte = parseInt(minScore);
      if (maxScore) interviewQuery.totalScore.$lte = parseInt(maxScore);
    }

    const passedCandidates = await Interview.distinct('candidate', interviewQuery);

    // Build profile query
    const profileQuery = { user: { $in: passedCandidates } };
    if (stack) profileQuery.expertise = { $in: [new RegExp(stack, 'i')] };
    if (minExp) profileQuery.yearsOfExperience = { $gte: parseInt(minExp) };
    if (availability) profileQuery.availability = availability;

    const skip = (page - 1) * limit;
    const [profiles, total] = await Promise.all([
      CandidateProfile.find(profileQuery)
        .populate('user', 'name email profileImage createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      CandidateProfile.countDocuments(profileQuery),
    ]);

    // Enrich with best interview score
    const enriched = await Promise.all(
      profiles.map(async (p) => {
        const bestInterview = await Interview.findOne({ candidate: p.user._id, status: 'completed', passed: true })
          .sort({ totalScore: -1 })
          .select('level totalScore stack');
        return { ...p.toObject(), bestInterview };
      })
    );

    res.status(200).json({ success: true, total, page: parseInt(page), candidates: enriched });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics, getAllUsers, verifyRecruiter, createOrUpdateLevel, getLevels, addQuestion, getQuestions, deleteQuestion, searchCandidates };
