import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Redirects admin users away from customer views into the admin dashboard (/admin/reports).
 */
export default function CustomerGuard() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user?.role === 'ADMIN') {
    return <Navigate to="/admin/reports" replace />;
  }

  return <Outlet />;
}
