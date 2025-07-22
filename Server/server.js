// server.js
// server.js (or main entry file)
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './index.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});