// ... imports unchanged
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  FeatureGroup,
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AssetForm from './AssetForm';
import { downloadGeoJSON, downloadCSV } from './exportUtils';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function MapView() {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [mapCenter, setMapCenter] = useState([-1.286389, 36.817223]); // Default: Nairobi

  // Fetch assets
  useEffect(() => {
    axios.get('/api/assets').then((res) => {
      setAssets(res.data);
      setFilteredAssets(res.data);
    });
  }, []);

  // Center map on user's location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setMapCenter([coords.latitude, coords.longitude]),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          console.warn('User denied geolocation');
          alert('Location access is blocked. Showing default location.');
        } else {
          console.warn('Geolocation error:', err.message);
        }
      }
    );
  }, []);

  const handleFilter = (type) => {
    if (type === 'All') {
      setFilteredAssets(assets);
    } else {
      setFilteredAssets(assets.filter((a) => a.type === type));
    }
  };

  const total = assets.length;
  const faulty = assets.filter((a) => a.status === 'Faulty').length;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '260px',
          background: '#f8f9fa',
          padding: '1rem',
          borderRight: '1px solid #ddd',
          height: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <h3>Asset Dashboard</h3>
        <p><strong>Total:</strong> {total}</p>
        <p><strong>Faulty:</strong> {faulty}</p>

        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => handleFilter('All')}>All</button><br />
          <button onClick={() => handleFilter('Pole')}>Poles</button><br />
          <button onClick={() => handleFilter('Transformer')}>Transformers</button>
        </div>

        <div>
          <button onClick={() => downloadGeoJSON(assets)}>Export GeoJSON</button><br /><br />
          <button onClick={() => downloadCSV(assets)}>Export CSV</button>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <MapContainer center={mapCenter} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <FeatureGroup>
            <EditControl
              position="topright"
              draw={{
                polygon: false,
                polyline: false,
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: true,
              }}
              onCreated={(e) => {
                const { lat, lng } = e.layer._latlng;
                setFormOpen(true);
                setSelectedAsset({
                  name: '',
                  type: 'Pole',
                  status: 'Active',
                  notes: '',
                  location: {
                    type: 'Point',
                    coordinates: [lng, lat],
                  },
                });
              }}
            />
          </FeatureGroup>

          {filteredAssets.map((asset) => {
            const position = [...asset.location.coordinates].reverse();
            return (
              <Marker
                key={asset._id}
                position={position}
                eventHandlers={{
                  click: () => {
                    setSelectedAsset(asset);
                    setFormOpen(true);
                  },
                }}
              >
                <Popup>
                  <b>{asset.name}</b><br />
                  Type: {asset.type}<br />
                  Status: {asset.status}<br />
                  <button onClick={() => {
                    setSelectedAsset(asset);
                    setFormOpen(true);
                  }}>Edit</button>{" "}
                  <button onClick={async () => {
                    if (confirm('Delete this asset?')) {
                      await axios.delete(`/api/assets/${asset._id}`);
                      const res = await axios.get('/api/assets');
                      setAssets(res.data);
                      setFilteredAssets(res.data);
                    }
                  }}>Delete</button>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Form Modal */}
      {formOpen && (
        <AssetForm
          selectedAsset={selectedAsset}
          onClose={() => {
            setFormOpen(false);
            setSelectedAsset(null);
          }}
          onSuccess={() => {
            axios.get('/api/assets').then((res) => {
              setAssets(res.data);
              setFilteredAssets(res.data);
              setFormOpen(false);
              setSelectedAsset(null);
            });
          }}
        />
      )}
    </div>
  );
}
