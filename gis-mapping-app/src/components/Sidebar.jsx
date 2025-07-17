// Sidebar.jsx
import { downloadGeoJSON, downloadCSV } from './exportUtils'; // adjust path

export default function Sidebar({ assets, setFilteredAssets }) {
  const handleFilter = (type) => {
    if (type === 'All') {
      setFilteredAssets(assets);
    } else {
      setFilteredAssets(assets.filter(a => a.type === type));
    }
  };

  const total = assets.length;
  const faulty = assets.filter(a => a.status === 'Faulty').length;

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      zIndex: 1000,
      width: '220px'
    }}>
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
  );
}


