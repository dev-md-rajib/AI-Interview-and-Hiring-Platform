const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const availabilitySlotSchema = new mongoose.Schema({
  dayOfWeek: { type: Number, min: 0, max: 6 }, // 0=Sun, 1=Mon, ..., 6=Sat
  startTime: { type: String }, // "HH:MM" 24h format
  endTime: { type: String },   // "HH:MM" 24h format
}, { _id: false });

const interviewerProfileSchema = new mongoose.Schema({
  expertise: [{ type: String }], // tech stacks
  sectors: [{ type: String }], // business sectors
  availabilitySlots: [availabilitySlotSchema],
  isActive: { type: Boolean, default: true },
  totalInterviewsConducted: { type: Number, default: 0 },
  bio: { type: String, default: '' },
  hostEmail: { type: String, default: '', trim: true, lowercase: true }, // Zoom host email for hosting interviews
}, { _id: false });

const recruiterProfileSchema = new mongoose.Schema({
  company: { type: String, default: '', trim: true },
  position: { type: String, default: '', trim: true },
  workDetails: { type: String, default: '', trim: true },
  location: { type: String, default: '', trim: true },
  companyWebsite: { type: String, default: '', trim: true },
  companyLogo: { type: String, default: '' },
  linkedin: { type: String, default: '', trim: true },
  twitter: { type: String, default: '', trim: true },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    profileImage: { type: String, default: '' },
    role: {
      type: String,
      enum: ['CANDIDATE', 'RECRUITER', 'ADMIN', 'INTERVIEWER'],
      default: 'CANDIDATE',
    },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String, default: '' },
    appealText: { type: String, default: '' },
    appealStatus: {
      type: String,
      enum: ['None', 'Pending', 'Reviewed', 'Rejected'],
      default: 'None'
    },
    isEmailVerified: { type: Boolean, default: true }, // simplified: auto-verified
    isVerified: { type: Boolean, default: false }, // for recruiters: admin-verified
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
    // Candidate-specific: cooldown after cancel/fail a team interview
    teamInterviewCooldownUntil: { type: Date, default: null },
    // Interviewer-specific profile
    interviewerProfile: { type: interviewerProfileSchema, default: undefined },
    // Recruiter-specific profile
    recruiterProfile: { type: recruiterProfileSchema, default: () => ({}) },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePass) {
  return bcrypt.compare(candidatePass, this.password);
};

module.exports = mongoose.model('User', userSchema);
