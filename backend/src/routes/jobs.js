const express = require('express');
const router = express.Router();
const {
  createJob, getJobs, getJob, updateJob, deleteJob, getMyJobs,
  applyToJob, getMyApplications, getJobApplications, updateApplicationStatus,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

// Job routes
router.get('/', protect, getJobs);
router.get('/my', protect, authorize('RECRUITER'), getMyJobs);
router.get('/applications/my', protect, authorize('CANDIDATE'), getMyApplications);
router.get('/:id', protect, getJob);
router.post('/', protect, authorize('RECRUITER'), createJob);
router.put('/:id', protect, authorize('RECRUITER', 'ADMIN'), updateJob);
router.delete('/:id', protect, authorize('RECRUITER', 'ADMIN'), deleteJob);

// Application routes
router.post('/:id/apply', protect, authorize('CANDIDATE'), applyToJob);
router.get('/:id/applications', protect, authorize('RECRUITER', 'ADMIN'), getJobApplications);
router.put('/applications/:appId/status', protect, authorize('RECRUITER', 'ADMIN'), updateApplicationStatus);

module.exports = router;
