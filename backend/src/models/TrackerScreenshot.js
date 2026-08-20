const mongoose = require('mongoose');

const trackerScreenshotSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    interviewId: { type: String, default: '' },
    imageUrl: { type: String, required: true },
    category: {
      type: String,
      enum: ['normal_interval', 'closed_windows'],
      default: 'normal_interval',
    },
    captureSource: {
      type: String,
      enum: ['fixed-interval', 'random', 'closed-windows', 'queued', 'manual'],
      default: 'fixed-interval',
    },
    targetName: { type: String, default: '' },
    reason: { type: String, default: '' },
    capturedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

trackerScreenshotSchema.index({ candidate: 1, interviewId: 1 });
trackerScreenshotSchema.index({ interviewId: 1, category: 1 });
trackerScreenshotSchema.index({ capturedAt: -1 });

module.exports = mongoose.model('TrackerScreenshot', trackerScreenshotSchema);
