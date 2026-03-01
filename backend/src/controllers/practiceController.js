const QuestionBank = require('../models/QuestionBank');
const PracticeSubmission = require('../models/PracticeSubmission');
const { runAllTestCases } = require('../services/codeRunner');

// @desc    Get all active coding problems and user's solved status
// @route   GET /api/practice
// @access  Private (CANDIDATE)
exports.getPracticeProblems = async (req, res, next) => {
  try {
    // 1. Fetch all active coding questions
    const questions = await QuestionBank.find({ type: 'coding', isActive: true })
      .select('-testCases.expectedOutput -options -correctAnswer -skill -createdBy')
      .sort({ createdAt: -1 });

    // 2. Fetch current candidate's submissions
    const submissions = await PracticeSubmission.find({ candidate: req.user._id });
    
    // 3. Map submissions to questions: Mark as Solved if ANY language is solved. Otherwise Attempted.
    const submissionMap = {};
    submissions.forEach(sub => {
      const qId = sub.question.toString();
      if (!submissionMap[qId]) {
        submissionMap[qId] = { status: sub.status };
      } else {
        if (sub.status === 'Solved') {
          submissionMap[qId].status = 'Solved';
        }
      }
    });

    const enrichedQuestions = questions.map(q => {
      const qObj = q.toObject();
      qObj.userStatus = submissionMap[q._id.toString()] || null;
      return qObj;
    });

    res.status(200).json({ success: true, count: enrichedQuestions.length, data: enrichedQuestions });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single practice problem by ID (w/o hidden outputs) + latest submission
// @route   GET /api/practice/:id
// @access  Private (CANDIDATE)
exports.getPracticeProblem = async (req, res, next) => {
  try {
    const question = await QuestionBank.findOne({ _id: req.params.id, type: 'coding', isActive: true });
    
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Hide hidden test case details
    let qObj = question.toObject();
    if (qObj.testCases) {
      qObj.testCases = qObj.testCases.map(tc => 
        tc.hidden ? { ...tc, expectedOutput: '(hidden)', input: '(hidden)' } : tc
      );
    }

    const submissions = await PracticeSubmission.find({ 
      candidate: req.user._id, 
      question: req.params.id 
    });

    res.status(200).json({ success: true, question: qObj, submissions });
  } catch (err) {
    next(err);
  }
};

// @desc    Run code against visible test cases only
// @route   POST /api/practice/:id/run
// @access  Private (CANDIDATE)
exports.runCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const question = await QuestionBank.findOne({ _id: req.params.id, type: 'coding' });
    
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    if (!question.allowedLanguages.includes(language))
      return res.status(400).json({ success: false, message: `Language '${language}' not allowed` });

    const visibleCases = question.testCases.filter(tc => !tc.hidden);
    const { results } = runAllTestCases(code, language, visibleCases);
    
    res.json({ success: true, results });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit code against ALL test cases & update tracking
// @route   POST /api/practice/:id/submit
// @access  Private (CANDIDATE)
exports.submitCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const question = await QuestionBank.findOne({ _id: req.params.id, type: 'coding' });
    
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    if (!question.allowedLanguages.includes(language))
      return res.status(400).json({ success: false, message: `Language '${language}' not allowed` });

    // Run against ALL test cases
    const { results, allPassed } = runAllTestCases(code, language, question.testCases);
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = question.testCases.length;

    // Find or create tracking document for this specific language
    let submission = await PracticeSubmission.findOne({ 
      candidate: req.user._id, 
      question: question._id,
      language
    });

    const now = new Date();

    if (!submission) {
      submission = await PracticeSubmission.create({
        candidate: req.user._id,
        question: question._id,
        status: allPassed ? 'Solved' : 'Attempted',
        language,
        code,
        passedCases: passedCount,
        totalCases: totalCount,
        firstSolvedAt: allPassed ? now : null,
        attempts: 1
      });
    } else {
      submission.language = language;
      submission.code = code;
      submission.attempts += 1;
      
      // Update high water marks
      if (passedCount > submission.passedCases || allPassed) {
        submission.passedCases = passedCount;
        submission.totalCases = totalCount;
      }

      if (allPassed && submission.status !== 'Solved') {
        submission.status = 'Solved';
        submission.firstSolvedAt = now;
      }
      
      // If previously solved, keep status as 'Solved' even if this attempt fails, 
      // but maybe you want to let them fail it? Let's keep it 'Solved'.
      
      await submission.save();
    }

    res.json({ 
      success: true, 
      results, 
      allPassed, 
      submission
    });
  } catch (err) {
    next(err);
  }
};
