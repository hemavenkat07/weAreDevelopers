import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/orders - my orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
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

// POST /api/orders - place order
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;
    if (!items?.length || totalAmount == null || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Items, totalAmount, deliveryAddress, paymentMethod required' });
    }
    if (paymentMethod !== 'wallet') {
      return res.status(400).json({ message: 'Only wallet payment is supported' });
    }

    {
      const user = await User.findById(req.user.id);
      if (user.walletBalance < totalAmount) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
      user.walletBalance -= totalAmount;
      await user.save();
    }

    const orderItems = items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image || '',
    }));

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
    });

    res.status(201).json({
      ...order.toObject(),
      id: order._id.toString(),
      orderDate: order.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
