const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  checkEligibility,
  requestInterview,
  getMyInterviews,
  cancelInterview,
  getAssignedInterviews,
  declineInterview,
  submitResult,
  getResult,
  getInterview,
} = require('../controllers/teamInterviewController');

// Candidate routes
router.get('/eligibility', protect, authorize('CANDIDATE'), checkEligibility);
router.post('/request', protect, authorize('CANDIDATE'), requestInterview);
router.get('/my', protect, authorize('CANDIDATE'), getMyInterviews);
router.post('/:id/cancel', protect, authorize('CANDIDATE'), cancelInterview);
router.get('/result/:id', protect, authorize('CANDIDATE'), getResult);

// Interviewer routes
router.get('/interviewer/assigned', protect, authorize('INTERVIEWER'), getAssignedInterviews);
router.post('/:id/decline', protect, authorize('INTERVIEWER'), declineInterview);
router.post('/:id/submit-result', protect, authorize('INTERVIEWER'), submitResult);

// Shared (candidate + interviewer + admin)
router.get('/:id', protect, getInterview);

module.exports = router;
