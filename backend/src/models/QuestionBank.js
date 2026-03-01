const mongoose = require('mongoose');

const questionBankSchema = new mongoose.Schema(
  {
    stack: { type: String, required: true },
    level: { type: Number, enum: [1, 2, 3], required: true },
    type: { type: String, enum: ['mcq', 'coding', 'text', 'scenario'], required: true },
    question: { type: String, required: true },
    options: [String],
    correctAnswer: { type: String },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    skill: { type: String },
    
    // Coding specific fields
    testCases: [{
      input: String,
      expectedOutput: String,
      hidden: { type: Boolean, default: false }
    }],
    allowedLanguages: { type: [String], default: ['javascript', 'python'] },
    marks: { type: Number, default: 10 },

    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuestionBank', questionBankSchema);
