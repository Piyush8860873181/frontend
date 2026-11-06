import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Layers, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { adminService, productService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [activeTab, setActiveTab] = useState('metrics'); // metrics, users, reports
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [metricsRes, usersRes, reportsRes] = await Promise.all([
        adminService.getMetrics(),
        adminService.getUsers({ search: userSearch }),
        adminService.getReports(),
      ]);

      if (metricsRes.data?.success) setMetrics(metricsRes.data.data);
      if (usersRes.data?.success) setUsersList(usersRes.data.data);
      if (reportsRes.data?.success) setReportsList(reportsRes.data.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [userSearch]);

  const handleToggleSuspend = async (userId) => {
    try {
      const res = await adminService.toggleSuspension(userId);
      if (res.data?.success) {
        setUsersList(prev => prev.map(u => (u._id === userId ? { ...u, isSuspended: !u.isSuspended } : u)));
      }
    } catch (err) {
      alert('Failed to update suspension status.');
    }
  };

  const handleUpdateReport = async (reportId, status, productIdToDelete = null) => {
    try {
      if (productIdToDelete) {
        await productService.deleteProduct(productIdToDelete);
      }
      await adminService.updateReport(reportId, status);
      setReportsList(prev => prev.map(r => r._id === reportId ? { ...r, status } : r));
      alert(`Report marked as ${status}${productIdToDelete ? ' and listing was removed.' : '.'}`);
    } catch (err) {
      alert('Failed to update report.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Admin Privileges Required</h2>
        <p className="text-xs text-slate-500">
          This portal is strictly reserved for campus administration and appointed moderators.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Campus Administration & Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Moderator Control Center
          </h1>
          <p className="text-xs text-slate-400">
            Monitor student registrations, audit marketplace listings, and investigate community reports.
          </p>
        </div>

        <div className="flex gap-2">
          {['metrics', 'users', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab === 'reports' ? `Reports (${reportsList.filter(r => r.status === 'pending').length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* METRICS VIEW */}
      {activeTab === 'metrics' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-3xl font-extrabold text-slate-900">{metrics.totalUsers}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Total Students</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">{metrics.verifiedUsers} Verified</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-3xl font-extrabold text-brand-700">{metrics.totalProducts}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Total Items Listed</p>
              <p className="text-[10px] text-slate-400 mt-1">{metrics.activeProducts} Active Now</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-3xl font-extrabold text-emerald-600">{metrics.soldProducts}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Completed Sales</p>
              <p className="text-[10px] text-emerald-600 mt-1">Circulated & Reused</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-3xl font-extrabold text-rose-500">{metrics.pendingReports}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Pending Reports</p>
              <p className="text-[10px] text-rose-500 mt-1">Requires Investigation</p>
            </div>
          </div>
        </div>
      )}

      {/* USERS VIEW */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
            <h3 className="font-bold text-sm text-slate-900">Registered Students</h3>
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by student name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border rounded-xl"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] text-slate-500 font-bold">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">College & Department</th>
                  <th className="p-4">Year</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.fullName}`}
                          alt={u.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{u.fullName}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-700">{u.collegeName}</p>
                      <p className="text-[10px] text-slate-400">{u.branch || u.course}</p>
                    </td>
                    <td className="p-4">{u.academicYear}</td>
                    <td className="p-4 font-bold uppercase text-[10px]">{u.role}</td>
                    <td className="p-4">
                      {u.isSuspended ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">Suspended</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Active</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleSuspend(u._id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            u.isSuspended
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          {u.isSuspended ? 'Reactivate' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORTS VIEW */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900">Safety & Moderation Queue</h3>

          {reportsList.length > 0 ? (
            <div className="space-y-3">
              {reportsList.map((r) => {
                const prod = r.product;
                const reporter = r.reportedBy;
                return (
                  <div key={r._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                          {r.reason}
                        </span>
                        <span className="text-xs text-slate-500">
                          Reported by: <span className="font-semibold text-slate-700">{reporter?.fullName || 'Student'}</span> ({reporter?.collegeName || 'Campus'})
                        </span>
                      </div>

                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        r.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.status}
                      </span>
                    </div>

                    {prod && (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/60">
                        <img
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
                          alt={prod.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-slate-800">{prod.title}</p>
                          <p className="text-slate-500">Price: ₹{prod.sellingPrice}</p>
                        </div>
                      </div>
                    )}

                    {r.details && (
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border italic">
                        "{r.details}"
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      {prod && (
                        <button
                          onClick={() => handleUpdateReport(r._id, 'resolved', prod._id || prod.id)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                        >
                          Delete Flagged Listing & Resolve
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateReport(r._id, 'dismissed')}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-12">
              No reported listings or safety alerts at this time.
            </p>
          )}
        </div>
      )}

    </div>
  );
}
