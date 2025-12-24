/**
 * Admin Protected Route
 * Component to protect admin routes from unauthorized access
 */

import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../../store/adminAuthStore';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

export default function AdminProtectedRoute({
  children,
  requireSuperAdmin = false,
}: AdminProtectedRouteProps) {
  const location = useLocation();
  const { admin, isAuthenticated, checkAuth } = useAdminAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated) {
        await checkAuth();
      }
      setIsChecking(false);
    };

    verifyAuth();
  }, [isAuthenticated, checkAuth]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to admin login
  if (!isAuthenticated || !admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authenticated but not super admin when super admin is required
  if (requireSuperAdmin && !admin.isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Super Admin Access Required
            </h2>
            <p className="mt-2 text-gray-600">
              You don't have permission to access this page. Please contact a super
              admin if you believe this is an error.
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated and authorized - render children
  return <>{children}</>;
}
