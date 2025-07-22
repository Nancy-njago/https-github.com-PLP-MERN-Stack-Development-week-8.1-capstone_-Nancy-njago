const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('../index');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config();

// Connect to DB before tests run
beforeAll(async () => {
  await connectDB();
});

// Disconnect after tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Test: invalid login
test('POST /api/auth/login - fail with invalid credentials', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'wrong', password: 'invalid' });

  console.log('Response:', res.statusCode, res.body);

  // Update expected code if your route returns 404 instead of 401
 expect(res.statusCode).toBe(404); 
});



