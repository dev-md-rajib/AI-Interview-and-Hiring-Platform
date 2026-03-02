const express = require('express');
const router = express.Router();
const {
  getLevelSpecs,
  startAiAgentInterview,
  respondToAiAgent,
  endAiAgentInterview,
  getAiAgentInterview,
  generateTTS,
} = require('../controllers/aiAgentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/level-specs', protect, authorize('CANDIDATE'), getLevelSpecs);
router.post('/start', protect, authorize('CANDIDATE'), startAiAgentInterview);
router.post('/:id/respond', protect, authorize('CANDIDATE'), respondToAiAgent);
router.post('/:id/end', protect, authorize('CANDIDATE'), endAiAgentInterview);
router.post('/tts', protect, authorize('CANDIDATE'), generateTTS);
router.get('/:id', protect, getAiAgentInterview);

module.exports = router;
