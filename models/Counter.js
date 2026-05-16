const mongoose = require('mongoose');

/**
 * Counter — atomic sequence counter for generating human-readable complaint codes.
 * 
 * Each document is keyed by `name` (e.g., "complaint_2026") and holds the
 * last-used integer value.  Using findOneAndUpdate with $inc is MongoDB-atomic,
 * so concurrent requests can never get the same sequence number.
 */
const counterSchema = new mongoose.Schema({
  name:  { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});

module.exports = mongoose.model('Counter', counterSchema);
