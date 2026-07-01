const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getProfile, updateProfile, getDashboard } = require('../controllers/interviewerController');

router.get('/profile', protect, authorize('INTERVIEWER'), getProfile);
router.put('/profile', protect, authorize('INTERVIEWER'), updateProfile);
router.get('/dashboard', protect, authorize('INTERVIEWER'), getDashboard);

module.exports = router;
