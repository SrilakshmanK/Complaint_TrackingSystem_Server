const express     = require('express');
const verifyToken = require('../middleware/auth');
const router      = express.Router();
const multer      = require('multer');
const upload      = multer({ dest: 'uploads/' });

const {
  CreateComplaint,
  GetComplaint,
  GetMyComplaints,
  UpdateComplaint,
  AssignComplaint,
  GetComplaintReport,
} = require('../controllers/ComplaintController');

// ── IMPORTANT: Specific routes MUST come before wildcard /:id routes ──────────

// ── Public ───────────────────────────────────────────────────────────────────
router.post('/', upload.single('media'), CreateComplaint);

// ── Staff (secure — backend filters by JWT user id) ──────────────────────────
// Must be before GET /:id to prevent Express treating 'my-complaints' as an id
router.get('/my-complaints', verifyToken, GetMyComplaints);

// ── Admin — specific named routes ────────────────────────────────────────────
router.get('/report',        verifyToken, GetComplaintReport);
router.put('/assign/:id',    verifyToken, AssignComplaint);

// ── Admin — wildcard routes (LAST) ───────────────────────────────────────────
router.get('/',              verifyToken, GetComplaint);
router.put('/:id',           verifyToken, UpdateComplaint);

module.exports = router;
