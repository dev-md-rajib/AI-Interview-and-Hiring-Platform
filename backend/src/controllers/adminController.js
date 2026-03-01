const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const Interview = require('../models/Interview');
const Job = require('../models/Job');
const Application = require('../models/Application');
const InterviewLevel = require('../models/InterviewLevel');
const QuestionBank = require('../models/QuestionBank');
const ActivityLog = require('../models/ActivityLog');
const AiAgentInterview = require('../models/AiAgentInterview');
const Report = require('../models/Report');

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
    const { minExp, availability, page = 1, limit = 20, requirements } = req.query;

    let passedCandidates = null; // null means no restrictions yet

    // Handle new multi-stack requirements array
    if (requirements) {
      try {
        const reqs = JSON.parse(requirements); // Array of {stack, level, minScore}
        if (Array.isArray(reqs) && reqs.length > 0) {
          
          let candidateSets = [];
          
          for (const req of reqs) {
            const query = { status: 'completed', passed: true };
            if (req.stack) query.stack = new RegExp(req.stack, 'i');
            if (req.level) query.level = parseInt(req.level);
            if (req.minScore) {
              query.totalScore = { $gte: parseInt(req.minScore) };
            }
            
            // Find candidates matching this specific requirement in BOTH standard and AI interviews
            const stdMatches = await Interview.distinct('candidate', query);
            const aiMatches = await AiAgentInterview.distinct('candidate', query);
            
            // Combine and unique the candidates who satisfied THIS requirement
            const matchesForThisReq = [...new Set([...stdMatches.map(id => id.toString()), ...aiMatches.map(id => id.toString())])];
            candidateSets.push(matchesForThisReq);
          }

          // Intersect all sets - candidate must satisfy ALL requirements
          if (candidateSets.length > 0) {
            passedCandidates = candidateSets.reduce((a, b) => a.filter(c => b.includes(c)));
          }
        }
      } catch (e) {
        console.error("Failed to parse requirements", e);
      }
    }

    // Build profile query
    const profileQuery = {};
    if (passedCandidates !== null) {
      profileQuery.user = { $in: passedCandidates };
    }
    
    // For backwards compatibility / legacy single-stack search (if used by other parts of the app)
    const { stack, level, minScore, maxScore } = req.query;
    if (!requirements && (stack || level || minScore || maxScore)) {
        const legacyQuery = { status: 'completed', passed: true };
        if (level) legacyQuery.level = parseInt(level);
        if (minScore || maxScore) {
          legacyQuery.totalScore = {};
          if (minScore) legacyQuery.totalScore.$gte = parseInt(minScore);
          if (maxScore) legacyQuery.totalScore.$lte = parseInt(maxScore);
        }
        
        let legacyCandidates = [];
        if (Object.keys(legacyQuery).length > 2) {
           const stdLegacy = await Interview.distinct('candidate', legacyQuery);
           const aiLegacy = await AiAgentInterview.distinct('candidate', legacyQuery);
           legacyCandidates = [...new Set([...stdLegacy.map(id => id.toString()), ...aiLegacy.map(id => id.toString())])];
           profileQuery.user = { $in: legacyCandidates };
        }
        if (stack) profileQuery.expertise = { $in: [new RegExp(stack, 'i')] };
    }

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

    // Enrich with best interview score (from both sources)
    const enriched = await Promise.all(
      profiles.map(async (p) => {
        const stdBest = await Interview.findOne({ candidate: p.user._id, status: 'completed', passed: true })
          .sort({ totalScore: -1 })
          .select('level totalScore stack');
          
        const aiBest = await AiAgentInterview.findOne({ candidate: p.user._id, status: 'completed', passed: true })
          .sort({ totalScore: -1 })
          .select('level totalScore stack');

        let bestInterview = null;
        if (stdBest && aiBest) bestInterview = stdBest.totalScore > aiBest.totalScore ? stdBest : aiBest;
        else if (stdBest) bestInterview = stdBest;
        else if (aiBest) bestInterview = aiBest;

        return { ...p.toObject(), bestInterview };
      })
    );

    res.status(200).json({ success: true, total, page: parseInt(page), candidates: enriched });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all pending reports
