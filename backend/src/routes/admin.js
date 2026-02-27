const express = require('express');
const router = express.Router();
const {
  getAnalytics, getAllUsers, verifyRecruiter, createOrUpdateLevel, getLevels,
  addQuestion, getQuestions, deleteQuestion, searchCandidates,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Public-ish (any authenticated user can see levels)
router.get('/levels', protect, getLevels);

// Admin only
router.get('/analytics', protect, authorize('ADMIN'), getAnalytics);
router.get('/users', protect, authorize('ADMIN'), getAllUsers);
router.put('/users/:id/verify', protect, authorize('ADMIN'), verifyRecruiter);
router.post('/levels', protect, authorize('ADMIN'), createOrUpdateLevel);
router.get('/questions', protect, authorize('ADMIN'), getQuestions);
router.post('/questions', protect, authorize('ADMIN'), addQuestion);
router.delete('/questions/:id', protect, authorize('ADMIN'), deleteQuestion);

// Recruiter and Admin can search candidates
router.get('/candidates/search', protect, authorize('RECRUITER', 'ADMIN'), searchCandidates);

module.exports = router;
