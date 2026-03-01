import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { HiMail, HiFlag, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function CandidateView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    api.get(`/profile/${id}`).then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, [id]);

  const startConversation = async () => {
    try {
      const { data: convData } = await api.post('/messages/conversation', { recipientId: id });
      navigate('/recruiter/messages', { state: { conversationId: convData.conversation._id } });
    } catch { toast.error('Failed to open message'); }
  };

  const submitReport = async () => {
    if (!reportReason.trim()) return toast.error('Please enter a reason');
    try {
      await api.post('/reports/candidate', { candidateId: id, reason: reportReason });
      toast.success('Candidate reported successfully');
      setIsReporting(false);
      setReportReason('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to report candidate');
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;
  if (!data) return <div className="text-center py-16 text-gray-400">Profile not found</div>;

  const { profile, interviewHistory, levelVerdicts } = data;

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
          <div className="flex items-center gap-3">
            <button onClick={() => setIsReporting(true)} className="btn-secondary text-danger-400 hover:text-danger-300 hover:border-danger-500/50 flex items-center gap-2"><HiFlag /> Report</button>
            <button onClick={startConversation} className="btn-primary flex items-center gap-2"><HiMail /> Message</button>
          </div>
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

      {/* Level Achievements */}
      {levelVerdicts?.length > 0 && (
        <div className="card">
          <h2 className="section-title">Highest Level Verdicts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {levelVerdicts.map((lv) => (
              <div key={`lv-${lv.level}`} className="p-4 rounded-xl bg-dark-800/50 border border-primary-500/20 hover:border-primary-500/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-lg font-bold text-white text-gradient">L{lv.level} Passed</span>
                  <span className="text-2xl font-black text-primary-400">{lv.totalScore}%</span>
                </div>
                <div className="text-sm text-gray-400 mb-2">Stack: <span className="text-white">{lv.stack}</span></div>
                <div className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-dark-700 text-gray-300 border border-dark-600">
                  Evaluated by: {lv.evaluator}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {interviewHistory?.length > 0 && (
        <div className="card">
          <h2 className="section-title">Interview Results</h2>
          <table className="w-full text-sm">
            <thead className="text-gray-400 uppercase text-xs border-b border-dark-border">
              <tr>{['Stack', 'Level', 'Evaluator', 'Score', 'Result', 'Date'].map((h) => <th key={h} className="text-left pb-2 pr-4">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {interviewHistory.map((iv) => (
                <tr key={iv._id}>
                  <td className="py-2 pr-4 text-white">{iv.stack}</td>
                  <td className="py-2 pr-4 text-gray-400">L{iv.level}</td>
                  <td className="py-2 pr-4 text-gray-400">{iv.evaluator}</td>
                  <td className="py-2 pr-4 font-bold text-primary-400">{iv.totalScore}%</td>
                  <td className="py-2 pr-4">{iv.passed ? <span className="badge-success">Passed</span> : <span className="badge-danger">Failed</span>}</td>
                  <td className="py-2 text-gray-400">{new Date(iv.completedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isReporting && (
        <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-dark-800 rounded-2xl border border-dark-border max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><HiFlag className="text-danger-500" /> Report Candidate</h3>
              <button onClick={() => setIsReporting(false)} className="text-gray-400 hover:text-white"><HiX className="w-6 h-6" /></button>
            </div>
            <p className="text-gray-400 text-sm">Please provide a valid reason for reporting this candidate. False flags will be penalized.</p>
            <textarea
              className="input h-32 resize-none"
              placeholder="Why are you reporting this user?"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setIsReporting(false)} className="btn-secondary px-4 py-2">Cancel</button>
              <button onClick={submitReport} className="bg-danger-600 hover:bg-danger-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
