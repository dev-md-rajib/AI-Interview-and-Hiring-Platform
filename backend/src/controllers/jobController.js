const Job = require('../models/Job');
const Application = require('../models/Application');
const CandidateProfile = require('../models/CandidateProfile');
const Interview = require('../models/Interview');
const AiAgentInterview = require('../models/AiAgentInterview');

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
    
    if (stack || level) {
      query.requirements = { $elemMatch: {} };
      if (stack) query.requirements.$elemMatch.stack = new RegExp(stack, 'i');
      if (level) query.requirements.$elemMatch.level = parseInt(level);
    }
    
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

    // Check eligibility logic for multi-stack requirements
    let missingRequirements = [];
    let requirementScores = []; // Keep track of best scores for match calculation

    if (job.requirements && job.requirements.length > 0) {
      for (const reqObj of job.requirements) {
        const query = {
          candidate: req.user._id,
          stack: new RegExp(reqObj.stack, 'i'),
          level: { $gte: reqObj.level },
          status: 'completed',
          passed: true,
          totalScore: { $gte: reqObj.minScore }
        };

        const stdBest = await Interview.findOne(query).sort({ totalScore: -1 });
        const aiBest = await AiAgentInterview.findOne(query).sort({ totalScore: -1 });

        let bestInterview = null;
        if (stdBest && aiBest) bestInterview = stdBest.totalScore > aiBest.totalScore ? stdBest : aiBest;
        else if (stdBest) bestInterview = stdBest;
        else if (aiBest) bestInterview = aiBest;

        if (!bestInterview) {
          missingRequirements.push(`${reqObj.stack} (Level ${reqObj.level}+, ${reqObj.minScore}%+)`);
        } else {
          requirementScores.push(bestInterview.totalScore);
        }
      }
    }

    if (missingRequirements.length > 0) {
      return res.status(403).json({
        success: false,
        message: `You do not meet all requirements. Missing passed interviews for: ${missingRequirements.join(', ')}`,
      });
    }

    // Calculate match score
    const profile = await CandidateProfile.findOne({ user: req.user._id });
    let matchScore = 0;
    
    if (profile) {
      const candidateStacks = profile.expertise.map((e) => e.toLowerCase());
      
      let skillMatchPct = 100; // Default if no requirements
      let scoreComponent = 0;
      
      if (job.requirements && job.requirements.length > 0) {
        const requiredStacks = job.requirements.map(req => req.stack.toLowerCase());
        const matched = requiredStacks.filter((s) => candidateStacks.includes(s));
        skillMatchPct = (matched.length / requiredStacks.length) * 40;
        
        const avgScore = requirementScores.reduce((sum, val) => sum + val, 0) / requirementScores.length;
        scoreComponent = (avgScore / 100) * 40;
      } else {
        scoreComponent = 40; // Max score component if job has zero interview requirements
        skillMatchPct = 40; 
      }

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
