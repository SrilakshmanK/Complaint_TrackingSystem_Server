const express = require('express');
const router  = express.Router();

const { CreateDepartment, GetDepartment }   = require('../controllers/DeptController');
const { CreateProgramme,  GetProgramme }    = require('../controllers/ProgrammeController');
const { CreateBlock,      GetBlock }        = require('../controllers/BlockController');
const { CreateRoomNo,     GetRoomNo }       = require('../controllers/RoomNumberController');

// Departments
router.post('/departments', CreateDepartment);
router.get('/departments',  GetDepartment);

// Programmes
router.post('/programmes', CreateProgramme);
router.get('/programmes',  GetProgramme);

// Blocks
router.post('/blocks', CreateBlock);
router.get('/blocks',  GetBlock);

// Room Numbers
router.post('/rooms', CreateRoomNo);
router.get('/rooms',  GetRoomNo);

module.exports = router;
