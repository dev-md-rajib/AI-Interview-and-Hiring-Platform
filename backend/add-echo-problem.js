const mongoose = require('mongoose');
require('dotenv').config();
const QuestionBank = require('./src/models/QuestionBank');

const addProblem = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    await QuestionBank.create({
      stack: 'Python',
      level: 1,
      type: 'coding',
      question: 'Echo Program: Read a single line of string input and simply print it back exactly as it was received.',
      difficulty: 'easy',
      skill: 'I/O Basics',
      testCases: [
        { input: 'Hello World!', expectedOutput: 'Hello World!', hidden: false },
        { input: 'Python is easy', expectedOutput: 'Python is easy', hidden: false },
        { input: 'Hidden test case input', expectedOutput: 'Hidden test case input', hidden: true }
      ],
      allowedLanguages: ['python', 'javascript'],
      marks: 10
    });
    
    console.log('Successfully added Echo problem.');
    process.exit(0);
  } catch (err) {
    console.error('Error adding problem:', err);
    process.exit(1);
  }
};

addProblem();
