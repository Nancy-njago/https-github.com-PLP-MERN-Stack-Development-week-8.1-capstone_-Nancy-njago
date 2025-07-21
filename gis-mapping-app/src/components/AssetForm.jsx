import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (selectedAsset) setFormData(selectedAsset);
  }, [selectedAsset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAsset?.id) {
        await updateAsset(selectedAsset.id, formData);
      } else {
        await createAsset(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Submission error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full sm:w-[90%] md:w-[400px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {selectedAsset ? 'Edit Asset' : 'Add Asset'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Asset Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="Pole">Pole</option>
              <option value="Transformer">Transformer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Faulty">Faulty</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Notes</label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
