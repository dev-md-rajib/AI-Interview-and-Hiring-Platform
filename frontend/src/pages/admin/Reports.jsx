import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiExclamation, HiFlag, HiCheck, HiX, HiTrash, HiBan } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for banning
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [reportToBan, setReportToBan] = useState(null);
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'reports') {
        const { data } = await api.get('/admin/reports');
        setReports(data.reports || []);
      } else if (activeTab === 'appeals') {
        const { data } = await api.get('/admin/appeals');
        setAppeals(data.appeals || []);
      } else if (activeTab === 'banned') {
        const { data } = await api.get('/admin/banned-users');
        setBannedUsers(data.users || []);
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const resolveReport = async (reportId, action, reason = null) => {
    try {
      await api.put(`/admin/reports/${reportId}`, { action, banReason: reason });
      toast.success('Report resolved');
      if (action === 'ban_user') {
        setBanModalOpen(false);
        setReportToBan(null);
        setBanReason('');
      }
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const resolveAppeal = async (userId, action) => {
    try {
      await api.put(`/admin/appeals/${userId}`, { action });
      toast.success(action === 'unban' ? 'User unbanned' : 'Appeal rejected');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const unbanDirect = async (userId) => {
    try {
      await api.put(`/admin/banned-users/${userId}/unban`);
      toast.success('User unbanned successfully');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unban failed');
    }
  };

  const openBanModal = (report) => {
    setReportToBan(report);
    setBanReason('');
    setBanModalOpen(true);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HiExclamation className="text-primary-500" /> Reports & Appeals
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage platform safety, reports, and suspended accounts.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-dark-border">
        <button
          className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'reports' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('reports')}
        >
          Pending Reports ({reports.length})
        </button>
        <button
          className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'appeals' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('appeals')}
        >
          Pending Appeals ({appeals.length})
        </button>
        <button
          className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'banned' ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('banned')}
        >
          Banned Users ({bannedUsers.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-32 items-center">
          <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : activeTab === 'reports' ? (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="card text-center py-12 text-gray-400 shadow-none border border-dashed border-dark-border">No pending reports.</div>
          ) : (
            reports.map((report) => (
              <div key={report._id} className="card bg-dark-800/50 border border-dark-border flex flex-col md:flex-row gap-4 justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${report.type === 'Job' ? 'badge-primary' : 'bg-purple-900/40 text-purple-300 border border-purple-500/20'}`}>
                      {report.type} Report
                    </span>
                    <span className="text-xs text-gray-500">
                      Reported by <span className="text-gray-300">{report.reporter?.name}</span> ({report.reporter?.role})
                    </span>
                  </div>
                  
                  {report.type === 'Job' && report.reportedJob && (
                    <div className="text-sm">
                      <span className="text-gray-400">Target Job: </span>
                      <span className="text-white font-medium">{report.reportedJob.title}</span>
                      <span className="ml-2 text-xs text-gray-500">({report.reportedJob.status})</span>
                    </div>
                  )}

                  {report.type === 'Candidate' && report.reportedUser && (
                    <div className="text-sm">
                      <span className="text-gray-400">Target Candidate: </span>
                      <span className="text-white font-medium">{report.reportedUser.name}</span>
                    </div>
                  )}

                  <div className="bg-dark-900 rounded p-3 text-sm text-gray-300 border border-dark-border mt-2">
                    <span className="block text-xs font-bold text-danger-400 uppercase mb-1">Reason:</span>
                    {report.reason}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0">
                  <button onClick={() => resolveReport(report._id, 'dismiss')} className="btn-secondary py-1.5 px-3 text-xs flex-1 flex items-center justify-center gap-1 hover:text-white">
                    <HiCheck /> Dismiss
                  </button>
                  {report.type === 'Job' && (
                    <button onClick={() => resolveReport(report._id, 'delete_job')} className="btn-secondary py-1.5 px-3 text-xs flex-1 flex items-center justify-center gap-1 text-danger-400 hover:text-danger-300 hover:border-danger-500/50">
                      <HiTrash /> Delete Post
                    </button>
                  )}
                  {((report.type === 'Job' && report.reportedJob) || report.reportedUser) && (
                    <button onClick={() => openBanModal(report)} className="py-1.5 px-3 rounded-lg text-xs font-medium bg-danger-500/10 text-danger-400 border border-danger-500/20 hover:bg-danger-500 hover:text-white transition-colors flex-1 flex items-center justify-center gap-1">
                      <HiBan /> Ban User
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'appeals' ? (
        <div className="space-y-4">
          {appeals.length === 0 ? (
            <div className="card text-center py-12 text-gray-400 shadow-none border border-dashed border-dark-border">No pending appeals.</div>
          ) : (
            appeals.map((user) => (
              <div key={user._id} className="card bg-dark-800/50 border border-red-900/20 flex flex-col md:flex-row gap-4 justify-between items-start">
                <div className="flex-1 space-y-2">
                   <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-lg">{user.name}</span>
                    <span className="badge-primary">{user.role}</span>
                    <span className="text-sm text-gray-400">{user.email}</span>
                  </div>

                  <div className="bg-danger-900/20 rounded p-3 text-sm text-danger-200 border border-danger-500/20 mt-2">
                    <span className="block text-xs font-bold text-danger-400 uppercase mb-1">Original Ban Reason:</span>
                    {user.banReason}
                  </div>

                  <div className="bg-dark-900 rounded p-3 text-sm text-gray-200 border border-dark-border mt-2">
                    <span className="block text-xs font-bold text-primary-400 uppercase mb-1">Appeal Message:</span>
                    {user.appealText}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0">
                  <button onClick={() => resolveAppeal(user._id, 'unban')} className="bg-success-600/20 text-success-400 hover:bg-success-600 hover:text-white border border-success-600/30 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors flex-1 flex items-center justify-center gap-1">
                    <HiCheck /> Unban User
                  </button>
                  <button onClick={() => resolveAppeal(user._id, 'reject')} className="btn-secondary py-1.5 px-3 text-xs flex-1 flex items-center justify-center gap-1 hover:text-white">
                    <HiX /> Reject Appeal
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'banned' ? (
        <div className="space-y-4">
          {bannedUsers.length === 0 ? (
            <div className="card text-center py-12 text-gray-400 shadow-none border border-dashed border-dark-border">No banned users.</div>
          ) : (
            bannedUsers.map((user) => (
              <div key={user._id} className="card bg-dark-800/50 border border-dark-border flex flex-col md:flex-row gap-4 justify-between items-start">
                <div className="flex-1 space-y-2">
                   <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-lg">{user.name}</span>
                    <span className="badge-primary">{user.role}</span>
                    <span className="text-sm text-gray-400">{user.email}</span>
                  </div>

                  <div className="bg-dark-900 rounded p-3 text-sm text-gray-300 border border-dark-border mt-2">
                    <span className="block text-xs font-bold text-danger-400 uppercase mb-1">Ban Reason:</span>
                    {user.banReason || 'No reason provided'}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0">
                  <button onClick={() => unbanDirect(user._id)} className="bg-success-600/20 text-success-400 hover:bg-success-600 hover:text-white border border-success-600/30 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors flex-1 flex items-center justify-center gap-1">
                    <HiCheck /> Unban
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}

      {/* Ban Modal */}
      {banModalOpen && reportToBan && (
        <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-dark-800 rounded-2xl border border-danger-500/20 max-w-md w-full p-6 space-y-4 shadow-xl shadow-danger-500/10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <HiBan className="text-danger-500" /> Ban User
            </h3>
            <p className="text-gray-400 text-sm">
              You are about to ban a user as a result of a {reportToBan.type} report. Please provide the reason for the ban. 
              The user will see this reason when attempting to log in.
            </p>
            <textarea
              className="input h-24 resize-none"
              placeholder="E.g., Violating community guidelines by posting inappropriate content."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setBanModalOpen(false)} className="btn-secondary px-4 py-2">Cancel</button>
              <button onClick={() => resolveReport(reportToBan._id, 'ban_user', banReason)} className="bg-danger-600 hover:bg-danger-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <HiBan /> Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
