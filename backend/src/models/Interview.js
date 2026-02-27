const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: String,
  questionType: { type: String, enum: ['mcq', 'coding', 'text', 'scenario'], default: 'text' },
  options: [String], // for MCQ
  correctAnswer: String, // for MCQ
  skill: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
});

const answerSchema = new mongoose.Schema({
  questionIndex: Number,
  answer: String,
  isCorrect: Boolean,
  aiScore: { type: Number, default: 0 },
  aiFeedback: String,
});

const interviewSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    level: { type: Number, required: true, enum: [1, 2, 3] },
    stack: { type: String, required: true },
    status: { type: String, enum: ['pending', 'active', 'completed', 'abandoned'], default: 'pending' },
    questions: [questionSchema],
    answers: [answerSchema],
    skillScores: { type: Map, of: Number, default: {} },
    totalScore: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    feedback: { type: String, default: '' },
    strengths: [String],
    weaknesses: [String],
    attemptNumber: { type: Number, default: 1 },
    startedAt: { type: Date },
    completedAt: { type: Date },
    nextLevelEligible: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);
