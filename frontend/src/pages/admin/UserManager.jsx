import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    api.get(`/admin/users${roleFilter ? `?role=${roleFilter}` : ''}`).then(({ data }) => setUsers(data.users || [])).finally(() => setLoading(false));
  }, [roleFilter]);

  const toggleVerify = async (userId, current) => {
    try {
      await api.put(`/admin/users/${userId}/verify`, { verified: !current });
      setUsers((u) => u.map((user) => user._id === userId ? { ...user, isVerified: !current } : user));
      toast.success(`User ${!current ? 'verified' : 'unverified'}`);
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">User Management ({users.length})</h1>
        <select className="input w-36" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="CANDIDATE">Candidates</option>
          <option value="RECRUITER">Recruiters</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {loading ? <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
        : (
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-dark-800 text-gray-400 text-xs uppercase">
                <tr>{['Name', 'Email', 'Role', 'Verified', 'Joined', 'Actions'].map((h) => <th key={h} className="text-left px-4 py-3">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-dark-800/50">
                    <td className="px-4 py-3 text-white font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-gray-400">{user.email}</td>
                    <td className="px-4 py-3"><span className={`badge ${user.role === 'ADMIN' ? 'bg-yellow-900 text-yellow-300' : user.role === 'RECRUITER' ? 'bg-blue-900 text-blue-300' : 'badge-primary'}`}>{user.role}</span></td>
                    <td className="px-4 py-3">{user.isVerified ? <HiCheckCircle className="w-5 h-5 text-accent-400" /> : <HiXCircle className="w-5 h-5 text-gray-500" />}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {user.role === 'RECRUITER' && (
                        <button onClick={() => toggleVerify(user._id, user.isVerified)} className={`text-xs px-2 py-1 rounded-lg border transition-colors ${user.isVerified ? 'border-danger-500 text-danger-400 hover:bg-danger-900/30' : 'border-accent-500 text-accent-400 hover:bg-emerald-900/30'}`}>
                          {user.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
