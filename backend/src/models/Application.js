const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Rejected', 'Hired'],
      default: 'Applied',
    },
    matchScore: { type: Number, default: 0 },
    coverLetter: { type: String, default: '' },
    recruiterNote: { type: String, default: '' },
  },
  { timestamps: true }
);

// Prevent double-apply
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
