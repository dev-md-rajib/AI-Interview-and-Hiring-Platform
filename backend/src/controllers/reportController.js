const Report = require('../models/Report');

// @desc    Report a job
// @route   POST /api/reports/job
// @access  Private
const reportJob = async (req, res, next) => {
  try {
    const { jobId, reason } = req.body;
    if (!jobId || !reason) {
      return res.status(400).json({ success: false, message: 'Job ID and reason are required' });
    }

    const existing = await Report.findOne({ reporter: req.user._id, reportedJob: jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reported this job' });
    }

    const report = await Report.create({
      reporter: req.user._id,
      type: 'Job',
      reportedJob: jobId,
      reason
    });

    res.status(201).json({ success: true, message: 'Report submitted successfully', report });
  } catch (err) {
    next(err);
  }
};

// @desc    Report a candidate
// @route   POST /api/reports/candidate
// @access  Private (RECRUITER)
const reportCandidate = async (req, res, next) => {
  try {
    const { candidateId, reason } = req.body;
    if (!candidateId || !reason) {
      return res.status(400).json({ success: false, message: 'Candidate ID and reason are required' });
    }

    const existing = await Report.findOne({ reporter: req.user._id, reportedUser: candidateId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reported this candidate' });
    }

    const report = await Report.create({
      reporter: req.user._id,
      type: 'Candidate',
      reportedUser: candidateId,
      reason
    });

    res.status(201).json({ success: true, message: 'Report submitted successfully', report });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  reportJob,
  reportCandidate
};
