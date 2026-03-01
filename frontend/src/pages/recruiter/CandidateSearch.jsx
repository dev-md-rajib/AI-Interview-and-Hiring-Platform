import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { HiSearch, HiFilter, HiPlus, HiTrash } from 'react-icons/hi';

const STACKS = ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'PHP', 'SQL', 'MongoDB', 'Docker', 'AWS', 'Go', 'C#'];

export default function CandidateSearch() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [requirements, setRequirements] = useState([{ id: Date.now(), stack: '', level: '1', minScore: '' }]);
  const [filters, setFilters] = useState({ minExp: '', availability: '' });

  const addReq = () => setRequirements([...requirements, { id: Date.now(), stack: '', level: '1', minScore: '' }]);
  const removeReq = (id) => setRequirements(requirements.filter(r => r.id !== id));
  const updateReq = (id, field, value) => setRequirements(requirements.map(r => r.id === id ? { ...r, [field]: value } : r));

  const search = async () => {
    setLoading(true);
    setSearched(true);
    
    // Filter out empty requirements
    const validReqs = requirements.filter(r => r.stack).map(({ stack, level, minScore }) => ({ stack, level: Number(level), minScore: minScore ? Number(minScore) : 0 }));
    
    const queryObj = { ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
    if (validReqs.length > 0) queryObj.requirements = JSON.stringify(validReqs);
    
    const params = new URLSearchParams(queryObj);
    
    try { const { data } = await api.get(`/admin/candidates/search?${params}`); setCandidates(data.candidates || []); }
    catch { setCandidates([]); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Find Candidates</h1>

      <div className="card mb-6 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-white font-semibold">Stack Requirements</h2>
            <button onClick={addReq} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"><HiPlus /> Add Requirement</button>
          </div>
          
          <div className="space-y-3">
            {requirements.map((req) => (
              <div key={req.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-dark-800/50 p-3 rounded-lg border border-dark-border">
                <div className="md:col-span-5">
                  <label className="label text-xs">Require Stack</label>
                  <select className="input text-sm" value={req.stack} onChange={(e) => updateReq(req.id, 'stack', e.target.value)}>
                    <option value="">Select Stack</option>
                    {STACKS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="label text-xs">Min Level</label>
                  <select className="input text-sm" value={req.level} onChange={(e) => updateReq(req.id, 'level', e.target.value)}>
                    <option value="1">Level 1 (Junior)</option>
                    <option value="2">Level 2 (Mid)</option>
                    <option value="3">Level 3 (Senior)</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="label text-xs">Min Score (%)</label>
                  <input type="number" min="0" max="100" className="input text-sm" placeholder="70" value={req.minScore} onChange={(e) => updateReq(req.id, 'minScore', e.target.value)} />
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <button onClick={() => removeReq(req.id)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-danger-500/10 text-danger-400 hover:bg-danger-500 hover:text-white transition-colors" disabled={requirements.length === 1}>
                    <HiTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-dark-border grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Min Experience (years)</label>
            <input type="number" className="input" placeholder="Min years" value={filters.minExp} onChange={(e) => setFilters(f => ({ ...f, minExp: e.target.value }))} />
          </div>
          <div>
            <label className="label">Availability</label>
            <select className="input" value={filters.availability} onChange={(e) => setFilters((f) => ({ ...f, availability: e.target.value }))}>
              <option value="">All</option>
              <option value="Available">Available</option>
              <option value="Open to Offers">Open to Offers</option>
            </select>
          </div>
        </div>
        <div className="col-span-2 md:col-span-3">
          <button onClick={search} disabled={loading} className="btn-primary flex items-center gap-2 px-8">
            <HiSearch /> {loading ? 'Searching...' : 'Search Candidates'}
          </button>
        </div>
      </div>

      {searched && !loading && candidates.length === 0 && (
        <div className="card text-center py-16"><p className="text-gray-400">No candidates found matching your criteria</p></div>
      )}

      {candidates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidates.map((c) => (
            <Link key={c._id} to={`/recruiter/candidates/${c.user?._id}`} className="card hover:border-primary-500/40 transition-all block">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {c.user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{c.user?.name}</h3>
                  <p className="text-gray-400 text-sm">{c.yearsOfExperience} years experience</p>
                </div>
                {c.bestInterview && (
                  <div className="ml-auto text-right">
                    <div className="text-primary-400 font-bold">{c.bestInterview.totalScore}%</div>
                    <div className="text-gray-500 text-xs">L{c.bestInterview.level} {c.bestInterview.stack}</div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {c.expertise?.slice(0, 4).map((e) => <span key={e} className="badge-gray">{e}</span>)}
              </div>
              <span className={`badge ${c.availability === 'Available' ? 'badge-success' : 'badge-gray'}`}>{c.availability}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
