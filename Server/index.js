const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authroutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // to parse JSON body

app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api/auth', authRoutes);
