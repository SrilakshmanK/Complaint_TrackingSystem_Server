const express     = require('express');
const verifyToken = require('../middleware/auth');
const router      = express.Router();

const { login }   = require('../controllers/LoginController');
const { profile } = require('../controllers/ProfileController');

// Authentication endpoints only
router.post('/login',   login);
router.get('/profile',  verifyToken, profile);

module.exports = router;
