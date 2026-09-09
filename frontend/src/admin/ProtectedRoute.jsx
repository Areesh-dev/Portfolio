import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { adminApi } from '../lib/api.js';
import Loader from '../components/Loader.jsx';

// Client-side check is UX only. The real gate is the backend re-verifying
// the token's email against ADMIN_EMAIL on every request — if that ever
// disagrees with the client's session (e.g. a stale/foreign session), sign
// out here too instead of showing a broken dashboard.
export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      setChecking(false);
      return;
    }
    adminApi
      .me()
      .then(() => setAuthorized(true))
      .catch(() => setAuthorized(false))
      .finally(() => setChecking(false));
  }, [session, loading]);

  if (loading || checking) return <Loader label="Checking session…" className="min-h-screen" />;
  if (!session || !authorized) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}
