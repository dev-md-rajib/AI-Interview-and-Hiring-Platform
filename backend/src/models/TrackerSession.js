const mongoose = require('mongoose');

const trackerSessionSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    interviewId: { type: String, default: '' },
    interviewType: { type: String, enum: ['standard', 'ai_agent', 'team', 'generic'], default: 'generic' },
    status: {
      type: String,
      enum: ['idle', 'ready', 'active', 'completed', 'terminated'],
      default: 'idle',
    },
    consentedAt: { type: Date },
    consentVersion: { type: String, default: 'v1' },
    startedAt: { type: Date },
    endedAt: { type: Date },
    endedBy: { type: String, enum: ['candidate', 'system', 'website', 'admin', null], default: null },
    lastHeartbeat: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

trackerSessionSchema.index({ candidate: 1, status: 1 });
trackerSessionSchema.index({ interviewId: 1 });

module.exports = mongoose.model('TrackerSession', trackerSessionSchema);
