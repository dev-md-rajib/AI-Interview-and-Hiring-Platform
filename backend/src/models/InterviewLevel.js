const mongoose = require('mongoose');

const interviewLevelSchema = new mongoose.Schema(
  {
    level: { type: Number, required: true, unique: true, enum: [1, 2, 3] },
    name: { type: String, required: true },
    description: { type: String },
    requiredSkills: [{ type: String }],
    minimumPassScore: { type: Number, required: true, default: 70 },
    allowedStacks: [{ type: String }],
    durationMinutes: { type: Number, default: 60 },
    questionCount: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewLevel', interviewLevelSchema);
