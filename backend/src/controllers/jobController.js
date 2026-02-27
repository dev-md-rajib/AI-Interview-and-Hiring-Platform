const Job = require('../models/Job');
const Application = require('../models/Application');
const CandidateProfile = require('../models/CandidateProfile');
const Interview = require('../models/Interview');

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (RECRUITER)
const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, recruiter: req.user._id });
    res.status(201).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all open jobs
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res, next) => {
  try {
    const { stack, level, remote, page = 1, limit = 20 } = req.query;
    const query = { status: 'Open' };
    if (stack) query.requiredStack = { $in: [new RegExp(stack, 'i')] };
    if (level) query.requiredLevel = parseInt(level);
    if (remote !== undefined) query.isRemote = remote === 'true';

    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      Job.find(query).populate('recruiter', 'name profileImage').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Job.countDocuments(query),
    ]);

    res.status(200).json({ success: true, total, page: parseInt(page), jobs });
  } catch (err) {
    next(err);
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Private
const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name profileImage email');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (RECRUITER - own job)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (RECRUITER - own job or ADMIN)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await job.deleteOne();
    res.status(200).json({ success: true, message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get recruiter's own jobs
// @route   GET /api/jobs/my
// @access  Private (RECRUITER)
const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    next(err);
  }
};

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Private (CANDIDATE)
const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.status !== 'Open') {
      return res.status(404).json({ success: false, message: 'Job not available' });
    }

    // Check eligibility: candidate must have passed required level
    const passedInterview = await Interview.findOne({
      candidate: req.user._id,
      level: job.requiredLevel,
      status: 'completed',
      passed: true,
      totalScore: { $gte: job.minScore },
    });

    if (!passedInterview) {
      return res.status(403).json({
        success: false,
        message: `You must pass Level ${job.requiredLevel} interview with a minimum score of ${job.minScore} to apply.`,
      });
    }

    // Calculate match score
    const profile = await CandidateProfile.findOne({ user: req.user._id });
    let matchScore = 0;
    if (profile) {
      const candidateStacks = profile.expertise.map((e) => e.toLowerCase());
      const requiredStacks = job.requiredStack.map((s) => s.toLowerCase());
      const matched = requiredStacks.filter((s) => candidateStacks.includes(s));
      const skillMatchPct = requiredStacks.length > 0 ? (matched.length / requiredStacks.length) * 40 : 0;
      const scoreComponent = (passedInterview.totalScore / 100) * 40;
      const expComponent = Math.min(profile.yearsOfExperience / Math.max(job.experienceRequired, 1), 1) * 20;
      matchScore = Math.round(skillMatchPct + scoreComponent + expComponent);
    }

    const application = await Application.create({
      candidate: req.user._id,
      job: job._id,
      matchScore,
      coverLetter: req.body.coverLetter || '',
    });

    await Job.findByIdAndUpdate(job._id, { $inc: { applicationCount: 1 } });

    res.status(201).json({ success: true, application });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'You have already applied to this job' });
    }
    next(err);
  }
};

// @desc    Get my applications (candidate)
// @route   GET /api/jobs/applications/my
// @access  Private (CANDIDATE)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title requiredStack requiredLevel isRemote location status recruiter')
      .populate({ path: 'job', populate: { path: 'recruiter', select: 'name profileImage' } })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};

// @desc    Get applications for a job (recruiter)
// @route   GET /api/jobs/:id/applications
// @access  Private (RECRUITER)
const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { status, sortBy = 'matchScore', order = 'desc' } = req.query;
    const query = { job: req.params.id };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('candidate', 'name email profileImage')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application status (recruiter)
// @route   PUT /api/jobs/applications/:appId/status
// @access  Private (RECRUITER)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, recruiterNote } = req.body;
    const validStatuses = ['Applied', 'Shortlisted', 'Rejected', 'Hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.appId,
      { status, recruiterNote },
      { new: true }
    ).populate('job candidate');

    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    res.status(200).json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

module.exports = { createJob, getJobs, getJob, updateJob, deleteJob, getMyJobs, applyToJob, getMyApplications, getJobApplications, updateApplicationStatus };
