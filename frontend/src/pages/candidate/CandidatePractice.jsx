import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiCode, HiCheckCircle, HiArrowRight, HiClock, HiUsers, HiPlus, HiX } from 'react-icons/hi';

export default function CandidatePractice() {
  const [problems, setProblems] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ numProblems: 2, timeLimit: 30, invitedEmails: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [probRes, roomRes] = await Promise.all([
        api.get('/practice'),
        api.get('/multiplayer')
      ]);
      setProblems(probRes.data.data || []);
      setRooms(roomRes.data.rooms || []);
    } catch (err) {
      toast.error('Failed to load practice data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const emails = roomConfig.invitedEmails.split(',').map(e => e.trim()).filter(Boolean);
      await api.post('/multiplayer/create', { ...roomConfig, invitedEmails: emails });
      toast.success('Room created successfully!');
      setShowCreateModal(false);
      setRoomConfig({ numProblems: 2, timeLimit: 30, invitedEmails: '' });
      fetchData(); // Refresh to see the new room
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create room');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await api.post(`/multiplayer/${roomId}/join`);
      window.location.href = `/candidate/multiplayer/${roomId}`;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join room');
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': return 'text-success-400 bg-success-500/10 border-success-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'hard': return 'text-danger-400 bg-danger-500/10 border-danger-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <HiCode className="text-primary-500" />
            Coding Practice
          </h1>
          <p className="text-gray-400">Sharpen your coding skills with these selected problems. Your progress is saved automatically.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary py-2 px-4 flex items-center gap-2"
        >
          <HiUsers /> Multiplayer Room
        </button>
      </div>

      {rooms.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <HiUsers className="text-primary-400" /> Active & Invited Rooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map(room => {
              const creator = room.creator?.name || 'Someone';
              const isEnded = room.status === 'Ended';
              return (
                <div key={room._id} className="card p-5 border border-dark-border opacity-95 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-start mb-3">
                    <span className="badge badge-primary">{room.problems?.length} Problems</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${isEnded ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : room.status === 'Active' ? 'bg-success-500/10 text-success-400 border-success-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                      {room.status}
                    </span>
                  </div>
                  <h3 className="font-medium text-white mb-1">Room by {creator}</h3>
                  <p className="text-sm text-gray-400 flex items-center gap-1 mb-4">
                    <HiClock /> {room.timeLimit} mins
                  </p>
                  <button 
                    onClick={() => isEnded ? window.location.href=`/candidate/multiplayer/${room._id}` : handleJoinRoom(room._id)}
                    className={`nav-btn w-full flex items-center justify-center gap-2 mt-auto py-2.5 ${isEnded ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-primary-500/10 text-primary-400 hover:bg-primary-500/20'}`}
                  >
                    {isEnded ? 'View Results' : 'Join Room'} <HiArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Solo Practice */}
      <h2 className="text-xl font-semibold text-white mb-4">Solo Practice</h2>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : problems.length === 0 ? (
        <div className="card text-center py-16 border border-dashed border-dark-border shadow-none">
          <HiCode className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No problems available yet</h3>
          <p className="text-gray-400">Check back later for new coding challenges.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-border bg-dark-800/50">
                  <th className="py-4 px-6 font-semibold text-gray-300 text-sm w-16 text-center">Status</th>
                  <th className="py-4 px-6 font-semibold text-gray-300 text-sm">Title</th>
                  <th className="py-4 px-6 font-semibold text-gray-300 text-sm">Difficulty</th>
                  <th className="py-4 px-6 font-semibold text-gray-300 text-sm text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {problems.map(problem => {
                  const isSolved = problem.userStatus?.status === 'Solved';
                  const isAttempted = problem.userStatus?.status === 'Attempted';
                  
                  return (
                    <tr key={problem._id} className="hover:bg-dark-800/30 transition-colors group">
                      <td className="py-4 px-6 text-center">
                        {isSolved ? (
                          <HiCheckCircle className="w-6 h-6 text-success-500 mx-auto" title="Solved" />
                        ) : isAttempted ? (
                          <HiClock className="w-5 h-5 text-yellow-500 mx-auto" title="Attempted" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-dark-border mx-auto" title="Unsolved" />
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-white group-hover:text-primary-400 transition-colors">
                          {problem.question}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium uppercase tracking-wider ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link 
                          to={`/candidate/practice/${problem._id}`}
                          className="btn-primary py-1.5 px-4 text-sm inline-flex items-center gap-2"
                        >
                          {isSolved ? 'Solve Again' : 'Solve'}
                          <HiArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-md bg-dark-card border border-dark-border p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><HiUsers className="text-primary-500" /> Create Multiplayer Room</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white p-1"><HiX /></button>
            </div>
            
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Number of Problems</label>
                <input 
                  type="number" min="1" max="5" required
                  className="input-field w-full p-3 text-white bg-dark-900 border-dark-border"
                  value={roomConfig.numProblems}
                  onChange={e => setRoomConfig(c => ({...c, numProblems: Number(e.target.value)}))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Time Limit (Minutes)</label>
                <input 
                  type="number" min="5" max="120" required
                  className="input-field w-full p-3 text-white bg-dark-900 border-dark-border"
                  value={roomConfig.timeLimit}
                  onChange={e => setRoomConfig(c => ({...c, timeLimit: Number(e.target.value)}))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Invite Emails (Comma Separated)</label>
                <textarea 
                  className="input-field w-full p-3 h-24 resize-none text-white bg-dark-900 border-dark-border"
                  placeholder="friend@example.com, peer@example.com"
                  value={roomConfig.invitedEmails}
                  onChange={e => setRoomConfig(c => ({...c, invitedEmails: e.target.value}))}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="nav-btn bg-dark-800">Cancel</button>
                <button type="submit" disabled={creating} className="btn-primary">{creating ? 'Creating...' : 'Create Room'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
