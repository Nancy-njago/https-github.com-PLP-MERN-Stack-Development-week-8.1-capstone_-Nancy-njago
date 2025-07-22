import mongoose from 'mongoose';

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

// Enable geospatial queries
AssetSchema.index({ location: '2dsphere' });

const Asset = mongoose.model('Asset', AssetSchema);
export default Asset;

