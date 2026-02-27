const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  input: String,
  expected: String,
  actual: String,
  passed: { type: Boolean, default: false },
  executionTime: { type: Number, default: 0 }, // ms
}, { _id: false });

const codingAnswerSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  code: { type: String, default: '' },
  language: { type: String, default: 'javascript' },
  testResults: [testResultSchema],
  solved: { type: Boolean, default: false }, // all test cases passed
  marksGained: { type: Number, default: 0 },
  firstSolvedAt: { type: Date },
  attempts: { type: Number, default: 0 },
}, { _id: false });

const mcqAnswerSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  selectedOption: { type: String, default: null },
  marksGained: { type: Number, default: 0 },
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  contest: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Round tracking
  currentRound: { type: String, enum: ['mcq', 'coding', 'done'], default: 'mcq' },

  // MCQ round
  mcqAnswers: [mcqAnswerSchema],
  mcqScore: { type: Number, default: 0 },       // raw marks
  mcqPct: { type: Number, default: 0 },          // percentage
  mcqTimeTaken: { type: Number, default: 0 },    // seconds
  mcqStartedAt: { type: Date },
  mcqSubmittedAt: { type: Date },
  mcqVerdict: { type: String, enum: ['pass', 'fail', 'pending'], default: 'pending' },

  // Coding round
  codingAnswers: [codingAnswerSchema],
  codingScore: { type: Number, default: 0 },     // total marks gained
  codingTimeTaken: { type: Number, default: 0 }, // seconds from round start to last accepted solve
  codingStartedAt: { type: Date },
  codingSubmittedAt: { type: Date },

  // Final verdict
  verdict: {
    type: String,
    enum: ['passed', 'failed_mcq', 'incomplete', 'not_attempted'],
    default: 'not_attempted',
  },

  totalMarks: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
}, { timestamps: true });

submissionSchema.index({ contest: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('ContestSubmission', submissionSchema);
