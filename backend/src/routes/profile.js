const express = require('express');
const router = express.Router();
const { getMyProfile, updateProfile, updateSkills, addPortfolioItem, deletePortfolioItem, getPublicProfile } = require('../controllers/profileController');
const { protect, authorize } = require('../middleware/auth');

router.get('/me', protect, authorize('CANDIDATE'), getMyProfile);
router.put('/me', protect, authorize('CANDIDATE'), updateProfile);
router.put('/skills', protect, authorize('CANDIDATE'), updateSkills);
router.post('/portfolio', protect, authorize('CANDIDATE'), addPortfolioItem);
router.delete('/portfolio/:itemId', protect, authorize('CANDIDATE'), deletePortfolioItem);
router.get('/:userId', protect, authorize('RECRUITER', 'ADMIN'), getPublicProfile);

module.exports = router;
