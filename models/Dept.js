const mongoose = require('mongoose');

const deptSchema = new mongoose.Schema({
  dept: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Department', deptSchema);
