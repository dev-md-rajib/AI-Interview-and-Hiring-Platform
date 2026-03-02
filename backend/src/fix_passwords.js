const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

async function fixPasswords() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const result = await User.updateMany({}, { password: hashedPassword });
  console.log(`Successfully reset passwords to 'password123' for ${result.modifiedCount} users.`);
  process.exit(0);
}

fixPasswords();
