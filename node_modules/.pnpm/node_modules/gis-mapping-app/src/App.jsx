import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import './App.css';

import MapView from './components/MapView';
import AssetForm from './components/AssetForm';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthContext } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Protected main map view */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MapView />
              </ProtectedRoute>
            }
          />

          {/* Protected asset creation (optional route) */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <AssetForm />
              </ProtectedRoute>
            }
          />

          {/* Public authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
