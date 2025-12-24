import React, { useState, useEffect } from 'react';
import { adminAuthApi, getErrorMessage } from '../../services/adminApi';
import type { Admin } from '../../types/admin';
import { useIsSuperAdmin } from '../../store/adminAuthStore';

export default function AdminManagement() {
  const isSuperAdmin = useIsSuperAdmin();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Create admin modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminFirstName, setNewAdminFirstName] = useState('');
  const [newAdminLastName, setNewAdminLastName] = useState('');
  const [newAdminIsSuperAdmin, setNewAdminIsSuperAdmin] = useState(false);

  // Deactivate modal
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [deactivateReason, setDeactivateReason] = useState('');

  useEffect(() => {
    if (isSuperAdmin) {
      loadAdmins();
    }
  }, [isSuperAdmin]);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError(null);

      // Since there's no getAdmins endpoint, we'll just show the current admin
      // In a real implementation, you'd need to add a backend endpoint to list all admins
      const currentAdmin = await adminAuthApi.getMe();
      setAdmins([currentAdmin]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    try {
      setActionLoading(true);
      await adminAuthApi.createAdmin({
        email: newAdminEmail,
        password: newAdminPassword,
        firstName: newAdminFirstName,
        lastName: newAdminLastName,
        isSuperAdmin: newAdminIsSuperAdmin,
      });

      await loadAdmins();
      setShowCreateModal(false);
      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewAdminFirstName('');
      setNewAdminLastName('');
      setNewAdminIsSuperAdmin(false);
      alert('Admin created successfully!');
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivateAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      setActionLoading(true);
      await adminAuthApi.deactivateAdmin(
        selectedAdmin.id,
        deactivateReason || undefined
      );

      await loadAdmins();
      setShowDeactivateModal(false);
      setSelectedAdmin(null);
      setDeactivateReason('');
      alert('Admin deactivated successfully!');
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Access Denied: Super Admin privileges required
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600 mt-1">
            Manage admin accounts (Super Admin Only)
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium"
        >
          Create New Admin
        </button>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">Security Warning</h3>
            <p className="mt-1 text-sm">
              This page is restricted to Super Admins. All actions are logged
              and monitored. Only create admin accounts when absolutely
              necessary.
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Admins List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                      <span className="ml-3 text-gray-600">
                        Loading admins...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No admins found
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-600 font-medium">
                              {admin.firstName?.[0] || admin.email[0].toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {admin.firstName && admin.lastName
                              ? `${admin.firstName} ${admin.lastName}`
                              : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {admin.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{admin.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          admin.isSuperAdmin
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {admin.isSuperAdmin ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          admin.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.lastLoginAt
                        ? new Date(admin.lastLoginAt).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {admin.isActive && (
                        <button
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowDeactivateModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note about admin list */}
      <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
        <p className="text-sm">
          <strong>Note:</strong> Currently showing only your admin account. To
          view all admins, a backend endpoint for listing admins needs to be
          implemented.
        </p>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Admin</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={newAdminFirstName}
                  onChange={(e) => setNewAdminFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={newAdminLastName}
                  onChange={(e) => setNewAdminLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Doe"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="superAdmin"
                  checked={newAdminIsSuperAdmin}
                  onChange={(e) => setNewAdminIsSuperAdmin(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="superAdmin"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Grant Super Admin privileges
                </label>
              </div>

              {newAdminIsSuperAdmin && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-md text-sm">
                  Warning: Super Admins have full system access
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewAdminEmail('');
                  setNewAdminPassword('');
                  setNewAdminFirstName('');
                  setNewAdminLastName('');
                  setNewAdminIsSuperAdmin(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAdmin}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                disabled={
                  actionLoading ||
                  !newAdminEmail ||
                  !newAdminPassword ||
                  newAdminPassword.length < 8
                }
              >
                {actionLoading ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Deactivate Admin</h3>

            <p className="text-gray-600 mb-4">
              Are you sure you want to deactivate{' '}
              <strong>{selectedAdmin.email}</strong>? They will no longer be
              able to access the admin portal.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (optional)
              </label>
              <textarea
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Reason for deactivation"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeactivateModal(false);
                  setSelectedAdmin(null);
                  setDeactivateReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateAdmin}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
