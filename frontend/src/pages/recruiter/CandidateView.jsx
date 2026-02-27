import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { HiMail, HiExternalLink } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function CandidateView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/profile/${id}`).then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, [id]);

  const startConversation = async () => {
    try {
      const { data: convData } = await api.post('/messages/conversation', { recipientId: id });
      navigate('/recruiter/messages', { state: { conversationId: convData.conversation._id } });
    } catch { toast.error('Failed to open message'); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;
  if (!data) return <div className="text-center py-16 text-gray-400">Profile not found</div>;

  const { profile, interviewHistory } = data;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-700 flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
              {profile?.user?.profileImage ? <img src={profile.user.profileImage} alt="" className="w-full h-full object-cover" /> : profile?.user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profile?.user?.name}</h1>
              <p className="text-gray-400 text-sm">{profile?.user?.email}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="badge-primary">Level {profile?.currentLevel || 0}</span>
                <span className={`badge ${profile?.availability === 'Available' ? 'badge-success' : 'badge-gray'}`}>{profile?.availability}</span>
                <span className="badge bg-yellow-900 text-yellow-300">Score: {profile?.overallScore}%</span>
              </div>
            </div>
          </div>
          <button onClick={startConversation} className="btn-primary flex items-center gap-2"><HiMail /> Message</button>
        </div>
        {profile?.bio && <p className="text-gray-300 mt-4 border-t border-dark-border pt-4">{profile.bio}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="section-title">Professional Info</h2>
          <p className="text-gray-400 text-sm mb-2">Experience: <span className="text-white">{profile?.yearsOfExperience} years</span></p>
          <div className="flex flex-wrap gap-1">{profile?.expertise?.map((e) => <span key={e} className="badge-primary">{e}</span>)}</div>
        </div>
        {profile?.skills?.length > 0 && (
          <div className="card">
            <h2 className="section-title">Top Skills</h2>
            <div className="space-y-2">
              {profile.skills.slice(0, 5).map((s) => (
                <div key={s.name} className="flex justify-between text-sm">
                  <span className="text-gray-300">{s.name}</span>
                  <span className="text-primary-400 font-medium">{s.score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {interviewHistory?.length > 0 && (
        <div className="card">
          <h2 className="section-title">Interview Results</h2>
          <table className="w-full text-sm">
            <thead className="text-gray-400 uppercase text-xs border-b border-dark-border">
              <tr>{['Stack', 'Level', 'Score', 'Result', 'Date'].map((h) => <th key={h} className="text-left pb-2 pr-4">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {interviewHistory.map((iv) => (
                <tr key={iv._id}>
                  <td className="py-2 pr-4 text-white">{iv.stack}</td>
                  <td className="py-2 pr-4 text-gray-400">L{iv.level}</td>
                  <td className="py-2 pr-4 font-bold text-primary-400">{iv.totalScore}%</td>
                  <td className="py-2 pr-4">{iv.passed ? <span className="badge-success">Passed</span> : <span className="badge-danger">Failed</span>}</td>
                  <td className="py-2 text-gray-400">{new Date(iv.completedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
