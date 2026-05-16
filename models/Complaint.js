const mongoose = require('mongoose');

// Subdocument schema for assignment audit trail
const assignmentHistorySchema = new mongoose.Schema({
  assignedTo:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedRole: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null },
  assignedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedAt:   { type: Date, default: Date.now },
  note:         { type: String, default: '' },
}, { _id: false }); // _id: false keeps subdocs lightweight

const complaintSchema = new mongoose.Schema({
  // Human-readable code — auto-generated: CMP-YYYY-NNNN
  code: { type: String, unique: true, sparse: true, index: true },

  block: { type: String, required: true },
  room:  { type: String, required: true },
  message:      { type: String, required: true },
  complaintType: {
    type: String,
    enum: ['PC Hardware', 'PC Software', 'Application Issues', 'Network', 'Electronics', 'Plumbing'],
    required: true,
  },

  // Priority — default Medium; existing docs treated as Medium by UI
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },

  // Role assignment (categorical — still used for reports)
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null },

  // Individual staff assignment — the NEW gate for staff visibility
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  status: {
    type: String,
    enum: ['Assign', 'Assigned', 'In-Progress', 'OnHold', 'Completed'],
    default: 'Assign',
    required: true,
  },

  media: { type: String, default: '/uploads/default.png' },

  currentUser: {
    name:      String,
    gmail:     String,
    phoneNo:   Number,
    dept:      { type: String },
    programme: { type: String },
  },

  // Full audit trail — appended on every assign/reassign
  assignedHistory: { type: [assignmentHistorySchema], default: [] },

}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
