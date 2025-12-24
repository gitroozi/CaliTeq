import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Redirects admin.caliteq.app root to /admin/login
 * Only redirects if on admin subdomain and at root path
 */
export default function AdminSubdomainRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we're on the admin subdomain
    const isAdminSubdomain = window.location.hostname === 'admin.caliteq.app';

    // Only redirect if at root path on admin subdomain
    if (isAdminSubdomain && location.pathname === '/') {
      navigate('/admin/login', { replace: true });
    }
  }, [location, navigate]);

  return null; // This component doesn't render anything
}
