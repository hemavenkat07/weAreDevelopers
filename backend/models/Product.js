import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  unit: { type: String, default: '1 pc' },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
