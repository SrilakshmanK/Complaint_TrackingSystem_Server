const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.login = async (req, res) => {
  const { gmail, password } = req.body;

  try {
    // 1. Validation
    if (!gmail || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // 2. Find user & populate role name
    const user = await User.findOne({ gmail }).populate('role', 'role');
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // 4. Create token
    const token = jwt.sign(
      {
        id: user._id,
        gmail: user.gmail,
        role: user.role.role // role name instead of _id
      },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );

    // 5. Send response
    res.json({
      success: true,
      message: 'Login success',
      token,
      role: user.role.role,
      roleId: user.role._id,
      user: {
        id: user._id,
        name: user.name,
        gmail: user.gmail,
        phoneNo: user.phoneNo,
        dept: user.dept,
        programme: user.programme
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
