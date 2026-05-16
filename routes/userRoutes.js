const express     = require('express');
const verifyToken = require('../middleware/auth');
const router      = express.Router();

const { CreateUser, GetUser, DeleteUser, GetUsersByRole } = require('../controllers/UserController');

router.post('/',            CreateUser);
router.get('/',             GetUser);
router.delete('/:id',       DeleteUser);

// Dynamic staff picker — used by admin assign modal
// GET /api/users/by-role?roleId=<id>
router.get('/by-role',      verifyToken, GetUsersByRole);

module.exports = router;
