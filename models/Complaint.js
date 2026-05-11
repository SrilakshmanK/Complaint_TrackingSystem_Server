const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  block: { type: String, required: true },
  room: { type: String, required: true },
  message: { type: String, required: true },
  complaintType: { 
    type: String,
    enum: ["PC Hardware", "PC Software", "Application Issues", "Network", "Electronics", "Plumbing"], 
    required: true 
  },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: false, default: null },
  status: { type: String, enum: ['Assign', 'Assigned', 'In-Progress', 'OnHold', 'Completed'], default: 'Assign', required: true },
  media: { type: String, default:"/uploads/default.png" }, // optional URL or path
  currentUser: { 
    name: String,
    gmail: String,
    phoneNo: Number,
    dept: { type: String },
    programme: { type: String },
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
