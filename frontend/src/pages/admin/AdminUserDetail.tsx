import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  adminUsersApi,
  adminSubscriptionsApi,
  adminCreditsApi,
  adminAuditApi,
  getErrorMessage,
} from '../../services/adminApi';
import type {
  UserDetails,
  UserCredits,
  AuditLog,
  SubscriptionHistoryResponse,
  CreditTransactionsResponse,
} from '../../types/admin';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDetails | null>(null);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<
    SubscriptionHistoryResponse[]
  >([]);
  const [creditTransactions, setCreditTransactions] = useState<
    CreditTransactionsResponse['transactions']
  >([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [showGrantCreditsModal, setShowGrantCreditsModal] = useState(false);
  const [showRevokeCreditsModal, setShowRevokeCreditsModal] = useState(false);
  const [showChangeSubscriptionModal, setShowChangeSubscriptionModal] =
    useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Form states
  const [grantAmount, setGrantAmount] = useState('');
  const [grantReason, setGrantReason] = useState('');
  const [revokeAmount, setRevokeAmount] = useState('');
  const [revokeReason, setRevokeReason] = useState('');
  const [newTier, setNewTier] = useState('');
  const [subscriptionReason, setSubscriptionReason] = useState('');
  const [deactivateReason, setDeactivateReason] = useState('');

  useEffect(() => {
    if (id) {
      loadUserData();
    }
  }, [id]);

  const loadUserData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const [userData, creditsData, subHistory, creditTx, auditData] =
        await Promise.all([
          adminUsersApi.getUserDetails(id),
          adminCreditsApi.getUserCredits(id).catch(() => null),
          adminSubscriptionsApi
            .getUserSubscriptionHistory(id)
            .catch(() => []),
          adminCreditsApi
            .getTransactions(id, { limit: 10, offset: 0 })
            .catch(() => ({ transactions: [], total: 0 })),
          adminAuditApi
            .getUserLogs(id, { limit: 10, offset: 0 })
            .catch(() => ({ logs: [], total: 0 })),
        ]);

      setUser(userData);
      setCredits(creditsData);
      setSubscriptionHistory(subHistory);
      setCreditTransactions(creditTx.transactions);
      setAuditLogs(auditData.logs);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!user || !id) return;

    try {
      setActionLoading(true);
      await adminUsersApi.updateUserStatus(id, {
        isActive: !user.isActive,
        reason: deactivateReason || undefined,
      });
      await loadUserData();
      setShowDeactivateModal(false);
      setDeactivateReason('');
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleGrantCredits = async () => {
    if (!id) return;

    try {
      setActionLoading(true);
      await adminCreditsApi.grantCredits(id, {
        amount: parseInt(grantAmount),
        reason: grantReason,
      });
      await loadUserData();
      setShowGrantCreditsModal(false);
      setGrantAmount('');
      setGrantReason('');
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeCredits = async () => {
    if (!id) return;

    try {
      setActionLoading(true);
      await adminCreditsApi.revokeCredits(id, {
        amount: parseInt(revokeAmount),
        reason: revokeReason,
      });
      await loadUserData();
      setShowRevokeCreditsModal(false);
      setRevokeAmount('');
      setRevokeReason('');
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeSubscription = async () => {
    if (!id) return;

    try {
      setActionLoading(true);
      await adminSubscriptionsApi.changeUserSubscription(id, {
        tierName: newTier,
        reason: subscriptionReason,
      });
      await loadUserData();
      setShowChangeSubscriptionModal(false);
      setNewTier('');
      setSubscriptionReason('');
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-gray-600">Loading user details...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'User not found'}
          </div>
          <button
            onClick={() => navigate('/admin/users')}
            className="mt-4 text-emerald-600 hover:text-emerald-900"
          >
            ← Back to Users
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
      <div className="mb-6">
        <Link
          to="/admin/users"
          className="text-emerald-600 hover:text-emerald-900 mb-2 inline-block"
        >
          ← Back to Users
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email}
            </h1>
            <p className="text-gray-600 mt-1">User ID: {user.id}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeactivateModal(true)}
              className={`px-4 py-2 rounded-md font-medium ${
                user.isActive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {user.isActive ? 'Deactivate User' : 'Activate User'}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Profile Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-gray-900">{user.email}</p>
            {user.emailVerified && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                Verified
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <p className="mt-1 text-gray-900">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : 'Not provided'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <span
              className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subscription Tier
            </label>
            <span
              className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.subscription?.tier.name === 'pro'
                  ? 'bg-purple-100 text-purple-800'
                  : user.subscription?.tier.name === 'enterprise'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {user.subscription?.tier.displayName || 'Free'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Joined
            </label>
            <p className="mt-1 text-gray-900">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Active
            </label>
            <p className="mt-1 text-gray-900">
              {user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Never'}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Management */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Subscription</h2>
          <button
            onClick={() => setShowChangeSubscriptionModal(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Change Subscription
          </button>
        </div>

        {subscriptionHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tier
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Started
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ended
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptionHistory.map((sub, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {sub.tier.displayName}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          sub.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(sub.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {sub.endDate
                        ? new Date(sub.endDate).toLocaleDateString()
                        : 'Active'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No subscription history</p>
        )}
      </div>

      {/* Credits Management */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Credits: {credits?.balance ?? 0}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowGrantCreditsModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Grant Credits
            </button>
            <button
              onClick={() => setShowRevokeCreditsModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Revoke Credits
            </button>
          </div>
        </div>

        {creditTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {creditTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          tx.type === 'grant' || tx.type === 'purchase'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {tx.amount > 0 ? '+' : ''}
                      {tx.amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {tx.description || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No credit transactions</p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        {auditLogs.length > 0 ? (
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-md"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {log.action}
                  </p>
                  {log.changes && (
                    <p className="text-sm text-gray-500 mt-1">
                      {typeof log.changes === 'string'
                        ? log.changes
                        : JSON.stringify(log.changes)}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No recent activity</p>
        )}
      </div>

      {/* Grant Credits Modal */}
      {showGrantCreditsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Grant Credits</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={grantAmount}
                  onChange={(e) => setGrantAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Reason for granting credits"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowGrantCreditsModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleGrantCredits}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={actionLoading || !grantAmount}
              >
                {actionLoading ? 'Processing...' : 'Grant Credits'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Credits Modal */}
      {showRevokeCreditsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Revoke Credits</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={revokeAmount}
                  onChange={(e) => setRevokeAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Reason for revoking credits"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRevokeCreditsModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeCredits}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={actionLoading || !revokeAmount}
              >
                {actionLoading ? 'Processing...' : 'Revoke Credits'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Subscription Modal */}
      {showChangeSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Change Subscription</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Tier
                </label>
                <select
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select tier</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  value={subscriptionReason}
                  onChange={(e) => setSubscriptionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Reason for changing subscription"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowChangeSubscriptionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleChangeSubscription}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                disabled={actionLoading || !newTier}
              >
                {actionLoading ? 'Processing...' : 'Change Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate/Activate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {user.isActive ? 'Deactivate User' : 'Activate User'}
            </h3>
            <p className="text-gray-600 mb-4">
              {user.isActive
                ? 'Are you sure you want to deactivate this user? They will no longer be able to access the platform.'
                : 'Are you sure you want to activate this user? They will be able to access the platform again.'}
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
                placeholder="Reason for status change"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleToggleStatus}
                className={`flex-1 px-4 py-2 text-white rounded-md ${
                  user.isActive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                disabled={actionLoading}
              >
                {actionLoading
                  ? 'Processing...'
                  : user.isActive
                  ? 'Deactivate'
                  : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
}
