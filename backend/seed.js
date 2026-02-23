import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Product from './models/Product.js';
import Settings from './models/Settings.js';

const products = [
  { name: 'Fresh Tomatoes', description: 'Fresh red tomatoes, locally sourced', price: 40, originalPrice: 60, image: 'https://images.unsplash.com/photo-1714224247661-ee250f55a842?w=400', category: 'Vegetables', unit: '1 kg', stock: 50, rating: 4.5, reviews: 128 },
  { name: 'Organic Apples', description: 'Sweet and crispy organic apples', price: 180, originalPrice: 220, image: 'https://images.unsplash.com/photo-1621295538579-7fd8bb7a662a?w=400', category: 'Fruits', unit: '1 kg', stock: 30, rating: 4.8, reviews: 95 },
  { name: 'Fresh Milk', description: 'Full cream fresh milk', price: 60, image: 'https://images.unsplash.com/photo-1635714293982-65445548ac42?w=400', category: 'Dairy', unit: '1 L', stock: 40, rating: 4.6, reviews: 203 },
  { name: 'Whole Wheat Bread', description: 'Freshly baked whole wheat bread', price: 45, originalPrice: 50, image: 'https://images.unsplash.com/photo-1555932450-31a8aec2adf1?w=400', category: 'Bakery', unit: '400g', stock: 25, rating: 4.4, reviews: 67 },
  { name: 'Potato Chips', description: 'Crispy and delicious potato chips', price: 30, image: 'https://images.unsplash.com/photo-1741520149938-4f08654780ef?w=400', category: 'Snacks', unit: '100g', stock: 60, rating: 4.2, reviews: 142 },
  { name: 'Orange Juice', description: '100% pure orange juice', price: 120, originalPrice: 150, image: 'https://images.unsplash.com/photo-1598915850240-6e6cae81457a?w=400', category: 'Beverages', unit: '1 L', stock: 35, rating: 4.7, reviews: 89 },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  const existingAdmin = await User.findOne({ email: 'admin@freshmart.com' });
  if (!existingAdmin) {
    await User.create({ name: 'Admin', email: 'admin@freshmart.com', phone: '9999999999', password: 'admin123', role: 'admin', walletBalance: 0 });
    console.log('Admin created: admin@freshmart.com / admin123');
  }
  await Settings.findOneAndUpdate({}, { joiningBonusAmount: 2000 }, { upsert: true });
  console.log('Seed done: products and settings');
  process.exit(0);
}
seed().catch((e) => { console.error(e); process.exit(1); });
