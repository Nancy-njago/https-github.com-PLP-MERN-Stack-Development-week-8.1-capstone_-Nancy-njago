require('dotenv').config();
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js'; // ✅ Corrected file casing
import assetRoutes from './routes/assetRoutes.js';

// === Load environment variables ===
dotenv.config();

// === MongoDB Connection ===
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// === Initialize Express App ===
const app = express();

// === Middleware ===
app.use(cors());
app.use(express.json()); // Body parser for JSON

// === Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);

// === Health Check ===
app.get('/', (req, res) => {
  res.send('✅ API is running');
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
