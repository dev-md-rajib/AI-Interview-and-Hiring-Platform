const express = require('express');
const router = express.Router();
const { reportJob, reportCandidate } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.post('/job', protect, reportJob);
router.post('/candidate', protect, authorize('RECRUITER'), reportCandidate);

module.exports = router;
