const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, default: '' },
  expectedOutput: { type: String, required: true },
  hidden: { type: Boolean, default: false }, // hidden test cases not shown to candidate
});

const mcqQuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String }], // exactly 4
  correctAnswer: { type: String, required: true },
  marks: { type: Number, default: 1 },
});

const codingQuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  marks: { type: Number, default: 1 },
  allowedLanguages: [{ type: String, enum: ['javascript', 'python'] }],
  testCases: [testCaseSchema],
});

const contestSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  scheduledAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ['draft', 'active', 'ended', 'published'],
    default: 'draft',
  },

  // MCQ round (optional)
  mcqRound: {
    enabled: { type: Boolean, default: false },
    timeLimitMinutes: { type: Number, default: 30 },
    passThreshold: { type: Number, default: 60, min: 0, max: 100 }, // % of MCQ marks to proceed
    questions: [mcqQuestionSchema],
  },

  // Coding round (always present)
  codingRound: {
    timeLimitMinutes: { type: Number, default: 60 },
    questions: [codingQuestionSchema],
  },

  // Computed totals
  totalMcqMarks: { type: Number, default: 0 },
  totalCodingMarks: { type: Number, default: 0 },
}, { timestamps: true });

// Recompute totals before saving
contestSchema.pre('save', function (next) {
  if (this.mcqRound && this.mcqRound.questions) {
    this.totalMcqMarks = this.mcqRound.questions.reduce((s, q) => s + (q.marks || 1), 0);
  }
  if (this.codingRound && this.codingRound.questions) {
    this.totalCodingMarks = this.codingRound.questions.reduce((s, q) => s + (q.marks || 1), 0);
  }
  next();
});

module.exports = mongoose.model('Contest', contestSchema);
