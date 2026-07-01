const Notification = require('../models/Notification');

// @desc  Get all notifications for current user
// @route GET /api/notifications
// @access Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

    res.json({ success: true, notifications, unreadCount });
  } catch (err) {
    next(err);
  }
};

// @desc  Mark single notification as read
// @route PUT /api/notifications/:id/read
// @access Private
const markRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true, readAt: new Date() }
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// @desc  Mark all notifications as read
// @route PUT /api/notifications/read-all
// @access Private
const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete a notification
// @route DELETE /api/notifications/:id
// @access Private
const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markRead, markAllRead, deleteNotification };
