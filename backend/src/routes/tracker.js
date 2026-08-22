const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getNextInterview,
  getTrackerStatus,
  sendConsent,
  sendReady,
  uploadScreenshot,
  endInterview,
  getScreenshotsForInterview,
  reportViolation,
} = require('../controllers/trackerController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Multer config for screenshot uploads
const screenshotsDir = path.join(__dirname, '../../uploads/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, screenshotsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `screenshot_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Candidate routes
router.get('/next-interview', protect, getNextInterview);
router.get('/status', protect, getTrackerStatus);
router.post('/consent', protect, sendConsent);
router.post('/ready', protect, sendReady);
router.post('/screenshot', optionalAuth, upload.single('image'), uploadScreenshot);
router.post('/violation', protect, reportViolation);
router.post('/end', protect, endInterview);

// Public / Recruiter inspection route
router.get('/screenshots/:interviewId', protect, getScreenshotsForInterview);

module.exports = router;
