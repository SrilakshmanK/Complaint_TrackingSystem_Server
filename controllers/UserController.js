const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // ✅ Missing import added
const User = require('../models/User');
const Role = require('../models/Role');

// ================== CREATE USER ==================
module.exports.CreateUser = async (req, res) => {
  const { name, gmail, password, phoneNo, role, dept, programme } = req.body;

  try {
    // 1. Validation
    if (!name || !gmail || !password || !phoneNo || !role || !dept || !programme) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // 2. Check if user exists
    const userExist = await User.findOne({ gmail });
    if (userExist) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // 3. Role validation
    let roleData;
    if (mongoose.Types.ObjectId.isValid(role)) {
      roleData = await Role.findById(role);
    } else {
      roleData = await Role.findOne({ role: role });
    }
    if (!roleData) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Save user
    const user = new User({
      name,
      gmail,
      password: hashedPassword,
      phoneNo,
      role: roleData._id,
      dept,
      programme
    });
    await user.save();

    // 6. JWT token
    const token = jwt.sign(
      { id: user._id, gmail: user.gmail, role: roleData.role },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );

    // 7. Response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      role: roleData.role,
      user
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ================== GET ALL USERS ==================
module.exports.GetUser = async (req, res) => {
  try {
    // ✅ Populate role name in response
    const Users = await User.find()
      .populate('role', 'role') // only get role name
      .sort({ createdAt: -1 });

    res.status(200).json(Users);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ================== DELETE USER ==================
module.exports.DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
