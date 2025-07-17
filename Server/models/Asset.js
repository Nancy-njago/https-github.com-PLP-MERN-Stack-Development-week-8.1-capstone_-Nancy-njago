const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Pole', 'Transformer', 'Cable', 'Meter'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Faulty'],
    default: 'Active',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

AssetSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Asset', AssetSchema);
