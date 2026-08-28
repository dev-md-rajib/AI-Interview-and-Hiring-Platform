const CandidateProfile = require('../models/CandidateProfile');
const User = require('../models/User');
const Interview = require('../models/Interview');
const AiAgentInterview = require('../models/AiAgentInterview');
const TeamInterview = require('../models/TeamInterview');
const Job = require('../models/Job');
const Contest = require('../models/Contest');

// @desc    Get my candidate profile
// @route   GET /api/profile/me
// @access  Private (CANDIDATE)
const getMyProfile = async (req, res, next) => {
  try {
    let profile = await CandidateProfile.findOne({ user: req.user._id }).populate('user', 'name email profileImage');
    if (!profile) {
      profile = await CandidateProfile.create({ user: req.user._id });
    }

    // Attach interview history (combine all interview types with full feedback)
    const standardHistory = await Interview.find({ candidate: req.user._id, status: 'completed' })
      .select('level stack totalScore passed completedAt feedback strengths weaknesses')
      .lean();
    const aiHistory = await AiAgentInterview.find({ candidate: req.user._id, status: 'completed' })
      .select('level stack totalScore passed completedAt feedback strengths weaknesses recommendations')
      .lean();
    const zoomHistory = await TeamInterview.find({ candidate: req.user._id, status: 'completed', resultReleasedAt: { $ne: null } })
      .select('level stack interviewerScore passed completedAt interviewerFeedback interviewerStrengths interviewerWeaknesses interviewer')
      .populate('interviewer', 'name profileImage')
      .lean();

    const formattedStandard = standardHistory.map(iv => ({
      ...iv,
      evaluator: 'Normal Query',
      feedback: iv.feedback || '',
      strengths: iv.strengths || [],
      weaknesses: iv.weaknesses || [],
    }));
    const formattedAi = aiHistory.map(iv => ({
      ...iv,
      evaluator: 'AI Agent',
      feedback: iv.feedback || '',
      strengths: iv.strengths || [],
      weaknesses: iv.weaknesses || [],
      recommendations: iv.recommendations || '',
    }));
    const formattedZoom = zoomHistory.map(iv => ({
      ...iv,
      totalScore: iv.interviewerScore,
      feedback: iv.interviewerFeedback || '',
      strengths: iv.interviewerStrengths || [],
      weaknesses: iv.interviewerWeaknesses || [],
      evaluator: 'Human Team',
    }));

    const interviewHistory = [...formattedStandard, ...formattedAi, ...formattedZoom].sort(
      (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
    );

    // Calculate Highest Priority Verdicts per Level
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

    const levelVerdicts = Object.values(levelVerdictsMap).sort((a, b) => a.level - b.level);

    // Synchronize and calculate currentLevel from all passed interviews
    const calculatedCurrentLevel = passedInterviews.length > 0
      ? Math.max(...passedInterviews.map(i => i.level))
      : 0;

    // Overall score is from the interview in which the current level was achieved/selected
    let calculatedScore = 0;
    if (calculatedCurrentLevel > 0 && levelVerdictsMap[calculatedCurrentLevel]) {
      calculatedScore = levelVerdictsMap[calculatedCurrentLevel].totalScore || 0;
    } else if (interviewHistory.length > 0) {
      calculatedScore = interviewHistory[0].totalScore || 0;
    }

    if (profile.currentLevel !== calculatedCurrentLevel || profile.overallScore !== calculatedScore) {
      profile.currentLevel = calculatedCurrentLevel;
      profile.overallScore = calculatedScore;
      await CandidateProfile.findByIdAndUpdate(profile._id, {
        currentLevel: calculatedCurrentLevel,
        overallScore: calculatedScore,
      });
    }

    res.status(200).json({ success: true, profile, interviewHistory, levelVerdicts });
  } catch (err) {
    next(err);
  }
};

// @desc    Update candidate profile
// @route   PUT /api/profile/me
// @access  Private (CANDIDATE)
const updateProfile = async (req, res, next) => {
  try {
    const { expertise, yearsOfExperience, education, certifications, bio, linkedIn, github, website, availability } = req.body;

    const profile = await CandidateProfile.findOneAndUpdate(
      { user: req.user._id },
      { expertise, yearsOfExperience, education, certifications, bio, linkedIn, github, website, availability },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Update skills
// @route   PUT /api/profile/skills
// @access  Private (CANDIDATE)
const updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;
    const profile = await CandidateProfile.findOneAndUpdate(
      { user: req.user._id },
      { skills },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, skills: profile.skills });
  } catch (err) {
    next(err);
  }
};

// @desc    Add portfolio item
// @route   POST /api/profile/portfolio
// @access  Private (CANDIDATE)
const addPortfolioItem = async (req, res, next) => {
  try {
    const { title, description, mediaUrl, mediaType } = req.body;
    const profile = await CandidateProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.portfolioTimeline.unshift({ title, description, mediaUrl, mediaType });
    await profile.save();

    res.status(201).json({ success: true, portfolio: profile.portfolioTimeline });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete portfolio item
// @route   DELETE /api/profile/portfolio/:itemId
// @access  Private (CANDIDATE)
const deletePortfolioItem = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    profile.portfolioTimeline = profile.portfolioTimeline.filter(
      (item) => item._id.toString() !== req.params.itemId
    );
    await profile.save();

    res.status(200).json({ success: true, portfolio: profile.portfolioTimeline });
  } catch (err) {
    next(err);
  }
};

// @desc    Get public candidate profile (for recruiters)
// @route   GET /api/profile/:userId
// @access  Private (RECRUITER, ADMIN)
const getPublicProfile = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.userId).select('name email role profileImage isBanned banReason createdAt isVerified');
    if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });

    let profile = await CandidateProfile.findOne({ user: req.params.userId })
      .populate('user', 'name email profileImage createdAt role isBanned isVerified');

    if (!profile) {
      profile = {
        _id: targetUser._id,
        user: targetUser,
        bio: `${targetUser.role} Account`,
        yearsOfExperience: 0,
        expertise: [],
        availability: 'Available',
        portfolio: [],
        currentLevel: 0,
        overallScore: 0,
      };
    }

    const standardHistory = await Interview.find({ candidate: req.params.userId, status: 'completed' })
      .select('level stack totalScore passed completedAt feedback strengths weaknesses')
      .lean();
    const aiHistory = await AiAgentInterview.find({ candidate: req.params.userId, status: 'completed' })
      .select('level stack totalScore passed completedAt feedback strengths weaknesses recommendations')
      .lean();
    const zoomHistory = await TeamInterview.find({ candidate: req.params.userId, status: 'completed', resultReleasedAt: { $ne: null } })
      .select('level stack interviewerScore passed completedAt interviewerFeedback interviewerStrengths interviewerWeaknesses interviewer')
      .populate('interviewer', 'name profileImage')
      .lean();

    const formattedStandard = standardHistory.map(iv => ({
      ...iv,
      evaluator: 'Normal Query',
      feedback: iv.feedback || '',
      strengths: iv.strengths || [],
      weaknesses: iv.weaknesses || [],
    }));
    const formattedAi = aiHistory.map(iv => ({
      ...iv,
      evaluator: 'AI Agent',
      feedback: iv.feedback || '',
      strengths: iv.strengths || [],
      weaknesses: iv.weaknesses || [],
      recommendations: iv.recommendations || '',
    }));
    const formattedZoom = zoomHistory.map(iv => ({
      ...iv,
      totalScore: iv.interviewerScore,
      feedback: iv.interviewerFeedback || '',
      strengths: iv.interviewerStrengths || [],
      weaknesses: iv.interviewerWeaknesses || [],
      evaluator: 'Human Team',
    }));

    const interviewHistory = [...formattedStandard, ...formattedAi, ...formattedZoom].sort(
      (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
    );

    // Calculate Highest Priority Verdicts per Level
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

    const levelVerdicts = Object.values(levelVerdictsMap).sort((a, b) => a.level - b.level);

    // Synchronize and calculate currentLevel from all passed interviews
    const calculatedCurrentLevel = passedInterviews.length > 0
      ? Math.max(...passedInterviews.map(i => i.level))
      : 0;

    // Overall score is from the interview in which the current level was achieved/selected
    let calculatedScore = 0;
    if (calculatedCurrentLevel > 0 && levelVerdictsMap[calculatedCurrentLevel]) {
      calculatedScore = levelVerdictsMap[calculatedCurrentLevel].totalScore || 0;
    } else if (interviewHistory.length > 0) {
      calculatedScore = interviewHistory[0].totalScore || 0;
    }

    if (profile.currentLevel !== calculatedCurrentLevel || profile.overallScore !== calculatedScore) {
      profile.currentLevel = calculatedCurrentLevel;
      profile.overallScore = calculatedScore;
      await CandidateProfile.findByIdAndUpdate(profile._id, {
        currentLevel: calculatedCurrentLevel,
        overallScore: calculatedScore,
      });
    }

    res.status(200).json({ success: true, profile, interviewHistory, levelVerdicts });
  } catch (err) {
    next(err);
  }
};

