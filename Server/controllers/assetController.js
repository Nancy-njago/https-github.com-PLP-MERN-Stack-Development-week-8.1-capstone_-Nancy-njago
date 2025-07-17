const Asset = require('../models/Asset');

// GET /api/assets
exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/assets
exports.createAsset = async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/assets/:id
exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Not found' });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/assets/:id
exports.updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/assets/:id
exports.deleteAsset = async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: 'Asset deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
