const express = require('express');
const router = express.Router();
const { getEligibility, startInterview, submitInterview, getInterviewResult, getMyInterviews, abandonInterview } = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, authorize('CANDIDATE'), getMyInterviews);
router.get('/eligibility/:level', protect, authorize('CANDIDATE'), getEligibility);
router.post('/start', protect, authorize('CANDIDATE'), startInterview);
router.post('/:id/submit', protect, authorize('CANDIDATE'), submitInterview);
router.put('/:id/abandon', protect, authorize('CANDIDATE'), abandonInterview);
router.get('/:id/result', protect, getInterviewResult);

module.exports = router;
