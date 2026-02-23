import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  joiningBonusAmount: { type: Number, default: 2000 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Single document for app settings
settingsSchema.statics.get = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model('Settings', settingsSchema);
