import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiXCircle, HiEye, HiSearch, HiBan, HiMail } from 'react-icons/hi';

export default function UserManager() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get(`/admin/users${roleFilter ? `?role=${roleFilter}` : ''}`)
      .then(({ data }) => setUsers(data.users || []))
      .finally(() => setLoading(false));
  }, [roleFilter]);

  const startConversation = async (userId) => {
    try {
      const { data: convData } = await api.post('/messages/conversation', { recipientId: userId });
      navigate('/admin/messages', { state: { conversationId: convData.conversation._id } });
    } catch {
      toast.error('Failed to open message');
    }
  };

  const toggleVerify = async (userId, current) => {
    try {
      await api.put(`/admin/users/${userId}/verify`, { verified: !current });
      setUsers((u) => u.map((user) => user._id === userId ? { ...user, isVerified: !current } : user));
      toast.success(`User ${!current ? 'verified' : 'unverified'}`);
    } catch { toast.error('Failed to update'); }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management ({filteredUsers.length})</h1>
          <p className="text-gray-400 text-xs mt-1">Search, inspect profiles, and manage system users.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              className="input pl-9 text-xs h-9"
              placeholder="Search by name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select className="input w-36 text-xs h-9" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="CANDIDATE">Candidates</option>
            <option value="RECRUITER">Recruiters</option>
            <option value="INTERVIEWER">Interviewers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-dark-800 text-gray-400 text-xs uppercase">
              <tr>
                {['User', 'Role', 'Status', 'Verified', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-400">No users found matching your search.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-dark-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-700/60 flex items-center justify-center text-white font-bold flex-shrink-0 text-xs overflow-hidden">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            user.name?.[0]?.toUpperCase()
                          )}
                        </div>
                        <div>
                          <Link
                            to={`/admin/candidates/${user._id}`}
                            className="text-white font-semibold hover:text-primary-400 transition-colors block"
                            title="Visit Profile"
                          >
                            {user.name}
                          </Link>
                          <span className="text-gray-400 text-xs">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        user.role === 'ADMIN'
                          ? 'bg-yellow-900/60 text-yellow-300 border border-yellow-500/30'
                          : user.role === 'RECRUITER'
                          ? 'bg-blue-900/60 text-blue-300 border border-blue-500/30'
                          : user.role === 'INTERVIEWER'
                          ? 'bg-purple-900/60 text-purple-300 border border-purple-500/30'
                          : 'badge-primary'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.isBanned ? (
                        <span className="badge bg-danger-900/50 text-danger-400 border border-danger-500/30 flex items-center gap-1 w-fit">
                          <HiBan className="w-3 h-3" /> Banned
                        </span>
                      ) : (
                        <span className="badge-success text-xs">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.isVerified ? (
                        <HiCheckCircle className="w-5 h-5 text-accent-400" title="Verified" />
                      ) : (
                        <HiXCircle className="w-5 h-5 text-gray-500" title="Unverified" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/candidates/${user._id}`}
                          className="btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1.5 hover:text-primary-400"
                        >
                          <HiEye className="w-3.5 h-3.5" /> View Profile
                        </Link>
                        <button
                          onClick={() => startConversation(user._id)}
                          className="btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1.5 hover:text-primary-400"
                          title="Message User"
                        >
                          <HiMail className="w-3.5 h-3.5" /> Message
                        </button>
                        {['RECRUITER', 'INTERVIEWER'].includes(user.role) && (
                          <button
                            onClick={() => toggleVerify(user._id, user.isVerified)}
                            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors font-medium flex items-center gap-1 ${
                              user.isVerified
                                ? 'border-danger-500/50 text-danger-400 hover:bg-danger-900/30'
                                : 'border-accent-500/50 text-accent-400 hover:bg-emerald-900/30'
                            }`}
                            title={user.isVerified ? 'Revoke verification' : 'Grant verification'}
                          >
                            {user.isVerified ? 'Unverify' : 'Verify'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
