const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, default: 0, min: 0, max: 100 },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' },
});

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: Number,
});

const certificationSchema = new mongoose.Schema({
  name: String,
  issuer: String,
  year: Number,
  url: String,
});

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  mediaUrl: String,
  mediaType: { type: String, enum: ['image', 'video', 'link', 'other'], default: 'link' },
  createdAt: { type: Date, default: Date.now },
});

const candidateProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    expertise: [{ type: String }],
    yearsOfExperience: { type: Number, default: 0 },
    education: [educationSchema],
    certifications: [certificationSchema],
    skills: [skillSchema],
    portfolioTimeline: [portfolioSchema],
    currentLevel: { type: Number, default: 0 }, // 0 = not started, 1/2/3
    overallScore: { type: Number, default: 0 },
    availability: { type: String, enum: ['Available', 'Not Available', 'Open to Offers'], default: 'Available' },
    linkedIn: String,
    github: String,
    website: String,
    bio: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
