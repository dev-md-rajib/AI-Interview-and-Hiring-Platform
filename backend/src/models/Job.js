const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: [
      {
        stack: { type: String, required: true },
        level: { type: Number, enum: [1, 2, 3], required: true },
        minScore: { type: Number, required: true, default: 70 },
      },
    ],
    experienceRequired: { type: Number, default: 0 },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    salaryCurrency: { type: String, default: 'USD' },
    location: { type: String, default: 'Remote' },
    isRemote: { type: Boolean, default: true },
    status: { type: String, enum: ['Open', 'Closed', 'Draft'], default: 'Open' },
    applicationCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
