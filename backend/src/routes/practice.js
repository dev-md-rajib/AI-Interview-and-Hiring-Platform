const express = require('express');
const { getPracticeProblems, getPracticeProblem, runCode, submitCode } = require('../controllers/practiceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All practice routes are for candidates only
router.use(protect);
router.use(authorize('CANDIDATE'));

router.get('/', getPracticeProblems);
router.get('/:id', getPracticeProblem);
router.post('/:id/run', runCode);
router.post('/:id/submit', submitCode);

module.exports = router;
