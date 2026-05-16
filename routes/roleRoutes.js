const express = require('express');
const router  = express.Router();

const { CreateRole, GetRole } = require('../controllers/RoleController');

router.post('/', CreateRole);
router.get('/',  GetRole);

module.exports = router;
