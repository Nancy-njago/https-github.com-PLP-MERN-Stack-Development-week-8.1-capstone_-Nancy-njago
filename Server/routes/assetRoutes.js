const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const protect = require('../middleware/auth');

router.get('/', assetController.getAssets);
router.post('/', assetController.createAsset);
router.get('/:id', assetController.getAssetById);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