// @route   GET /api/admin/reports
// @access  Private (ADMIN)
const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ status: 'Pending' })
      .populate('reporter', 'name email role')
      .populate('reportedUser', 'name email role')
      .populate('reportedJob', 'title status')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (err) {
    next(err);
  }
};

// @desc    Resolve a report
// @route   PUT /api/admin/reports/:id
// @access  Private (ADMIN)
const resolveReport = async (req, res, next) => {
  try {
    const { action, banReason } = req.body; // action: 'dismiss', 'delete_job', 'ban_user'
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (action === 'dismiss') {
      report.status = 'Dismissed';
      await report.save();
    } else if (action === 'delete_job') {
      if (report.reportedJob) {
        await Job.findByIdAndDelete(report.reportedJob);
      }
      report.status = 'Resolved';
      await report.save();
    } else if (action === 'ban_user') {
      if (report.reportedUser) {
        const user = await User.findByIdAndUpdate(report.reportedUser, {
          isBanned: true,
          banReason: banReason || 'Violated platform policies',
        });
        
        // Hide their content
        if (user.role === 'RECRUITER') {
          await Job.updateMany({ recruiter: user._id }, { status: 'Closed' });
        } else if (user.role === 'CANDIDATE') {
          // Soft-deactivate Candidate Profile
          await CandidateProfile.findOneAndUpdate({ user: user._id }, { isActive: false });
        }
      }
      report.status = 'Resolved';
      await report.save();
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    res.status(200).json({ success: true, message: 'Report resolved', report });
  } catch (err) {
    next(err);
  }
};

// @desc    Get pending appeals
// @route   GET /api/admin/appeals
// @access  Private (ADMIN)
const getAppeals = async (req, res, next) => {
  try {
    const appeals = await User.find({ appealStatus: 'Pending' })
      .select('name email role banReason appealText appealStatus createdAt')
      .sort({ updatedAt: -1 });
    res.status(200).json({ success: true, count: appeals.length, appeals });
  } catch (err) {
    next(err);
  }
};

// @desc    Resolve an appeal
// @route   PUT /api/admin/appeals/:userId
// @access  Private (ADMIN)
const resolveAppeal = async (req, res, next) => {
  try {
    const { action } = req.body; // 'unban', 'reject'
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (action === 'unban') {
      user.isBanned = false;
      user.banReason = '';
      user.appealText = '';
      user.appealStatus = 'Reviewed'; // Keeps a record
      await user.save();
      
      // Optionally re-activate Candidate Profile
      if (user.role === 'CANDIDATE') {
        await CandidateProfile.findOneAndUpdate({ user: user._id }, { isActive: true });
      }

    } else if (action === 'reject') {
      user.appealStatus = 'Rejected';
      await user.save();
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    res.status(200).json({ success: true, message: 'Appeal resolved' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all banned users
// @route   GET /api/admin/banned-users
// @access  Private (ADMIN)
const getBannedUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isBanned: true })
      .select('name email role banReason appealStatus createdAt updatedAt')
      .sort({ updatedAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
};

// @desc    Unban user directly
// @route   PUT /api/admin/banned-users/:id/unban
// @access  Private (ADMIN)
const unbanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isBanned = false;
    user.banReason = '';
    user.appealText = '';
    user.appealStatus = 'None';
    await user.save();

    if (user.role === 'CANDIDATE') {
      await CandidateProfile.findOneAndUpdate({ user: user._id }, { isActive: true });
    }

    res.status(200).json({ success: true, message: 'User unbanned successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { 
  getAnalytics, getAllUsers, verifyRecruiter, createOrUpdateLevel, 
  getLevels, addQuestion, getQuestions, deleteQuestion, searchCandidates,
  getReports, resolveReport, getAppeals, resolveAppeal,
  getBannedUsers, unbanUser
};
