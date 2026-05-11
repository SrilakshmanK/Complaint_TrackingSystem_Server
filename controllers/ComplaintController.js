const Complaint = require('../models/Complaint');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Create Complaint
module.exports.CreateComplaint = async (req, res) => {
  try {
    let { block, room, message, complaintType, currentUser } = req.body;

    // Basic diagnostics
    // Note: do not log large files; only log file presence
    console.log('[CreateComplaint] body:', {
      block,
      room,
      complaintType,
      hasFile: !!req.file,
    });

    if (!block || !room || !message || !complaintType || !currentUser) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Safely parse currentUser when passed as JSON string
    if (typeof currentUser === 'string') {
      try {
        currentUser = JSON.parse(currentUser);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid currentUser payload' });
      }
    }

    // Validate complaintType against enum
    const allowedTypes = [
      'PC Hardware',
      'PC Software',
      'Application Issues',
      'Network',
      'Electronics',
      'Plumbing',
    ];
    if (!allowedTypes.includes(complaintType)) {
      return res.status(400).json({ error: 'Invalid complaintType' });
    }

    // Note: role is optional on creation; complaints start unassigned
    // No ObjectId validation for dept/programme; they are strings in the model

    const newComplaint = await Complaint.create({
      block,
      room,
      message,
      complaintType,
      role: null,
      status: 'Assign',
      currentUser: {
        name: currentUser.name,
        gmail: currentUser.gmail,
        phoneNo: currentUser.phoneNo,
        dept: currentUser.dept,
        programme: currentUser.programme,
      },
      media: req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png',
    });

    res.status(201).json({ message: 'Complaint created successfully', complaint: newComplaint });
  } catch (error) {
    console.error('[CreateComplaint] error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Generate complaint report (Super Admin only) with filters via query params
// Query params: dept, programme, complaintType, status, assignee (role id)
module.exports.GetComplaintReport = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Super Admin') {
      return res.status(403).json({ error: 'Forbidden: Only Super Admin can generate reports' });
    }

    const { dept, programme, complaintType, status, assignee } = req.query;

    const q = {};
    if (dept) q['currentUser.dept'] = dept;
    if (programme) q['currentUser.programme'] = programme;
    if (complaintType) q.complaintType = complaintType;
    if (status) q.status = status;
    if (assignee) q.role = assignee; // expects role ObjectId string

    const results = await Complaint.find(q);
    res.status(200).json({ count: results.length, results });
  } catch (error) {
    console.error('[GetComplaintReport] error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all complaints
module.exports.GetComplaint = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update complaint (status changes only, except 'Assigned' which requires AssignComplaint)
module.exports.UpdateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status === 'Assigned') {
      return res.status(400).json({ error: "Use AssignComplaint endpoint to assign a complaint" });
    }

    // Only Super Admin can set/unset assignment state
    if ((status === 'Assign') && (!req.user || req.user.role !== 'Super Admin')) {
      return res.status(403).json({ error: 'Forbidden: Only Super Admin can unassign complaints' });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedComplaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.status(200).json({ message: 'Complaint updated', complaint: updatedComplaint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign or reassign complaint (Super Admin only)
module.exports.AssignComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // role id to assign

    if (!req.user || req.user.role !== 'Super Admin') {
      return res.status(403).json({ error: 'Forbidden: Only Super Admin can assign complaints' });
    }

    if (!role || !mongoose.Types.ObjectId.isValid(role)) {
      return res.status(400).json({ error: 'Valid role id is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid complaint id' });
    }

    console.log('[AssignComplaint] request', { id, role, user: req.user.gmail, asRole: req.user.role });

    const comp = await Complaint.findById(id);
    if (!comp) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    if (comp.status === 'Completed') {
      return res.status(409).json({ error: 'Cannot reassign a completed complaint' });
    }

    comp.role = role;
    comp.status = 'Assigned';
    await comp.save();

    res.status(200).json({ message: 'Complaint assigned', complaint: comp });
  } catch (error) {
    console.error('[AssignComplaint] error:', error);
    res.status(500).json({ error: error.message });
  }
};
