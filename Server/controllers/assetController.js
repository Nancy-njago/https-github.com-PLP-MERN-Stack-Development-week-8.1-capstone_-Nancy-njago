import Asset from '../models/Asset.js';

// GET /api/assets
export const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/assets
export const createAsset = async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/assets/:id
export const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Not found' });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/assets/:id
export const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    res.status(200).json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/assets/:id
export const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);

    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    res.status(204).send(); // No Content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

