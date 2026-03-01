const mongoose = require('mongoose');
require('dotenv').config();

const PracticeSubmission = require('./src/models/PracticeSubmission');

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Drop the old index which enforces uniqueness on just candidate+question
    await PracticeSubmission.collection.dropIndex('candidate_1_question_1');
    console.log('Dropped old index: candidate_1_question_1');

    // Mongoose will automatically build the new index on candidate+question+language
    await PracticeSubmission.syncIndexes();
    console.log('Synced new indexes');
    
    process.exit(0);
  } catch (err) {
    console.error('Error fixing indexes:', err.message);
    process.exit(1);
  }
};

fixIndexes();
