require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function getTestUsers() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://cms:cms@cms.z0jqt2n.mongodb.net/?appName=CMS'); // assuming
  
  const superAdmin = await User.findOne({}).populate({ path: 'role', match: { role: 'Super Admin' } });
  const student = await User.findOne({}).populate({ path: 'role', match: { role: 'Student' } });
  
  console.log("Super Admin:", superAdmin ? superAdmin.gmail : "Not found");
  console.log("Student:", student ? student.gmail : "Not found");
  process.exit(0);
}

getTestUsers();
