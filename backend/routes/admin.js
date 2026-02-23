import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Settings from '../models/Settings.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, admin);

// GET /api/admin/settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await Settings.get();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/settings
router.put('/settings', async (req, res) => {
  try {
    const { joiningBonusAmount } = req.body;
    const settings = await Settings.get();
    if (joiningBonusAmount != null) settings.joiningBonusAmount = Number(joiningBonusAmount);
    settings.updatedBy = req.user.id;
    settings.updatedAt = new Date();
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id/wallet
router.put('/users/:id/wallet', async (req, res) => {
  try {
    const { walletBalance } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { walletBalance: Number(walletBalance) },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();
    const withId = orders.map((o) => ({
      ...o,
      id: o._id.toString(),
      orderDate: o.createdAt,
    }));
    res.json(withId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/orders/:id/status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
