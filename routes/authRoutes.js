const express = require('express');
const verifyToken = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Import controllers (make sure each controller file exports using `module.exports = { functionName }`)
const { login } = require('../controllers/LoginController');
const { profile } = require('../controllers/ProfileController');
const { CreateDepartment, GetDepartment } = require('../controllers/DeptController');
const { CreateProgramme, GetProgramme } = require('../controllers/ProgrammeController');
const { CreateBlock, GetBlock } = require('../controllers/BlockController');
const { CreateRoomNo, GetRoomNo } = require('../controllers/RoomNumberController');
const { CreateRole, GetRole } = require('../controllers/RoleController');
const { CreateUser, GetUser, DeleteUser } = require('../controllers/UserController');
const { CreateComplaint, GetComplaint, UpdateComplaint, AssignComplaint, GetComplaintReport } = require('../controllers/ComplaintController');


// Define routes
router.post('/login', login);
router.get('/profile', verifyToken, profile);

router.post('/CreateDepartment',  CreateDepartment);
router.get('/GetDepartment', GetDepartment);

router.post('/CreateProgramme', CreateProgramme);
router.get('/GetProgramme', GetProgramme);

router.post('/CreateRoomNo', CreateRoomNo);
router.get('/GetRoomNo', GetRoomNo);

router.post('/CreateBlock', CreateBlock);
router.get('/GetBlock', GetBlock);

router.post('/CreateRole', CreateRole);
router.get('/GetRole', GetRole);

router.post('/CreateUser', CreateUser);
router.get('/GetUser', GetUser);
router.delete('/DeleteUser/:id',DeleteUser)

router.post('/CreateComplaint', upload.single('media'), CreateComplaint);
router.get('/GetComplaint', GetComplaint);
router.put('/UpdateComplaint/:id', verifyToken, UpdateComplaint);
router.put('/AssignComplaint/:id', verifyToken, AssignComplaint);
router.get('/GetComplaintReport', verifyToken, GetComplaintReport);


module.exports = router;
