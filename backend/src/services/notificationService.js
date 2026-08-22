const Notification = require('../models/Notification');
const TeamInterview = require('../models/TeamInterview');
const logger = require('../config/logger');

/**
 * Create an in-app notification for a user.
 */
async function createNotification(userId, { type, title, message, data = {} }) {
  try {
    await Notification.create({ user: userId, type, title, message, data });
  } catch (err) {
    logger.error(`Failed to create notification for user ${userId}: ${err.message}`);
  }
}

/**
 * Send 2-minute pre-meeting notifications to both candidate and interviewer.
 * Runs as a background scheduler — call startNotificationScheduler() from server.js.
 */
function startNotificationScheduler() {
  const INTERVAL_MS = 30 * 1000; // check every 30 seconds

  logger.info('📣 Notification scheduler started (30s interval)');

  setInterval(async () => {
    try {
      const now = new Date();
      const windowStart = new Date(now.getTime() + 90 * 1000);   // 1.5 min from now
      const windowEnd   = new Date(now.getTime() + 150 * 1000);  // 2.5 min from now

      // Find scheduled interviews within the 2-minute window that haven't been notified yet
      const upcoming = await TeamInterview.find({
        status: 'scheduled',
        scheduledAt: { $gte: windowStart, $lte: windowEnd },
        notifiedAt2Min: false,
      }).populate('candidate interviewer', 'name email');

      for (const interview of upcoming) {
        const meetingLink = interview.zoomJoinUrl;
        const timeStr = interview.scheduledAt.toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Dhaka'
        });

        // Notify candidate
        if (interview.candidate) {
          await createNotification(interview.candidate._id, {
            type: 'interview_2min',
            title: '⏰ Your Interview Starts in 2 Minutes!',
            message: `Your ${interview.stack} (Level ${interview.level}) team interview starts at ${timeStr} (BST, Bangladesh Time). Join now!`,
            data: {
              teamInterviewId: interview._id,
              zoomJoinUrl: meetingLink,
              scheduledAt: interview.scheduledAt,
              stack: interview.stack,
              level: interview.level,
            },
          });
        }

        // Notify interviewer
        if (interview.interviewer) {
          await createNotification(interview.interviewer._id, {
            type: 'interview_2min',
            title: '⏰ Interview Starts in 2 Minutes!',
            message: `Your interview session for ${interview.stack} (Level ${interview.level}) starts at ${timeStr} (BST, Bangladesh Time). Start the meeting now!`,
            data: {
              teamInterviewId: interview._id,
              zoomStartUrl: interview.zoomStartUrl,
              zoomJoinUrl: meetingLink,
              scheduledAt: interview.scheduledAt,
              stack: interview.stack,
              level: interview.level,
            },
          });
        }

        // Mark as notified to avoid duplicate alerts
        interview.notifiedAt2Min = true;
        await interview.save();

        logger.info(`2-min notification sent for interview ${interview._id}`);
      }
    } catch (err) {
      logger.error(`Notification scheduler error: ${err.message}`);
    }
  }, INTERVAL_MS);
}

module.exports = { createNotification, startNotificationScheduler };
