const express = require('express');
const router = express.Router();
const { register, login, getMe,  updatePassword,
  updateProfile,
  submitAppeal
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/appeal', submitAppeal);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
