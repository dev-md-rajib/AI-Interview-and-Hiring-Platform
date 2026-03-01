const CandidateProfile = require('../models/CandidateProfile');
const Interview = require('../models/Interview');
const AiAgentInterview = require('../models/AiAgentInterview');

// @desc    Get my candidate profile
// @route   GET /api/profile/me
// @access  Private (CANDIDATE)
const getMyProfile = async (req, res, next) => {
  try {
    let profile = await CandidateProfile.findOne({ user: req.user._id }).populate('user', 'name email profileImage');
    if (!profile) {
      profile = await CandidateProfile.create({ user: req.user._id });
    }

    // Attach interview history (combine both types)
    const standardHistory = await Interview.find({ candidate: req.user._id, status: 'completed' })
      .select('level stack totalScore passed completedAt feedback')
      .lean();
    const aiHistory = await AiAgentInterview.find({ candidate: req.user._id, status: 'completed' })
      .select('level stack totalScore passed completedAt feedback')
      .lean();

    const formattedStandard = standardHistory.map(iv => ({ ...iv, evaluator: 'Normal Query' }));
    const formattedAi = aiHistory.map(iv => ({ ...iv, evaluator: 'AI Agent' }));

    const interviewHistory = [...formattedStandard, ...formattedAi].sort(
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
        
        // If higher priority evaluator, OR same priority but higher score, replace it.
        if (newPrio > currentPrio || (newPrio === currentPrio && iv.totalScore > currentHighest.totalScore)) {
          levelVerdictsMap[iv.level] = iv;
        }
      }
    });

    const levelVerdicts = Object.values(levelVerdictsMap).sort((a, b) => a.level - b.level);

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
    const profile = await CandidateProfile.findOne({ user: req.params.userId })
      .populate('user', 'name email profileImage createdAt');

    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    const standardHistory = await Interview.find({ candidate: req.params.userId, status: 'completed' })
      .select('level stack totalScore passed completedAt')
      .lean();
    const aiHistory = await AiAgentInterview.find({ candidate: req.params.userId, status: 'completed' })
      .select('level stack totalScore passed completedAt')
      .lean();

    const formattedStandard = standardHistory.map(iv => ({ ...iv, evaluator: 'Normal Query' }));
    const formattedAi = aiHistory.map(iv => ({ ...iv, evaluator: 'AI Agent' }));

    const interviewHistory = [...formattedStandard, ...formattedAi].sort(
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
        
        // If higher priority evaluator, OR same priority but higher score, replace it.
        if (newPrio > currentPrio || (newPrio === currentPrio && iv.totalScore > currentHighest.totalScore)) {
          levelVerdictsMap[iv.level] = iv;
        }
      }
    });

    const levelVerdicts = Object.values(levelVerdictsMap).sort((a, b) => a.level - b.level);

    res.status(200).json({ success: true, profile, interviewHistory, levelVerdicts });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyProfile, updateProfile, updateSkills, addPortfolioItem, deletePortfolioItem, getPublicProfile };
