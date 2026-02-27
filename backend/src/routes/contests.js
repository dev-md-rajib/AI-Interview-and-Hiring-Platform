const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createContest, updateContest, deleteContest,
  getContests, getContest,
  activateContest, endContest, publishResults,
  joinContest, submitMcq, runCode, submitCodingAnswer, finalSubmit,
  getMySubmission, getParticipants,
} = require('../controllers/contestController');

// All routes require authentication
router.use(protect);

// List + Create
router.route('/')
  .get(getContests)
  .post(authorize('RECRUITER'), createContest);

// Single contest
router.route('/:id')
  .get(getContest)
  .put(authorize('RECRUITER'), updateContest)
  .delete(authorize('RECRUITER'), deleteContest);

// Status transitions (recruiter only)
router.post('/:id/activate', authorize('RECRUITER'), activateContest);
router.post('/:id/end', authorize('RECRUITER'), endContest);
router.post('/:id/publish', authorize('RECRUITER'), publishResults);
router.get('/:id/participants', authorize('RECRUITER'), getParticipants);

// Candidate actions
router.post('/:id/join', authorize('CANDIDATE'), joinContest);
router.post('/:id/submit-mcq', authorize('CANDIDATE'), submitMcq);
router.post('/:id/run-code', authorize('CANDIDATE'), runCode);
router.post('/:id/submit-coding', authorize('CANDIDATE'), submitCodingAnswer);
router.post('/:id/final-submit', authorize('CANDIDATE'), finalSubmit);
router.get('/:id/my-submission', authorize('CANDIDATE'), getMySubmission);

module.exports = router;
