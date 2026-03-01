const AiAgentInterview = require('../models/AiAgentInterview');
const { startSession, getNextResponse, evaluateInterview, getLevelSpec, LEVEL_SPECS } = require('../services/aiAgentService');
const logger = require('../config/logger');

// @desc  Get level specifications for AI Agent interview
// @route GET /api/interviews/ai-agent/level-specs
// @access Private (CANDIDATE)
const getLevelSpecs = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, levelSpecs: LEVEL_SPECS });
  } catch (err) {
    next(err);
  }
};

// @desc  Start a new AI Agent interview session
// @route POST /api/interviews/ai-agent/start
// @access Private (CANDIDATE)
const startAiAgentInterview = async (req, res, next) => {
  try {
    const { stack, level } = req.body;
    if (!stack || !level) {
      return res.status(400).json({ success: false, message: 'Stack and level are required' });
    }

    const parsedLevel = parseInt(level);
    if (![1, 2, 3].includes(parsedLevel)) {
      return res.status(400).json({ success: false, message: 'Level must be 1, 2, or 3' });
    }

    const levelSpec = getLevelSpec(parsedLevel);

    // Call Gemini via startChat() to get the first question
    logger.info(`Starting AI agent session for ${stack} Level ${parsedLevel}`);
    const firstResponse = await startSession(stack, parsedLevel);

    // Create interview record with the first question in transcript
    const interview = await AiAgentInterview.create({
      candidate: req.user._id,
      stack,
      level: parsedLevel,
      levelSpec: levelSpec.description,
      status: 'active',
      questionCount: 0,
      startedAt: new Date(),
      transcript: [
        {
          role: 'interviewer',
          content: firstResponse.message,
          isCodingQuestion: firstResponse.isCodingQuestion,
        },
      ],
    });

    logger.info(`AI agent interview started: ${interview._id}`);

    res.status(201).json({
      success: true,
      interviewId: interview._id,
      stack,
      level: parsedLevel,
      levelSpec: levelSpec.description,
      levelTopics: levelSpec.topics,
      estimatedMinutes: levelSpec.estimatedMinutes,
      totalQuestions: firstResponse.totalQuestions,
      currentResponse: {
        message: firstResponse.message,
        isCodingQuestion: firstResponse.isCodingQuestion,
        isFollowUp: firstResponse.isFollowUp || false,
        questionNumber: firstResponse.questionNumber,
        totalQuestions: firstResponse.totalQuestions,
        done: firstResponse.done,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Send candidate answer and get next AI question
// @route POST /api/interviews/ai-agent/:id/respond
// @access Private (CANDIDATE)
const respondToAiAgent = async (req, res, next) => {
  try {
    const interview = await AiAgentInterview.findById(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    if (interview.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (interview.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Interview is not active' });
    }

    const { answer, isCodingAnswer } = req.body;
    if (!answer || typeof answer !== 'string') {
      return res.status(400).json({ success: false, message: 'Answer is required' });
    }

    // Snapshot the transcript BEFORE the new answer.
    // In the chat API pattern:
    //   → transcript snapshot → becomes the startChat() history (context)
    //   → latestAnswer        → becomes the chat.sendMessage() call (new turn)
    const transcriptSnapshot = interview.transcript.map((t) => ({
      role: t.role,
      content: t.content,
    }));

    const answerContent = isCodingAnswer ? `[Code Answer]\n${answer}` : answer;

    // Append candidate answer to DB transcript
    interview.transcript.push({
      role: 'candidate',
      content: answerContent,
      isCodingQuestion: false,
    });
    interview.questionCount += 1;

    const nextQuestionNumber = interview.questionCount + 1;

    // Get next question via Gemini chat API.
    // transcriptSnapshot hydrates chat history; answerContent is the new sendMessage.
    const nextResponse = await getNextResponse(
      interview.stack,
      interview.level,
      transcriptSnapshot,
      nextQuestionNumber,
      answerContent
    );

    // Append AI's next response to transcript
    interview.transcript.push({
      role: 'interviewer',
      content: nextResponse.message,
      isCodingQuestion: nextResponse.isCodingQuestion,
    });
    await interview.save();

    res.status(200).json({
      success: true,
      done: nextResponse.done,
      currentResponse: {
        message: nextResponse.message,
        isCodingQuestion: nextResponse.isCodingQuestion,
        isFollowUp: nextResponse.isFollowUp || false,
        questionNumber: nextResponse.questionNumber,
        totalQuestions: nextResponse.totalQuestions,
        done: nextResponse.done,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  End interview and get verdict
// @route POST /api/interviews/ai-agent/:id/end
// @access Private (CANDIDATE)
const endAiAgentInterview = async (req, res, next) => {
  try {
    const { cheatCount = 0 } = req.body;
    
    const interview = await AiAgentInterview.findById(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    if (interview.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    if (interview.status === 'completed') {
      return res.status(200).json({
        success: true,
        totalScore: interview.totalScore,
        codingScore: interview.codingScore,
        conceptScore: interview.conceptScore,
        cheatCount: interview.cheatCount,
        trustScore: interview.trustScore,
        passed: interview.passed,
        passMark: interview.passMark,
        feedback: interview.feedback,
        strengths: interview.strengths,
        weaknesses: interview.weaknesses,
        recommendations: interview.recommendations,
        stack: interview.stack,
        level: interview.level,
      });
    }

    logger.info(`Evaluating AI agent interview ${interview._id}...`);

    const evaluation = await evaluateInterview(
      interview.stack,
      interview.level,
      interview.transcript.map((t) => ({ role: t.role, content: t.content }))
    );

    const levelSpec = getLevelSpec(interview.level);
    
    // Calculate Trust Score (Deduct 10% per cheat detected)
    const trustScore = Math.max(0, 100 - (cheatCount * 10));

    interview.status = 'completed';
    interview.completedAt = new Date();
    interview.totalScore = evaluation.totalScore;
    interview.passed = evaluation.passed;
    interview.passMark = levelSpec.passMark;
    interview.feedback = evaluation.feedback;
    interview.strengths = evaluation.strengths || [];
    interview.weaknesses = evaluation.weaknesses || [];
    interview.recommendations = evaluation.recommendations || '';
    interview.codingScore = evaluation.codingScore || evaluation.totalScore;
    interview.conceptScore = evaluation.conceptScore || evaluation.totalScore;
    interview.cheatCount = cheatCount;
    interview.trustScore = trustScore;
    await interview.save();

    // Update candidate profile if passed
    if (evaluation.passed) {
      const CandidateProfile = require('../models/CandidateProfile');
      await CandidateProfile.findOneAndUpdate(
        { user: req.user._id },
        {
          $max: { currentLevel: interview.level },
          $max: { overallScore: evaluation.totalScore },
        }
      );
    }

    logger.info(`AI agent interview ${interview._id} evaluated. Score: ${evaluation.totalScore}, Passed: ${evaluation.passed}`);

    res.status(200).json({
      success: true,
      interviewId: interview._id,
      totalScore: evaluation.totalScore,
      codingScore: evaluation.codingScore || evaluation.totalScore,
      conceptScore: evaluation.conceptScore || evaluation.totalScore,
      cheatCount,
      trustScore,
      passed: evaluation.passed,
      passMark: levelSpec.passMark,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || [],
      recommendations: evaluation.recommendations || '',
      stack: interview.stack,
      level: interview.level,
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get AI agent interview transcript/result
// @route GET /api/interviews/ai-agent/:id
// @access Private (CANDIDATE or RECRUITER/ADMIN)
const getAiAgentInterview = async (req, res, next) => {
  try {
    const interview = await AiAgentInterview.findById(req.params.id).populate('candidate', 'name email');
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
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

module.exports = { getLevelSpecs, startAiAgentInterview, respondToAiAgent, endAiAgentInterview, getAiAgentInterview };
