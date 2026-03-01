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

    // Seed some questions
    const QuestionBank = require('./models/QuestionBank');
    if (await QuestionBank.countDocuments() === 0) {
      await QuestionBank.insertMany([
        {
          stack: 'JavaScript',
          level: 1,
          type: 'mcq',
          question: 'What is the correct syntax for referring to an external script called "xxx.js"?',
          options: ['<script name="xxx.js">', '<script href="xxx.js">', '<script src="xxx.js">', '<link src="xxx.js">'],
          correctAnswer: '<script src="xxx.js">',
          difficulty: 'easy',
          skill: 'HTML/JS Integration'
        },
        {
          stack: 'JavaScript',
          level: 1,
          type: 'mcq',
          question: 'How do you write "Hello World" in an alert box?',
          options: ['msg("Hello World");', 'alert("Hello World");', 'msgBox("Hello World");', 'alertBox("Hello World");'],
          correctAnswer: 'alert("Hello World");',
          difficulty: 'easy',
          skill: 'Basic Syntax'
        },
        {
          stack: 'JavaScript',
          level: 2,
          type: 'coding',
          question: 'Write a program to reverse a string. The input string is given as a single argument (or via readline in stdin), and you must output the reversed string.',
          difficulty: 'easy',
          skill: 'Strings',
          testCases: [
            { input: 'hello', expectedOutput: 'olleh', hidden: false },
            { input: 'world', expectedOutput: 'dlrow', hidden: false },
            { input: 'javascript', expectedOutput: 'tpircsavaj', hidden: true }
          ],
          allowedLanguages: ['javascript', 'python'],
          marks: 10
        },
        {
          stack: 'Python',
          level: 2,
          type: 'coding',
          question: 'Given an array (comma-separated string input), print the sum of its elements.',
          difficulty: 'easy',
          skill: 'Arrays',
          testCases: [
            { input: '1,2,3', expectedOutput: '6', hidden: false },
            { input: '10,-5,5', expectedOutput: '10', hidden: false },
            { input: '100,200', expectedOutput: '300', hidden: true }
          ],
          allowedLanguages: ['javascript', 'python'],
          marks: 10
        }
      ]);
      console.log('✅ Seeded 4 sample questions into QuestionBank');
    } else {
      console.log('ℹ️  QuestionBank already has data');
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
