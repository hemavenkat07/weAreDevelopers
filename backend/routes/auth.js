import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Settings from '../models/Settings.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const settings = await Settings.get();
    const joiningBonus = settings.joiningBonusAmount ?? 2000;

    const user = await User.create({
      name,
      email,
      phone: phone || '',
      password,
      walletBalance: joiningBonus,
    });

    const token = generateToken(user._id);
    const userResponse = await User.findById(user._id).select('-password');
    res.status(201).json({
      user: { ...userResponse.toObject(), walletBalance: user.walletBalance },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    const userResponse = await User.findById(user._id).select('-password');
    res.json({
      user: userResponse.toObject(),
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/auth/me - update profile (name, phone, address) - dynamic per user
router.patch('/me', protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...(name != null && { name }), ...(phone != null && { phone }), ...(address != null && { address }) },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/wallet/refill - dummy refill: add ₹500 to current user's wallet
router.post('/wallet/refill', protect, async (req, res) => {
  try {
    const REFILL_AMOUNT = 500;
    const user = await User.findById(req.user.id);
    user.walletBalance = (user.walletBalance || 0) + REFILL_AMOUNT;
    await user.save();
    const updated = await User.findById(user._id).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
