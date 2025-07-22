import express from 'express';
import * as assetController from '../controllers/assetController.js'; // <-- Updated line
import protect from '../middleware/auth.js';

const router = express.Router();

// Middleware to check for admin role
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  next();
};

// Public routes (but protected by auth)
router.get('/', protect, assetController.getAssets);
router.get('/:id', protect, assetController.getAssetById);

// Admin-only routes
router.post('/', protect, adminOnly, assetController.createAsset);
router.put('/:id', protect, adminOnly, assetController.updateAsset);
router.delete('/:id', protect, adminOnly, assetController.deleteAsset);

export default router;

