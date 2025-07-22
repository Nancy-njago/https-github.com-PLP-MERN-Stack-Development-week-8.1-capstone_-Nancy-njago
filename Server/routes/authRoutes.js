import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// ✅ Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    router.post('/login', async (req, res) => {
  // logic to find user and validate password
});

    // ✅ Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // ✅ Check for duplicates
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // ✅ Create and save user
    const newUser = new User({ username, email, password, role });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Registration error:', err);

    if (err.code === 11000) {
      const key = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `${key} already exists` });
    }

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(', ') });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    // Respond with token and user info
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
