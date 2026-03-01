const express = require('express');
const router = express.Router();
const multiplayerController = require('../controllers/multiplayerController');
const { protect, authorize } = require('../middleware/auth');

// All multiplayer endpoints require Candidate access
router.use(protect);
router.use(authorize('CANDIDATE'));

router.get('/', multiplayerController.getMyRooms);
router.post('/create', multiplayerController.createRoom);
router.get('/:id', multiplayerController.getRoom);
router.post('/:id/join', multiplayerController.joinRoom);
router.post('/:id/run', multiplayerController.runCode);
router.post('/:id/submit', multiplayerController.submitCode);
router.post('/:id/skip', multiplayerController.skipProblem);
router.post('/:id/leave', multiplayerController.leaveRoom);

module.exports = router;