// @desc    Get recruiter's own profile & activity
// @route   GET /api/profile/recruiter/me
// @access  Private (RECRUITER)
const getMyRecruiterProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    const contests = await Contest.find({ recruiter: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, user, jobs, contests });
  } catch (err) {
    next(err);
  }
};

// @desc    Update recruiter's profile
// @route   PUT /api/profile/recruiter/me
// @access  Private (RECRUITER)
const updateRecruiterProfile = async (req, res, next) => {
  try {
    const { name, profileImage, recruiterProfile } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (recruiterProfile) {
      user.recruiterProfile = {
        ...(user.recruiterProfile?.toObject ? user.recruiterProfile.toObject() : (user.recruiterProfile || {})),
        ...recruiterProfile,
      };
    }

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc    Get public recruiter profile (for candidates, recruiters, admins)
// @route   GET /api/profile/recruiter/:id
// @access  Private
const getPublicRecruiterProfile = async (req, res, next) => {
  try {
    const recruiter = await User.findById(req.params.id)
      .select('name email role profileImage isVerified recruiterProfile createdAt');
    if (!recruiter || recruiter.role !== 'RECRUITER') {
      return res.status(404).json({ success: false, message: 'Recruiter profile not found' });
    }

    const jobs = await Job.find({ recruiter: recruiter._id, status: 'Open' }).sort({ createdAt: -1 });
    const contests = await Contest.find({ recruiter: recruiter._id, status: { $in: ['active', 'ended', 'published'] } })
      .select('-codingRound.questions.testCases.expectedOutput -mcqRound.questions.correctAnswer')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, recruiter, jobs, contests });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyProfile,
  updateProfile,
  updateSkills,
  addPortfolioItem,
  deletePortfolioItem,
  getPublicProfile,
  getMyRecruiterProfile,
  updateRecruiterProfile,
  getPublicRecruiterProfile,
};
