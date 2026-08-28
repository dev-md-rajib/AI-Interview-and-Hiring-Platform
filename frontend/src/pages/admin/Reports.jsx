import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  HiExclamation, HiFlag, HiCheck, HiX, HiTrash, HiBan,
  HiEye, HiBriefcase, HiUser, HiLocationMarker, HiCurrencyDollar,
  HiChevronDown, HiChevronUp, HiExternalLink, HiMail
} from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';

export default function Reports() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for banning
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [reportToBan, setReportToBan] = useState(null);
  const [banReason, setBanReason] = useState('');

  // Expanded job details map (reportId -> boolean)
  const [expandedJobs, setExpandedJobs] = useState({});

  const toggleExpandJob = (id) => {
    setExpandedJobs(prev => ({ ...prev, [id]: !prev[id] }));
  };

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

  const startConversation = async (userId) => {
    try {
      const { data: convData } = await api.post('/messages/conversation', { recipientId: userId });
      navigate('/admin/messages', { state: { conversationId: convData.conversation._id } });
    } catch {
      toast.error('Failed to open message');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <HiExclamation className="text-primary-600 dark:text-primary-400" /> Reports & Appeals
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage platform safety, review reported posts and user profiles, and resolve appeals.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-dark-border">
        <button
          className={`pb-3 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'reports' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
          onClick={() => setActiveTab('reports')}
        >
          Pending Reports ({reports.length})
        </button>
        <button
          className={`pb-3 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'appeals' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
          onClick={() => setActiveTab('appeals')}
        >
          Pending Appeals ({appeals.length})
        </button>
        <button
          className={`pb-3 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'banned' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
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
            reports.map((report) => {
              const isJob = report.type === 'Job';
              const job = report.reportedJob;
              const user = report.reportedUser;
              const recruiter = job?.recruiter;
              const isExpanded = !!expandedJobs[report._id];

              return (
                <div key={report._id} className="card border border-dark-border space-y-4">
                  {/* Header: Report Type, Reporter Info, and Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-dark-border pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`badge ${isJob ? 'badge-primary' : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/20'}`}>
                        {report.type} Report
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Reported by <span className="text-gray-900 dark:text-gray-200 font-medium">{report.reporter?.name || 'Anonymous'}</span> ({report.reporter?.role || 'User'})
                      </span>
                      <span className="text-xs text-gray-500">
                        • {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => resolveReport(report._id, 'dismiss')}
                        className="btn-secondary py-1.5 px-3 text-xs flex items-center justify-center gap-1 hover:text-gray-900 dark:hover:text-white flex-1 sm:flex-initial"
                      >
                        <HiCheck /> Dismiss
                      </button>
                      {isJob && (
                        <button
                          onClick={() => resolveReport(report._id, 'delete_job')}
                          className="btn-secondary py-1.5 px-3 text-xs flex items-center justify-center gap-1 text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 hover:border-danger-500/50 flex-1 sm:flex-initial"
                        >
                          <HiTrash /> Delete Post
                        </button>
                      )}
                      {(user || recruiter) && (
                        <button
                          onClick={() => openBanModal(report)}
                          className="py-1.5 px-3 rounded-lg text-xs font-medium bg-danger-50 dark:bg-danger-500/10 text-danger-600 dark:text-danger-400 border border-danger-200 dark:border-danger-500/20 hover:bg-danger-500 hover:text-white transition-colors flex items-center justify-center gap-1 flex-1 sm:flex-initial"
                        >
                          <HiBan /> Ban {isJob ? 'Poster' : 'User'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Target Reported Item Showcase */}
                  {isJob && (
                    <div className="bg-dark-800/60 rounded-xl p-4 border border-dark-border/80 space-y-3">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <HiBriefcase className="w-5 h-5 text-primary-400 flex-shrink-0" />
                            <h3 className="text-white font-bold text-base">{job ? job.title : 'Deleted / Unavailable Job'}</h3>
                            {job?.status && (
                              <span className={`badge text-[10px] ${job.status === 'Open' ? 'badge-success' : 'badge-danger'}`}>
                                {job.status}
                              </span>
                            )}
                            {job?.sector && (
                              <span className="badge-primary text-[10px]">{job.sector}</span>
                            )}
                          </div>

                          {recruiter && (
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                Posted by:
                                <Link
                                  to={`/admin/candidates/${recruiter._id}`}
                                  className="text-primary-400 font-medium hover:underline flex items-center gap-1 ml-1"
                                >
                                  {recruiter.name} ({recruiter.email})
                                  <HiExternalLink className="w-3 h-3" />
                                </Link>
                              </span>
                              <button
                                onClick={() => startConversation(recruiter._id)}
                                className="text-gray-300 hover:text-primary-400 flex items-center gap-1 font-medium bg-dark-900 px-2 py-0.5 rounded border border-dark-border"
                              >
                                <HiMail className="w-3.5 h-3.5 text-primary-400" /> Message Poster
                              </button>
                            </div>
                          )}
                        </div>

                        {job && (
                          <button
                            type="button"
                            onClick={() => toggleExpandJob(report._id)}
                            className="btn-secondary text-xs px-2.5 py-1 flex items-center gap-1 text-gray-300 hover:text-white"
                          >
                            {isExpanded ? <><HiChevronUp /> Hide Post Details</> : <><HiChevronDown /> View Full Post</>}
                          </button>
                        )}
                      </div>

                      {job && (
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
                          <span className="flex items-center gap-1"><HiLocationMarker className="text-gray-500" />{job.isRemote ? 'Remote' : (job.location || 'On-site')}</span>
                          {job.salaryMin && <span className="flex items-center gap-1"><HiCurrencyDollar className="text-gray-500" />{job.salaryMin}–{job.salaryMax}k</span>}
                          <span>Exp: {job.experienceRequired}+ yrs</span>
                          <span>Created: {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}

                      {job?.requirements && job.requirements.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-gray-400 self-center mr-1">Requirements:</span>
                          {job.requirements.map((r, i) => (
                            <span key={i} className="badge bg-dark-900 border border-dark-border text-xs text-gray-300">
                              {r.stack} L{r.level} ({r.method || 'Both'}) {r.minScore}%+
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Expandable full post description */}
                      {isExpanded && job && (
                        <div className="pt-3 mt-2 border-t border-dark-border text-xs text-gray-300 whitespace-pre-line leading-relaxed bg-dark-900/60 p-3 rounded-lg">
                          <span className="block font-bold text-gray-400 uppercase tracking-wider mb-1 text-[10px]">Job Description:</span>
                          {job.description}
                        </div>
                      )}
                    </div>
                  )}

                  {!isJob && (
                    <div className="bg-dark-800/60 rounded-xl p-4 border border-dark-border/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary-700/60 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                          {user?.profileImage ? (
                            <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            user?.name?.[0]?.toUpperCase() || <HiUser />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-bold text-base">{user?.name || 'Unknown Candidate'}</h3>
                            <span className="badge-primary text-[10px]">{user?.role || 'CANDIDATE'}</span>
                            {user?.isBanned && <span className="badge bg-danger-900/60 text-danger-400 text-[10px]">Banned</span>}
                          </div>
                          <p className="text-gray-400 text-xs mt-0.5">{user?.email}</p>
                          <p className="text-gray-500 text-[10px]">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>

                      {user && (
                        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-center">
                          <button
                            onClick={() => startConversation(user._id)}
                            className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 shadow-sm"
                          >
                            <HiMail className="w-4 h-4 text-primary-400" /> Message
                          </button>
                          <Link
                            to={`/admin/candidates/${user._id}`}
                            className="btn-primary text-xs px-3 py-2 flex items-center gap-1.5 shadow-md"
                          >
                            <HiEye className="w-4 h-4" /> Inspect Profile
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Report Reason */}
                  <div className="bg-slate-100 dark:bg-dark-900 rounded-xl p-3.5 text-sm text-gray-800 dark:text-gray-200 border border-dark-border">
                    <span className="block text-xs font-bold text-danger-600 dark:text-danger-400 uppercase tracking-wider mb-1">Reported Reason:</span>
                    <p className="leading-relaxed">{report.reason}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : activeTab === 'appeals' ? (
        <div className="space-y-4">
          {appeals.length === 0 ? (
            <div className="card text-center py-12 text-gray-400 shadow-none border border-dashed border-dark-border">No pending appeals.</div>
          ) : (
            appeals.map((user) => (
              <div key={user._id} className="card border border-dark-border space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-dark-border pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-700/60 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user.name?.[0]?.toUpperCase() || <HiUser />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-base">{user.name}</span>
                        <span className="badge-primary text-xs">{user.role}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => startConversation(user._id)}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center justify-center gap-1 text-gray-300 hover:text-white flex-1 sm:flex-initial"
                    >
                      <HiMail className="w-3.5 h-3.5 text-primary-400" /> Message
                    </button>
                    <Link
                      to={`/admin/candidates/${user._id}`}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center justify-center gap-1 text-gray-300 hover:text-white flex-1 sm:flex-initial"
                    >
                      <HiEye className="w-3.5 h-3.5" /> View Profile
                    </Link>
                    <button
                      onClick={() => resolveAppeal(user._id, 'unban')}
                      className="bg-success-50 dark:bg-success-600/20 text-success-600 dark:text-success-400 hover:bg-success-600 hover:text-white border border-success-200 dark:border-success-600/30 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 flex-1 sm:flex-initial"
                    >
                      <HiCheck /> Unban User
                    </button>
                    <button
                      onClick={() => resolveAppeal(user._id, 'reject')}
                      className="btn-secondary py-1.5 px-3 text-xs flex items-center justify-center gap-1 hover:text-gray-900 dark:hover:text-white flex-1 sm:flex-initial"
                    >
                      <HiX /> Reject Appeal
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-danger-50 dark:bg-danger-900/20 rounded-xl p-3 text-sm text-danger-800 dark:text-danger-200 border border-danger-200 dark:border-danger-500/20">
                    <span className="block text-xs font-bold text-danger-600 dark:text-danger-400 uppercase mb-1">Original Ban Reason:</span>
                    <p className="text-xs leading-relaxed">{user.banReason || 'No reason specified.'}</p>
                  </div>

                  <div className="bg-slate-100 dark:bg-dark-900 rounded-xl p-3 text-sm text-gray-800 dark:text-gray-200 border border-dark-border">
                    <span className="block text-xs font-bold text-primary-600 dark:text-primary-400 uppercase mb-1">Appeal Message:</span>
                    <p className="text-xs leading-relaxed">{user.appealText || 'No statement provided.'}</p>
                  </div>
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
              <div key={user._id} className="card border border-dark-border flex flex-col md:flex-row gap-4 justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-primary-700/60 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 overflow-hidden">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user.name?.[0]?.toUpperCase() || <HiUser />
                      )}
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white text-base">{user.name}</span>
                    <span className="badge-primary text-xs">{user.role}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
                  </div>

                  <div className="bg-slate-100 dark:bg-dark-900 rounded-xl p-3 text-sm text-gray-800 dark:text-gray-300 border border-dark-border mt-2">
                    <span className="block text-xs font-bold text-danger-600 dark:text-danger-400 uppercase mb-1">Ban Reason:</span>
                    <p className="text-xs">{user.banReason || 'No reason provided'}</p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0">
                  <button
                    onClick={() => startConversation(user._id)}
                    className="btn-secondary py-1.5 px-3 text-xs flex items-center justify-center gap-1 text-gray-300 hover:text-white"
                  >
                    <HiMail className="w-3.5 h-3.5 text-primary-400" /> Message
                  </button>
                  <Link
                    to={`/admin/candidates/${user._id}`}
                    className="btn-secondary py-1.5 px-3 text-xs flex items-center justify-center gap-1 text-gray-300 hover:text-white"
                  >
                    <HiEye className="w-3.5 h-3.5" /> View Profile
                  </Link>
                  <button
                    onClick={() => unbanDirect(user._id)}
                    className="bg-success-50 dark:bg-success-600/20 text-success-600 dark:text-success-400 hover:bg-success-600 hover:text-white border border-success-200 dark:border-success-600/30 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                  >
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
        <div className="fixed inset-0 bg-black/60 dark:bg-dark-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-dark-card rounded-2xl border border-danger-500/30 max-w-md w-full p-6 space-y-4 shadow-xl shadow-danger-500/10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HiBan className="text-danger-600 dark:text-danger-500" /> Ban User
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
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
