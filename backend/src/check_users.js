const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function checkUsers() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({}, 'name email role _id');
  console.log("Users in DB:");
  console.table(users.map(u => ({ email: u.email, role: u.role, name: u.name })));
  process.exit(0);
}

checkUsers();
