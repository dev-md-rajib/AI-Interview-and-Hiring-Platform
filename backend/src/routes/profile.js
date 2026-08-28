const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateProfile,
  updateSkills,
  addPortfolioItem,
  deletePortfolioItem,
  getPublicProfile,
  getMyRecruiterProfile,
  updateRecruiterProfile,
  getPublicRecruiterProfile,
} = require('../controllers/profileController');
const { protect, authorize } = require('../middleware/auth');

// Recruiter Profile routes
router.get('/recruiter/me', protect, authorize('RECRUITER'), getMyRecruiterProfile);
router.put('/recruiter/me', protect, authorize('RECRUITER'), updateRecruiterProfile);
router.get('/recruiter/:id', protect, getPublicRecruiterProfile);

// Candidate Profile routes
router.get('/me', protect, authorize('CANDIDATE'), getMyProfile);
router.put('/me', protect, authorize('CANDIDATE'), updateProfile);
router.put('/skills', protect, authorize('CANDIDATE'), updateSkills);
router.post('/portfolio', protect, authorize('CANDIDATE'), addPortfolioItem);
router.delete('/portfolio/:itemId', protect, authorize('CANDIDATE'), deletePortfolioItem);

// General public candidate profile (for recruiters and admins)
router.get('/:userId', protect, authorize('RECRUITER', 'ADMIN'), getPublicProfile);

module.exports = router;
