const Contest = require('../models/Contest');
const ContestSubmission = require('../models/ContestSubmission');
const { runAllTestCases } = require('../services/codeRunner');

// ─── RECRUITER: Create contest ────────────────────────────────────────────────
exports.createContest = async (req, res) => {
  try {
    const contest = await Contest.create({ ...req.body, recruiter: req.user._id });
    res.status(201).json({ success: true, contest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── RECRUITER: Update contest (draft only) ───────────────────────────────────
exports.updateContest = async (req, res) => {
  try {
    const contest = await Contest.findOne({ _id: req.params.id, recruiter: req.user._id });
    if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });
    if (!['draft'].includes(contest.status))
      return res.status(400).json({ success: false, message: 'Only draft contests can be edited' });
    Object.assign(contest, req.body);
    await contest.save();
    res.json({ success: true, contest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── RECRUITER: Delete draft ──────────────────────────────────────────────────
exports.deleteContest = async (req, res) => {
  try {
    const contest = await Contest.findOne({ _id: req.params.id, recruiter: req.user._id });
    if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });
    if (contest.status !== 'draft')
      return res.status(400).json({ success: false, message: 'Only draft contests can be deleted' });
    await contest.deleteOne();
    res.json({ success: true, message: 'Contest deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── LIST contests ─────────────────────────────────────────────────────────────
exports.getContests = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'RECRUITER') {
      query.recruiter = req.user._id;
    } else {
      // Candidates see active, ended, published
      query.status = { $in: ['active', 'ended', 'published'] };
    }
    const contests = await Contest.find(query)
      .populate('recruiter', 'name email')
      .sort('-scheduledAt')
      .select('-codingRound.questions.testCases.expectedOutput -mcqRound.questions.correctAnswer');
    res.json({ success: true, contests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET single contest ────────────────────────────────────────────────────────
exports.getContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id).populate('recruiter', 'name email');
    if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });

    // Candidates can't see correct answers or hidden test case outputs
    let contestObj = contest.toObject();
    if (req.user.role !== 'RECRUITER' || String(contest.recruiter._id) !== String(req.user._id)) {
      if (contestObj.mcqRound?.questions) {
        contestObj.mcqRound.questions = contestObj.mcqRound.questions.map(q => ({ ...q, correctAnswer: undefined }));
      }
      if (contestObj.codingRound?.questions) {
        contestObj.codingRound.questions = contestObj.codingRound.questions.map(q => ({
          ...q,
          testCases: q.testCases.map(tc => tc.hidden ? { ...tc, expectedOutput: '(hidden)', input: '(hidden)' } : tc),
        }));
      }
    }
    res.json({ success: true, contest: contestObj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── RECRUITER: Status transitions ────────────────────────────────────────────
const transition = (from, to) => async (req, res) => {
  try {
    const contest = await Contest.findOne({ _id: req.params.id, recruiter: req.user._id });
    if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });
    if (contest.status !== from)
      return res.status(400).json({ success: false, message: `Contest must be '${from}' to perform this action` });
    contest.status = to;
    await contest.save();
    res.json({ success: true, contest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.activateContest = transition('draft', 'active');
exports.endContest = transition('active', 'ended');
exports.publishResults = transition('ended', 'published');

// ─── CANDIDATE: Join contest (create blank submission) ─────────────────────────
exports.joinContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });
    if (contest.status !== 'active')
      return res.status(400).json({ success: false, message: 'Contest is not active' });

    let submission = await ContestSubmission.findOne({ contest: contest._id, candidate: req.user._id });
    if (!submission) {
      // Determine starting round
      const startRound = contest.mcqRound?.enabled ? 'mcq' : 'coding';
      submission = await ContestSubmission.create({
        contest: contest._id,
        candidate: req.user._id,
        currentRound: startRound,
        mcqStartedAt: startRound === 'mcq' ? new Date() : undefined,
        codingStartedAt: startRound === 'coding' ? new Date() : undefined,
        verdict: 'not_attempted',
      });
    }
    res.json({ success: true, submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CANDIDATE: Submit MCQ round ───────────────────────────────────────────────
exports.submitMcq = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });
    if (!contest.mcqRound?.enabled)
      return res.status(400).json({ success: false, message: 'This contest has no MCQ round' });

    const submission = await ContestSubmission.findOne({ contest: contest._id, candidate: req.user._id });
    if (!submission) return res.status(400).json({ success: false, message: 'Join the contest first' });
    if (submission.currentRound !== 'mcq')
      return res.status(400).json({ success: false, message: 'Not in MCQ round' });

    // Grade MCQ answers
    const { answers } = req.body; // [{questionIndex, selectedOption}]
    let mcqScore = 0;
    const mcqAnswers = (answers || []).map(a => {
      const q = contest.mcqRound.questions[a.questionIndex];
      const correct = q && a.selectedOption === q.correctAnswer;
      const marksGained = correct ? (q.marks || 1) : 0;
      mcqScore += marksGained;
      return { questionIndex: a.questionIndex, selectedOption: a.selectedOption, marksGained };
    });

    const totalMcq = contest.totalMcqMarks || 1;
    const mcqPct = Math.round((mcqScore / totalMcq) * 100);
    const passed = mcqPct >= (contest.mcqRound.passThreshold || 60);
    const now = new Date();
    const mcqTimeTaken = submission.mcqStartedAt
      ? Math.round((now - submission.mcqStartedAt) / 1000)
      : 0;

    submission.mcqAnswers = mcqAnswers;
    submission.mcqScore = mcqScore;
    submission.mcqPct = mcqPct;
    submission.mcqTimeTaken = mcqTimeTaken;
    submission.mcqSubmittedAt = now;
    submission.mcqVerdict = passed ? 'pass' : 'fail';

    if (passed) {
      submission.currentRound = 'coding';
      submission.codingStartedAt = now;
      submission.verdict = 'incomplete';
    } else {
      submission.currentRound = 'done';
      submission.verdict = 'failed_mcq';
      submission.submittedAt = now;
    }

    await submission.save();
    res.json({
      success: true,
      mcqVerdict: submission.mcqVerdict,
      mcqScore,
      mcqPct,
      passed,
      submission,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CANDIDATE: Run code against visible test cases ────────────────────────────
exports.runCode = async (req, res) => {
  try {
    const { questionIndex, code, language } = req.body;
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });

    const question = contest.codingRound?.questions?.[questionIndex];
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    if (!question.allowedLanguages.includes(language))
      return res.status(400).json({ success: false, message: `Language '${language}' not allowed` });

    // Only run visible test cases for preview
    const visibleCases = question.testCases.filter(tc => !tc.hidden);
    const { results } = runAllTestCases(code, language, visibleCases);
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CANDIDATE: Submit coding answer for one problem ──────────────────────────
exports.submitCodingAnswer = async (req, res) => {
  try {
    const { questionIndex, code, language } = req.body;
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });

    const submission = await ContestSubmission.findOne({ contest: contest._id, candidate: req.user._id });
    if (!submission) return res.status(400).json({ success: false, message: 'Join the contest first' });
    if (submission.currentRound !== 'coding')
      return res.status(400).json({ success: false, message: 'Not in coding round' });

    const question = contest.codingRound?.questions?.[questionIndex];
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    if (!question.allowedLanguages.includes(language))
      return res.status(400).json({ success: false, message: `Language '${language}' not allowed` });

    // Run against ALL test cases (including hidden)
    const { results, allPassed } = runAllTestCases(code, language, question.testCases);
    const marksGained = allPassed ? (question.marks || 1) : 0;
    const now = new Date();

    // Find or create the coding answer entry for this question
    let answerEntry = submission.codingAnswers.find(a => a.questionIndex === questionIndex);
    if (!answerEntry) {
      submission.codingAnswers.push({ questionIndex, code, language, testResults: results, solved: allPassed, marksGained, attempts: 1, firstSolvedAt: allPassed ? now : undefined });
    } else {
      answerEntry.code = code;
      answerEntry.language = language;
      answerEntry.testResults = results;
      answerEntry.attempts = (answerEntry.attempts || 0) + 1;
      // Only update solved/marks if not already solved
      if (!answerEntry.solved && allPassed) {
        answerEntry.solved = true;
        answerEntry.marksGained = marksGained;
        answerEntry.firstSolvedAt = now;
      }
    }

    // Recompute coding totals
    submission.codingScore = submission.codingAnswers.reduce((s, a) => s + (a.marksGained || 0), 0);
    if (allPassed && submission.codingStartedAt) {
      submission.codingTimeTaken = Math.round((now - submission.codingStartedAt) / 1000);
    }

    await submission.save();
    res.json({ success: true, results, allPassed, marksGained, submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CANDIDATE: Final submit (end coding round) ───────────────────────────────
exports.finalSubmit = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });

    const submission = await ContestSubmission.findOne({ contest: contest._id, candidate: req.user._id });
    if (!submission) return res.status(400).json({ success: false, message: 'No submission found' });
    if (submission.currentRound !== 'coding')
      return res.status(400).json({ success: false, message: 'Not in coding round' });

    const now = new Date();
    submission.currentRound = 'done';
    submission.verdict = 'passed';
    submission.submittedAt = now;
    submission.codingSubmittedAt = now;
    if (submission.codingStartedAt) {
      submission.codingTimeTaken = Math.round((now - submission.codingStartedAt) / 1000);
    }
    submission.totalMarks = (submission.mcqScore || 0) + (submission.codingScore || 0);
    await submission.save();
    res.json({ success: true, submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CANDIDATE: My submission ─────────────────────────────────────────────────
exports.getMySubmission = async (req, res) => {
  try {
    const submission = await ContestSubmission.findOne({
      contest: req.params.id,
      candidate: req.user._id,
    });
    res.json({ success: true, submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── RECRUITER: Participants leaderboard ──────────────────────────────────────
exports.getParticipants = async (req, res) => {
  try {
    const contest = await Contest.findOne({ _id: req.params.id, recruiter: req.user._id });
    if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });

    const submissions = await ContestSubmission.find({ contest: contest._id })
      .populate('candidate', 'name email')
      .sort('-codingScore codingTimeTaken');

    // Build leaderboard with sorting:
    // 1. passed → sort by codingScore DESC, then codingTimeTaken ASC
    // 2. failed_mcq → sub-sort by mcqPct DESC
    // 3. incomplete / not_attempted → bottom
    const passed = submissions
      .filter(s => s.verdict === 'passed')
      .sort((a, b) => b.codingScore - a.codingScore || a.codingTimeTaken - b.codingTimeTaken);

    const failedMcq = submissions
      .filter(s => s.verdict === 'failed_mcq')
      .sort((a, b) => b.mcqPct - a.mcqPct);

    const others = submissions.filter(s => ['incomplete', 'not_attempted'].includes(s.verdict));

    const ranked = [...passed, ...failedMcq, ...others].map((s, idx) => ({
      rank: idx + 1,
      candidate: s.candidate,
      verdict: s.verdict,
      mcqScore: s.mcqScore,
      mcqPct: s.mcqPct,
      mcqVerdict: s.mcqVerdict,
      codingScore: s.codingScore,
      codingTimeTaken: s.codingTimeTaken,
      totalMarks: s.totalMarks,
      submittedAt: s.submittedAt,
      // Solve matrix: which coding questions were solved
      solvedProblems: s.codingAnswers.map(a => ({
        questionIndex: a.questionIndex,
        solved: a.solved,
        marksGained: a.marksGained,
        attempts: a.attempts,
        language: a.language,
      })),
    }));

    res.json({ success: true, contest, ranked, totalParticipants: ranked.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
