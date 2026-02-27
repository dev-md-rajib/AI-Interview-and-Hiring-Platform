require('dotenv').config();
const mongoose = require('mongoose');
const InterviewLevel = require('./models/InterviewLevel');
const User = require('./models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Seed interview levels
    const levels = [
      {
        level: 1,
        name: 'Junior Level',
        description: 'Foundational knowledge — basic concepts, syntax, simple patterns',
        requiredSkills: ['Variables', 'Functions', 'Loops', 'Data Structures'],
        minimumPassScore: 60,
        allowedStacks: ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'PHP', 'Vue.js', 'Angular', 'SQL', 'MongoDB'],
        durationMinutes: 45,
        questionCount: 10,
      },
      {
        level: 2,
        name: 'Mid Level',
        description: 'Intermediate knowledge — system design basics, optimization, architecture',
        requiredSkills: ['Design Patterns', 'APIs', 'Testing', 'Performance', 'Security'],
        minimumPassScore: 70,
        allowedStacks: ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'PHP', 'Vue.js', 'Angular', 'SQL', 'MongoDB', 'TypeScript', 'Docker'],
        durationMinutes: 60,
        questionCount: 12,
      },
      {
        level: 3,
        name: 'Senior Level',
        description: 'Advanced knowledge — complex architecture, scalability, leadership, deep analysis',
        requiredSkills: ['System Design', 'Scalability', 'Distributed Systems', 'Team Leadership'],
        minimumPassScore: 80,
        allowedStacks: ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'PHP', 'Vue.js', 'Angular', 'SQL', 'MongoDB', 'TypeScript', 'Docker', 'Kubernetes', 'AWS'],
        durationMinutes: 90,
        questionCount: 15,
      },
    ];

    for (const levelData of levels) {
      await InterviewLevel.findOneAndUpdate({ level: levelData.level }, levelData, { upsert: true });
      console.log(`✅ Level ${levelData.level} seeded: ${levelData.name}`);
    }

    // Seed admin user
    const adminExists = await User.findOne({ email: 'admin@aiplatform.com' });
    if (!adminExists) {
      await User.create({
        name: 'Platform Admin',
        email: 'admin@aiplatform.com',
        password: 'Admin@12345',
        role: 'ADMIN',
        isEmailVerified: true,
        isVerified: true,
      });
      console.log('✅ Admin user created: admin@aiplatform.com / Admin@12345');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
