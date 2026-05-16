const Complaint = require('../models/Complaint');
const Counter   = require('../models/Counter');
const multer    = require('multer');
const path      = require('path');
const mongoose  = require('mongoose');

// ─── Multer storage ────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Generate an atomic, collision-safe complaint code: CMP-YYYY-NNNN
 * Uses a Mongo counter document with $inc — guaranteed unique under concurrency.
 */
async function generateComplaintCode() {
  const year        = new Date().getFullYear();
  const counterName = `complaint_${year}`;
  const counter     = await Counter.findOneAndUpdate(
    { name: counterName },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return `CMP-${year}-${String(counter.value).padStart(4, '0')}`;
}

const ALLOWED_TYPES = [
  'PC Hardware', 'PC Software', 'Application Issues',
  'Network', 'Electronics', 'Plumbing',
];

const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

// ─── Create Complaint ──────────────────────────────────────────────────────────
module.exports.CreateComplaint = async (req, res) => {
  try {
    let { block, room, message, complaintType, priority, currentUser } = req.body;

    console.log('[CreateComplaint] body:', { block, room, complaintType, priority, hasFile: !!req.file });

    if (!block || !room || !message || !complaintType || !currentUser) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Parse currentUser when passed as JSON string (multipart form)
    if (typeof currentUser === 'string') {
      try { currentUser = JSON.parse(currentUser); }
      catch { return res.status(400).json({ error: 'Invalid currentUser payload' }); }
    }

    if (!ALLOWED_TYPES.includes(complaintType)) {
      return res.status(400).json({ error: 'Invalid complaintType' });
    }

    // Priority defaults to 'Medium' if not provided or invalid
    const resolvedPriority = ALLOWED_PRIORITIES.includes(priority) ? priority : 'Medium';

    // Generate unique human-readable code
    const code = await generateComplaintCode();

    const newComplaint = await Complaint.create({
      code,
      block,
      room,
      message,
      complaintType,
      priority: resolvedPriority,
      role:       null,
      assignedTo: null,
      status:     'Assign',
      currentUser: {
        name:      currentUser.name,
        gmail:     currentUser.gmail,
        phoneNo:   currentUser.phoneNo,
        dept:      currentUser.dept,
        programme: currentUser.programme,
      },
      media: req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png',
      assignedHistory: [],
    });

    res.status(201).json({ message: 'Complaint created successfully', complaint: newComplaint });
  } catch (error) {
    console.error('[CreateComplaint] error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── Get All Complaints (Admin) ───────────────────────────────────────────────
module.exports.GetComplaint = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('assignedTo', 'name gmail')
      .populate('role',       'role')
      .sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Get My Complaints (Staff — backend-filtered, secure) ─────────────────────
/**
 * Returns ONLY complaints assigned to the authenticated staff member.
 * req.user.id is set by verifyToken middleware from the signed JWT —
 * the client cannot spoof it.
 */
module.exports.GetMyComplaints = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const complaints = await Complaint.find({ assignedTo: req.user.id })
      .populate('assignedTo', 'name gmail')
      .populate('role',       'role')
      .sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('[GetMyComplaints] error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── Update Complaint Status ───────────────────────────────────────────────────
module.exports.UpdateComplaint = async (req, res) => {
  try {
    const { id }     = req.params;
    const { status } = req.body;

    if (status === 'Assigned') {
      return res.status(400).json({ error: 'Use AssignComplaint endpoint to assign a complaint' });
    }
    if (status === 'Assign' && (!req.user || req.user.role !== 'Super Admin')) {
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

// ─── Assign / Reassign Complaint (Super Admin only) ───────────────────────────
/**
 * Expects body: { role: <roleId>, assignedTo: <userId> }
 * Saves both fields and appends a history entry for full audit trail.
 */
module.exports.AssignComplaint = async (req, res) => {
  try {
    const { id }                  = req.params;
    const { role, assignedTo }    = req.body;

    if (!req.user || req.user.role !== 'Super Admin') {
      return res.status(403).json({ error: 'Forbidden: Only Super Admin can assign complaints' });
    }

    if (!role || !mongoose.Types.ObjectId.isValid(role)) {
      return res.status(400).json({ error: 'Valid role id is required' });
    }
    if (!assignedTo || !mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({ error: 'Valid assignedTo (user id) is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid complaint id' });
    }

    console.log('[AssignComplaint]', { id, role, assignedTo, by: req.user.gmail });

    const comp = await Complaint.findById(id);
    if (!comp) return res.status(404).json({ error: 'Complaint not found' });
    if (comp.status === 'Completed') {
      return res.status(409).json({ error: 'Cannot reassign a completed complaint' });
    }

    // Update assignment fields
    comp.role       = role;
    comp.assignedTo = assignedTo;
    comp.status     = 'Assigned';

    // Append to audit history
    comp.assignedHistory.push({
      assignedTo:   assignedTo,
      assignedRole: role,
      assignedBy:   req.user.id,
      assignedAt:   new Date(),
    });

    await comp.save();

    // Populate before sending response so frontend gets names immediately
    await comp.populate('assignedTo', 'name gmail');
    await comp.populate('role',       'role');

    res.status(200).json({ message: 'Complaint assigned', complaint: comp });
  } catch (error) {
    console.error('[AssignComplaint] error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── Complaint Report (Super Admin) ───────────────────────────────────────────
module.exports.GetComplaintReport = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Super Admin') {
      return res.status(403).json({ error: 'Forbidden: Only Super Admin can generate reports' });
    }

    const { dept, programme, complaintType, status, assignee, priority } = req.query;

    const q = {};
    if (dept)          q['currentUser.dept']       = dept;
    if (programme)     q['currentUser.programme']  = programme;
    if (complaintType) q.complaintType             = complaintType;
    if (status)        q.status                    = status;
    if (priority)      q.priority                  = priority;
    if (assignee)      q.role                      = assignee; // role ObjectId

    const results = await Complaint.find(q)
      .populate('assignedTo', 'name gmail')
      .populate('role',       'role');

    res.status(200).json({ count: results.length, results });
  } catch (error) {
    console.error('[GetComplaintReport] error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.upload = upload;
