import { useState } from 'react';
import { createAsset, updateAsset } from '../services/api';

export default function AssetForm({ onClose, selectedAsset, onSuccess }) {
  const [formData, setFormData] = useState(
    selectedAsset || {
      name: '',
      type: 'Pole',
      status: 'Active',
      notes: '',
      location: { type: 'Point', coordinates: [0, 0] },
    }
  );

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAsset) {
        await updateAsset(selectedAsset._id, formData);
      } else {
        await createAsset(formData);
      }
      onSuccess(); // Refresh map
      onClose();   // Close form
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="form-panel">
      <h3>{selectedAsset ? 'Edit Asset' : 'Add Asset'}</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Asset Name" value={formData.name} onChange={handleChange} required />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="Pole">Pole</option>
          <option value="Transformer">Transformer</option>
        </select>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Faulty">Faulty</option>
        </select>
        <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} />
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}
