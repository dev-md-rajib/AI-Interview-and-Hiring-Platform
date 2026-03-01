const mongoose = require('mongoose');

const transcriptEntrySchema = new mongoose.Schema({
  role: { type: String, enum: ['interviewer', 'candidate'], required: true },
  content: { type: String, required: true },
  isCodingQuestion: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const aiAgentInterviewSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stack: { type: String, required: true },
    level: { type: Number, required: true, enum: [1, 2, 3] },
    levelSpec: { type: String, default: '' }, // description of what's tested at this level
    mode: { type: String, default: 'ai_agent' },
    transcript: [transcriptEntrySchema],
    status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
    totalScore: { type: Number, default: 0 },
    codingScore: { type: Number, default: 0 },
    conceptScore: { type: Number, default: 0 },
    cheatCount: { type: Number, default: 0 },
    trustScore: { type: Number, default: 100 },
    passed: { type: Boolean, default: false },
    passMark: { type: Number, default: 70 },
    feedback: { type: String, default: '' },
    strengths: [String],
    weaknesses: [String],
    recommendations: { type: String, default: '' },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AiAgentInterview', aiAgentInterviewSchema);
