const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const Interview = require('../models/Interview');
const Job = require('../models/Job');
const Application = require('../models/Application');
const InterviewLevel = require('../models/InterviewLevel');
const QuestionBank = require('../models/QuestionBank');
const ActivityLog = require('../models/ActivityLog');
const AiAgentInterview = require('../models/AiAgentInterview');
const TeamInterview = require('../models/TeamInterview');
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

// Helper: Get candidate appropriate interview matching profile level verdict calculation
const getCandidateAppropriateInterview = async (userId, requiredStacks = []) => {
  const [standardHistory, aiHistory, zoomHistory] = await Promise.all([
    Interview.find({ candidate: userId, status: 'completed' })
      .select('level stack totalScore passed completedAt feedback')
      .lean(),
    AiAgentInterview.find({ candidate: userId, status: 'completed' })
      .select('level stack totalScore passed completedAt feedback')
      .lean(),
    TeamInterview.find({ candidate: userId, status: 'completed', resultReleasedAt: { $ne: null } })
      .select('level stack interviewerScore passed completedAt interviewerFeedback')
      .lean(),
  ]);

  const formattedStandard = standardHistory.map(iv => ({ ...iv, evaluator: 'Normal Query' }));
  const formattedAi = aiHistory.map(iv => ({ ...iv, evaluator: 'AI Agent' }));
  const formattedZoom = zoomHistory.map(iv => ({
    ...iv,
    totalScore: iv.interviewerScore,
    feedback: iv.interviewerFeedback,
    evaluator: 'Human Team',
  }));

  const interviewHistory = [...formattedStandard, ...formattedAi, ...formattedZoom].sort(
    (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
  );

  // Calculate Highest Priority Verdicts per Level (matches profileController logic)
  const evaluatorPriority = { 'Human Team': 3, 'AI Agent': 2, 'Normal Query': 1 };
  const passedInterviews = interviewHistory.filter(iv => iv.passed);
  const levelVerdictsMap = {};

  passedInterviews.forEach(iv => {
    const currentHighest = levelVerdictsMap[iv.level];
    if (!currentHighest) {
      levelVerdictsMap[iv.level] = iv;
    } else {
      const currentPrio = evaluatorPriority[currentHighest.evaluator] || 0;
      const newPrio = evaluatorPriority[iv.evaluator] || 0;
      if (newPrio > currentPrio || (newPrio === currentPrio && iv.totalScore > currentHighest.totalScore)) {
        levelVerdictsMap[iv.level] = iv;
      }
    }
  });

  const calculatedCurrentLevel = passedInterviews.length > 0
    ? Math.max(...passedInterviews.map(i => i.level))
    : 0;

  let appropriateInterview = null;

  // If specific required stacks were queried, find the candidate's highest passed matching verdict for those stacks
  if (Array.isArray(requiredStacks) && requiredStacks.length > 0) {
    for (const reqStack of requiredStacks) {
      if (!reqStack) continue;
      const regex = new RegExp(`^${reqStack}$`, 'i');
      const matchingPassed = passedInterviews
        .filter(iv => regex.test(iv.stack))
        .sort((a, b) => {
          if (b.level !== a.level) return b.level - a.level;
          const prioB = evaluatorPriority[b.evaluator] || 0;
          const prioA = evaluatorPriority[a.evaluator] || 0;
          if (prioB !== prioA) return prioB - prioA;
          return b.totalScore - a.totalScore;
        });

      if (matchingPassed.length > 0) {
        appropriateInterview = matchingPassed[0];
        break;
      }
    }
  }

  // Default to highest level appropriate verdict shown in candidate profile
  if (!appropriateInterview) {
    if (calculatedCurrentLevel > 0 && levelVerdictsMap[calculatedCurrentLevel]) {
      appropriateInterview = levelVerdictsMap[calculatedCurrentLevel];
    } else if (interviewHistory.length > 0) {
      appropriateInterview = interviewHistory[0];
    }
  }

  const calculatedScore = calculatedCurrentLevel > 0 && levelVerdictsMap[calculatedCurrentLevel]
    ? levelVerdictsMap[calculatedCurrentLevel].totalScore || 0
    : interviewHistory.length > 0 ? (interviewHistory[0].totalScore || 0) : 0;

  return {
    calculatedCurrentLevel,
    calculatedScore,
    appropriateInterview,
    levelVerdictsMap,
  };
};

// @desc    Search candidates
// @route   GET /api/admin/candidates/search
// @access  Private (ADMIN, RECRUITER)
const searchCandidates = async (req, res, next) => {
  try {
    const { minExp, availability, page = 1, limit = 20, requirements } = req.query;

    let passedCandidates = null; // null means no restrictions yet
    let requiredStacks = [];

    // Handle new multi-stack requirements array
    if (requirements) {
      try {
        const reqs = JSON.parse(requirements); // Array of {stack, level, minScore}
        if (Array.isArray(reqs) && reqs.length > 0) {
          requiredStacks = reqs.map(r => r.stack).filter(Boolean);
          let candidateSets = [];
          
          for (const req of reqs) {
            const stackRegex = req.stack ? new RegExp(`^${req.stack.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') : null;
            const minLevel = req.level ? parseInt(req.level) : 1;
            const minScore = req.minScore ? parseInt(req.minScore) : 0;

            const query = {
              status: 'completed',
              passed: true,
              level: { $gte: minLevel },
              totalScore: { $gte: minScore },
            };
            if (stackRegex) {
              query.$or = [{ stack: stackRegex }, { sector: stackRegex }];
            }

            const zoomQuery = {
              status: 'completed',
              passed: true,
              level: { $gte: minLevel },
              interviewerScore: { $gte: minScore },
            };
            if (stackRegex) {
              zoomQuery.$or = [{ stack: stackRegex }, { sector: stackRegex }];
            }
            
            // Find candidates matching this specific requirement in Standard, AI, and Team interviews based on method
            let stdMatches = [];
            let aiMatches = [];
            let zoomMatches = [];

            if (req.method !== 'AI' && req.method !== 'Human') {
              stdMatches = await Interview.distinct('candidate', query);
            }
            if (req.method !== 'Standard' && req.method !== 'Human') {
              aiMatches = await AiAgentInterview.distinct('candidate', query);
            }
            if (req.method !== 'Standard' && req.method !== 'AI') {
              zoomMatches = await TeamInterview.distinct('candidate', zoomQuery);
            }
            
            // Combine and unique the candidates who satisfied THIS requirement
            const matchesForThisReq = [...new Set([
              ...stdMatches.map(id => id.toString()),
              ...aiMatches.map(id => id.toString()),
              ...zoomMatches.map(id => id.toString()),
            ])];
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
        if (stack) requiredStacks.push(stack);
        const legacyQuery = { status: 'completed', passed: true };
        if (level) legacyQuery.level = parseInt(level);
        if (minScore || maxScore) {
          legacyQuery.totalScore = {};
          if (minScore) legacyQuery.totalScore.$gte = parseInt(minScore);
          if (maxScore) legacyQuery.totalScore.$lte = parseInt(maxScore);
        }

        const zoomLegacyQuery = { status: 'completed', passed: true, resultReleasedAt: { $ne: null } };
        if (level) zoomLegacyQuery.level = parseInt(level);
        if (minScore || maxScore) {
          zoomLegacyQuery.interviewerScore = {};
          if (minScore) zoomLegacyQuery.interviewerScore.$gte = parseInt(minScore);
          if (maxScore) zoomLegacyQuery.interviewerScore.$lte = parseInt(maxScore);
        }
        
        let legacyCandidates = [];
        if (Object.keys(legacyQuery).length > 2) {
           const stdLegacy = await Interview.distinct('candidate', legacyQuery);
           const aiLegacy = await AiAgentInterview.distinct('candidate', legacyQuery);
           const zoomLegacy = await TeamInterview.distinct('candidate', zoomLegacyQuery);
           legacyCandidates = [...new Set([
             ...stdLegacy.map(id => id.toString()),
             ...aiLegacy.map(id => id.toString()),
             ...zoomLegacy.map(id => id.toString()),
           ])];
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

    // Enrich with appropriate interview score matching profile level verdicts
    const enriched = await Promise.all(
      profiles.map(async (p) => {
        if (!p.user) return p.toObject();

        const { calculatedCurrentLevel, calculatedScore, appropriateInterview } =
          await getCandidateAppropriateInterview(p.user._id, requiredStacks);

        // Keep profile synchronization in DB
        if (p.currentLevel !== calculatedCurrentLevel || p.overallScore !== calculatedScore) {
          p.currentLevel = calculatedCurrentLevel;
          p.overallScore = calculatedScore;
          await CandidateProfile.findByIdAndUpdate(p._id, {
            currentLevel: calculatedCurrentLevel,
            overallScore: calculatedScore,
          });
        }

        const bestInterview = appropriateInterview ? {
          _id: appropriateInterview._id,
          level: appropriateInterview.level,
          totalScore: appropriateInterview.totalScore,
          stack: appropriateInterview.stack,
          evaluator: appropriateInterview.evaluator,
        } : null;

        return {
          ...p.toObject(),
          currentLevel: calculatedCurrentLevel,
          overallScore: calculatedScore,
          bestInterview,
        };
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
      .populate('reporter', 'name email role profileImage')
      .populate('reportedUser', 'name email role profileImage isBanned createdAt')
      .populate({
        path: 'reportedJob',
        select: 'title description sector status location isRemote salaryMin salaryMax requirements experienceRequired createdAt recruiter',
        populate: { path: 'recruiter', select: 'name email profileImage role isBanned' },
      })
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
      .select('name email role profileImage isBanned banReason appealText appealStatus createdAt updatedAt')
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
      .select('name email role profileImage banReason appealStatus createdAt updatedAt')
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
