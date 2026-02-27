const Interview = require('../models/Interview');
const InterviewLevel = require('../models/InterviewLevel');
const CandidateProfile = require('../models/CandidateProfile');
const { generateQuestions, scoreAnswer, generateFeedback } = require('../services/aiService');
const logger = require('../config/logger');

// Check if candidate is eligible for a level
const checkEligibility = async (candidateId, level) => {
  if (level === 1) return { eligible: true };

  // Must have passed previous level
  const prevPassed = await Interview.findOne({
    candidate: candidateId,
    level: level - 1,
    status: 'completed',
    passed: true,
  });

  if (!prevPassed) {
    return { eligible: false, reason: `You must pass Level ${level - 1} first` };
  }

  const levelConfig = await InterviewLevel.findOne({ level: level - 1 });
  if (levelConfig && prevPassed.totalScore < levelConfig.minimumPassScore) {
    return {
      eligible: false,
      reason: `Minimum score of ${levelConfig.minimumPassScore} required for Level ${level - 1}`,
    };
  }

  return { eligible: true };
};

// @desc    Check interview eligibility
// @route   GET /api/interviews/eligibility/:level
// @access  Private (CANDIDATE)
const getEligibility = async (req, res, next) => {
  try {
    const level = parseInt(req.params.level);
    if (![1, 2, 3].includes(level)) {
      return res.status(400).json({ success: false, message: 'Invalid level' });
    }

    const eligibility = await checkEligibility(req.user._id, level);

    // Check attempt limits (max 3 per level per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attemptsToday = await Interview.countDocuments({
      candidate: req.user._id,
      level,
      createdAt: { $gte: today },
    });

    res.status(200).json({
      success: true,
      eligible: eligibility.eligible,
      reason: eligibility.reason || null,
      attemptsToday,
      maxAttemptsPerDay: 3,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Start a new interview session
// @route   POST /api/interviews/start
// @access  Private (CANDIDATE)
const startInterview = async (req, res, next) => {
  try {
    const { level, stack } = req.body;
    if (!level || !stack) {
      return res.status(400).json({ success: false, message: 'Level and stack are required' });
    }

    const parsedLevel = parseInt(level);
    if (![1, 2, 3].includes(parsedLevel)) {
      return res.status(400).json({ success: false, message: 'Level must be 1, 2, or 3' });
    }

    // Eligibility check
    const eligibility = await checkEligibility(req.user._id, parsedLevel);
    if (!eligibility.eligible) {
      return res.status(403).json({ success: false, message: eligibility.reason });
    }

    // Attempt limit check
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attemptsToday = await Interview.countDocuments({
      candidate: req.user._id,
      level: parsedLevel,
      createdAt: { $gte: today },
    });
    if (attemptsToday >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Maximum 3 interview attempts per level per day reached. Please try again tomorrow.',
      });
    }

    // Get attempt number
    const totalAttempts = await Interview.countDocuments({ candidate: req.user._id, level: parsedLevel });

    // Generate questions via AI
    logger.info(`Generating questions for ${stack} Level ${parsedLevel}...`);
    const levelConfig = await InterviewLevel.findOne({ level: parsedLevel });
    const questionCount = levelConfig?.questionCount || 10;
    const questions = await generateQuestions(stack, parsedLevel, questionCount);

    // Create interview session
    const interview = await Interview.create({
      candidate: req.user._id,
      level: parsedLevel,
      stack,
      questions,
      status: 'active',
      startedAt: new Date(),
      attemptNumber: totalAttempts + 1,
    });

    logger.info(`Interview started: ${interview._id} for user ${req.user._id}`);

    // Return questions without correct answers for security
    const safeQuestions = interview.questions.map((q, idx) => ({
      index: idx,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options,
      skill: q.skill,
      difficulty: q.difficulty,
    }));

    res.status(201).json({
      success: true,
      interviewId: interview._id,
      level: parsedLevel,
      stack,
      totalQuestions: safeQuestions.length,
      durationMinutes: levelConfig?.durationMinutes || 60,
      questions: safeQuestions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit interview answers and score
// @route   POST /api/interviews/:id/submit
// @access  Private (CANDIDATE)
const submitInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    if (interview.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (interview.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Interview is not active' });
    }

    const { answers } = req.body; // array of { questionIndex, answer }
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers array required' });
    }

    // Score each answer
    logger.info(`Scoring ${answers.length} answers for interview ${interview._id}...`);
    const scoredAnswers = [];
    const skillScores = {};
    const skillCounts = {};

    for (const ans of answers) {
      const question = interview.questions[ans.questionIndex];
      if (!question) continue;

      const { score, feedback } = await scoreAnswer(question, ans.answer, interview.stack);
      scoredAnswers.push({
        questionIndex: ans.questionIndex,
        answer: ans.answer,
        aiScore: score,
        aiFeedback: feedback,
        isCorrect: score >= 60,
      });

      // Accumulate skill scores
      const skill = question.skill || 'General';
      skillScores[skill] = (skillScores[skill] || 0) + score;
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    }

    // Average skill scores
    const avgSkillScores = {};
    for (const skill of Object.keys(skillScores)) {
      avgSkillScores[skill] = Math.round(skillScores[skill] / skillCounts[skill]);
    }

    // Calculate total score
    const totalScore = scoredAnswers.length > 0
      ? Math.round(scoredAnswers.reduce((sum, a) => sum + a.aiScore, 0) / scoredAnswers.length)
      : 0;

    // Get pass threshold
    const levelConfig = await InterviewLevel.findOne({ level: interview.level });
    const passMark = levelConfig?.minimumPassScore || 70;
    const passed = totalScore >= passMark;

    // Generate AI feedback
    const feedbackData = await generateFeedback(interview.stack, interview.level, avgSkillScores, passed, totalScore);

    // Update interview
    interview.answers = scoredAnswers;
    interview.skillScores = avgSkillScores;
    interview.totalScore = totalScore;
    interview.passed = passed;
    interview.feedback = feedbackData.summary || '';
    interview.strengths = feedbackData.strengths || [];
    interview.weaknesses = feedbackData.weaknesses || [];
    interview.status = 'completed';
    interview.completedAt = new Date();
    interview.nextLevelEligible = passed && interview.level < 3;
    await interview.save();

    // Update candidate profile
    if (passed) {
      await CandidateProfile.findOneAndUpdate(
        { user: req.user._id },
        {
          $max: { currentLevel: interview.level },
          $max: { overallScore: totalScore },
        }
      );
    }

    logger.info(`Interview ${interview._id} completed. Score: ${totalScore}, Passed: ${passed}`);

    res.status(200).json({
      success: true,
      interviewId: interview._id,
      totalScore,
      passed,
      passMark,
      skillScores: avgSkillScores,
      strengths: interview.strengths,
      weaknesses: interview.weaknesses,
      feedback: interview.feedback,
      recommendations: feedbackData.recommendations,
      nextLevelEligible: interview.nextLevelEligible,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get interview result by ID
// @route   GET /api/interviews/:id/result
// @access  Private
const getInterviewResult = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id).populate('candidate', 'name email');
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });

    // Must be own interview or recruiter/admin
    if (
      interview.candidate._id.toString() !== req.user._id.toString() &&
      !['RECRUITER', 'ADMIN'].includes(req.user.role)
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, interview });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all my interviews
// @route   GET /api/interviews/my
// @access  Private (CANDIDATE)
const getMyInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ candidate: req.user._id })
      .select('level stack totalScore passed status startedAt completedAt')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: interviews.length, interviews });
  } catch (err) {
    next(err);
  }
};

// @desc    Abandon interview
// @route   PUT /api/interviews/:id/abandon
// @access  Private (CANDIDATE)
const abandonInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, candidate: req.user._id, status: 'active' },
      { status: 'abandoned' },
      { new: true }
    );
    if (!interview) return res.status(404).json({ success: false, message: 'Active interview not found' });
    res.status(200).json({ success: true, message: 'Interview abandoned' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getEligibility, startInterview, submitInterview, getInterviewResult, getMyInterviews, abandonInterview };
