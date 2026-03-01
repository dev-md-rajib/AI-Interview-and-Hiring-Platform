const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    profileImage: { type: String, default: '' },
    role: {
      type: String,
      enum: ['CANDIDATE', 'RECRUITER', 'ADMIN'],
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
