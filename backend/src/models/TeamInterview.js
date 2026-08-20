const mongoose = require('mongoose');

const teamInterviewSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    interviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    stack: { type: String, required: true }, // tech stack OR sector name
    sector: { type: String, default: null }, // set if this is a business-sector interview
    interviewMode: { type: String, enum: ['technical', 'business'], default: 'technical' },
    level: { type: Number, required: true, enum: [1, 2, 3] },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'active', 'completed', 'cancelled', 'no_interviewer'],
      default: 'pending',
    },
    // Scheduling
    preferredDateTime: { type: Date, default: null },
    scheduledAt: { type: Date, default: null },
    // Zoom meeting details
    zoomMeetingId: { type: String, default: '' },
    zoomJoinUrl: { type: String, default: '' },
    zoomStartUrl: { type: String, default: '' },
    zoomPassword: { type: String, default: '' },
    // Notification tracking
    notifiedAt2Min: { type: Boolean, default: false },
    // Interviewer decline tracking
    declinedByInterviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    interviewerDeclinedAt: { type: Date, default: null },
    // Cancellation
    cancelledBy: { type: String, enum: ['candidate', 'system', null], default: null },
    candidateCancelledAt: { type: Date, default: null },
    cancellationReason: { type: String, default: '' },
    // Feedback from interviewer (post-interview)
    interviewerScore: { type: Number, min: 0, max: 100, default: null },
    interviewerFeedback: { type: String, default: '' },
    interviewerStrengths: [{ type: String }],
    interviewerWeaknesses: [{ type: String }],
    passed: { type: Boolean, default: null },
    feedbackSubmittedAt: { type: Date, default: null },
    resultReleasedAt: { type: Date, default: null },
    // Timestamps for lifecycle
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Index for querying pending/scheduled interviews by candidate
teamInterviewSchema.index({ candidate: 1, status: 1 });
teamInterviewSchema.index({ interviewer: 1, status: 1 });
teamInterviewSchema.index({ scheduledAt: 1, notifiedAt2Min: 1 });

module.exports = mongoose.model('TeamInterview', teamInterviewSchema);
