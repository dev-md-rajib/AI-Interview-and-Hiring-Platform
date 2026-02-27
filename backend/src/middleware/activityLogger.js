const ActivityLog = require('../models/ActivityLog');
const logger = require('../config/logger');

const activityLogger = async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    if (req.user && req.method !== 'GET') {
      ActivityLog.create({
        user: req.user._id,
        action: `${req.method} ${req.originalUrl}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
        metadata: { statusCode: res.statusCode },
      }).catch((e) => logger.error(`ActivityLog error: ${e.message}`));
    }
    return originalJson(body);
  };
  next();
};

module.exports = activityLogger;
