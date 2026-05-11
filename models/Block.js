const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema({
  dept: { type: mongoose.Schema.Types.ObjectId, required: true},
  programme:{ type: mongoose.Schema.Types.ObjectId, required: true},
  block: { type: String, required: true  }
}, { timestamps: true });

module.exports = mongoose.model('Block', BlockSchema);
