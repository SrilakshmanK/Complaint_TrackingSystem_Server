const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gmail: { type: String, required: true, unique: true },
  phoneNo: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  dept:{ type: String, required: true },
  programme:{ type: String, required: true },
  // dept: { type: mongoose.Schema.Types.ObjectId, required: true },
  // programme:{ type: mongoose.Schema.Types.ObjectId, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
