const mongoose = require('mongoose');

const programmeSchema = new mongoose.Schema({
  dept: { type: mongoose.Schema.Types.ObjectId, required: true },
  programme:{ type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Programme', programmeSchema);
