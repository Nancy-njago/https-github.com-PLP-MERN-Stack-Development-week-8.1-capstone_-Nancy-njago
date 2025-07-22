// tests/assetRoutes.test.js
process.env.MONGOMS_DOWNLOAD_DIR = './mongodb-binaries';
jest.setTimeout(180000); // Increase timeout for downloads & connection

require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

const app = require('../index'); // Your Express app
const User = require('../models/User');
const Asset = require('../models/Asset');

let mongo;
let tokenAdmin;
let tokenTech;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  let connected = false;
  let retries = 0;
  const maxRetries = 10;

  while (!connected && retries < maxRetries) {
    try {
      await mongoose.connect(uri, {
        dbName: 'test',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      connected = true;
    } catch (err) {
      retries++;
      await new Promise(res => setTimeout(res, 1000)); // wait 1s
    }
  }

  if (!connected) throw new Error('Could not connect to in-memory MongoDB');

  const admin = new User({ username: 'admin', password: 'pass123', role: 'admin' });
  const tech = new User({ username: 'tech', password: 'pass123', role: 'technician' });

  await admin.save();
  await tech.save();

  tokenAdmin = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
  tokenTech = jwt.sign({ id: tech._id, role: 'technician' }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe('Asset API Integration', () => {
  let assetId;

  test('Admin can create an asset', async () => {
    const res = await request(app)
      .post('/api/assets')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        name: 'Test Pole',
        type: 'Pole',
        status: 'Active',
        notes: 'Installed today',
        location: { type: 'Point', coordinates: [10, 20] },
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Pole');
    assetId = res.body._id;
  });

  test('Technician CANNOT create an asset', async () => {
    const res = await request(app)
      .post('/api/assets')
      .set('Authorization', `Bearer ${tokenTech}`)
      .send({
        name: 'Blocked Asset',
        type: 'Pole',
        status: 'Active',
        location: { type: 'Point', coordinates: [10, 20] },
      });

    expect(res.statusCode).toBe(403);
  });

  test('Admin can update an asset', async () => {
    const res = await request(app)
      .put(`/api/assets/${assetId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ name: 'Updated Pole' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Pole');
  });

  test('Admin can delete an asset', async () => {
    const res = await request(app)
      .delete(`/api/assets/${assetId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(204);
  });

  test('404 when updating non-existent asset', async () => {
    const res = await request(app)
      .put('/api/assets/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ name: 'Ghost' });

    expect(res.statusCode).toBe(404);
  });
});
