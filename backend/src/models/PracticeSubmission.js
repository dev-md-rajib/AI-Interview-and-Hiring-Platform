const mongoose = require('mongoose');

const practiceSubmissionSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank', required: true },
  
  status: { type: String, enum: ['Attempted', 'Solved'], default: 'Attempted' },
  language: { type: String, required: true },
  code: { type: String, required: true },
  
  // High score tracking
  passedCases: { type: Number, default: 0 },
  totalCases: { type: Number, default: 0 },
  
  // Tracking the time of first successful solve
  firstSolvedAt: { type: Date },
  attempts: { type: Number, default: 1 }

}, { timestamps: true });

// Ensure one tracking document per user per question per language
practiceSubmissionSchema.index({ candidate: 1, question: 1, language: 1 }, { unique: true });

module.exports = mongoose.model('PracticeSubmission', practiceSubmissionSchema);
