import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HiPencil, HiExternalLink, HiPlus, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';

const SkillBar = ({ name, score, level }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-gray-300">{name}</span>
      <span className="text-primary-400 font-medium">{score}% · {level}</span>
    </div>
    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-primary-600 to-accent-500 rounded-full transition-all duration-500"
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

export default function CandidateProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/profile/me');
        setProfile(data.profile);
        setHistory(data.interviewHistory || []);
      } catch { toast.error('Failed to load profile'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const deletePortfolioItem = async (id) => {
    try {
      await api.delete(`/profile/portfolio/${id}`);
      setProfile((p) => ({ ...p, portfolioTimeline: p.portfolioTimeline.filter((item) => item._id !== id) }));
      toast.success('Portfolio item removed');
    } catch { toast.error('Failed to remove item'); }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary-700 flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
              {user?.profileImage ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-gray-400">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="badge-primary">Level {profile?.currentLevel || 0}</span>
                <span className={`badge ${profile?.availability === 'Available' ? 'badge-success' : 'badge-gray'}`}>{profile?.availability || 'Not Set'}</span>
                <span className="badge bg-yellow-900 text-yellow-300">Score: {profile?.overallScore || 0}%</span>
              </div>
            </div>
          </div>
          <Link to="/candidate/profile/edit" className="btn-secondary flex items-center gap-2"><HiPencil /> Edit Profile</Link>
        </div>

        {profile?.bio && <p className="text-gray-300 mt-4 border-t border-dark-border pt-4">{profile.bio}</p>}

        <div className="flex gap-4 mt-4 flex-wrap">
          {profile?.linkedIn && <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">LinkedIn <HiExternalLink /></a>}
          {profile?.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">GitHub <HiExternalLink /></a>}
          {profile?.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">Website <HiExternalLink /></a>}
        </div>
      </div>

      {/* Professional info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="section-title">Professional Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Experience</span><span className="text-white font-medium">{profile?.yearsOfExperience || 0} years</span></div>
            <div>
              <span className="text-gray-400 block mb-2">Expertise</span>
              <div className="flex flex-wrap gap-2">
                {profile?.expertise?.length > 0 ? profile.expertise.map((e) => <span key={e} className="badge-primary">{e}</span>) : <span className="text-gray-500">None added yet</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Education</h2>
          {profile?.education?.length > 0 ? (
            <div className="space-y-3">
              {profile.education.map((e, i) => (
                <div key={i} className="border-l-2 border-primary-500 pl-3">
                  <p className="text-white font-medium">{e.degree}</p>
                  <p className="text-gray-400 text-sm">{e.institution} · {e.year}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm">No education added</p>}
        </div>
      </div>

      {/* Skills */}
      {profile?.skills?.length > 0 && (
        <div className="card">
          <h2 className="section-title">Skills Matrix</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.skills.map((s, i) => <SkillBar key={i} {...s} />)}
          </div>
        </div>
      )}

      {/* Interview History */}
      {history.length > 0 && (
        <div className="card">
          <h2 className="section-title">Interview History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 uppercase text-xs border-b border-dark-border">
                <tr>{['Stack', 'Level', 'Score', 'Result', 'Date'].map((h) => <th key={h} className="text-left pb-2 pr-4">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {history.map((iv) => (
                  <tr key={iv._id} className="hover:bg-dark-800/30">
                    <td className="py-3 pr-4 text-white">{iv.stack}</td>
                    <td className="py-3 pr-4 text-gray-400">L{iv.level}</td>
                    <td className="py-3 pr-4 font-bold text-primary-400">{iv.totalScore}%</td>
                    <td className="py-3 pr-4">{iv.passed ? <span className="badge-success">Passed</span> : <span className="badge-danger">Failed</span>}</td>
                    <td className="py-3 text-gray-400">{iv.completedAt ? new Date(iv.completedAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Portfolio */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">Portfolio</h2>
          <Link to="/candidate/profile/edit" className="btn-secondary text-sm flex items-center gap-1"><HiPlus /> Add Item</Link>
        </div>
        {profile?.portfolioTimeline?.length > 0 ? (
          <div className="space-y-4">
            {profile.portfolioTimeline.map((item) => (
              <div key={item._id} className="border border-dark-border rounded-lg p-4 hover:border-primary-500/30 transition-colors group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                    {item.mediaUrl && (
                      <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 text-xs mt-2 flex items-center gap-1">
                        View {item.mediaType} <HiExternalLink />
                      </a>
                    )}
                    <p className="text-gray-500 text-xs mt-2">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => deletePortfolioItem(item._id)} className="opacity-0 group-hover:opacity-100 text-danger-400 hover:text-danger-300 transition-all">
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-500 text-sm">No portfolio items yet. Add your projects!</p>}
      </div>
    </div>
  );
}
