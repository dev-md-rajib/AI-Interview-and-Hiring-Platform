import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { HiSearch, HiFilter } from 'react-icons/hi';

export default function CandidateSearch() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({ stack: '', level: '', minScore: '', maxScore: '', minExp: '', availability: '' });

  const search = async () => {
    setLoading(true);
    setSearched(true);
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    try { const { data } = await api.get(`/admin/candidates/search?${params}`); setCandidates(data.candidates || []); }
    catch { setCandidates([]); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Find Candidates</h1>

      <div className="card mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { key: 'stack', placeholder: 'Tech Stack (e.g. React)', label: 'Stack' },
          { key: 'minScore', placeholder: 'Min score %', label: 'Min Score', type: 'number' },
          { key: 'maxScore', placeholder: 'Max score %', label: 'Max Score', type: 'number' },
          { key: 'minExp', placeholder: 'Min years', label: 'Experience', type: 'number' },
        ].map(({ key, placeholder, label, type = 'text' }) => (
          <div key={key}>
            <label className="label">{label}</label>
            <input type={type} className="input" placeholder={placeholder} value={filters[key]} onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))} />
          </div>
        ))}
        <div>
          <label className="label">Level</label>
          <select className="input" value={filters.level} onChange={(e) => setFilters((f) => ({ ...f, level: e.target.value }))}>
            <option value="">All</option>
            <option value="1">Level 1</option><option value="2">Level 2</option><option value="3">Level 3</option>
          </select>
        </div>
        <div>
          <label className="label">Availability</label>
          <select className="input" value={filters.availability} onChange={(e) => setFilters((f) => ({ ...f, availability: e.target.value }))}>
            <option value="">All</option>
            <option value="Available">Available</option><option value="Open to Offers">Open to Offers</option>
          </select>
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
