import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiSave, HiPlus } from 'react-icons/hi';

export default function LevelManager() {
  const [levels, setLevels] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/admin/levels').then(({ data }) => setLevels(data.levels || [])).finally(() => setLoading(false)); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const payload = { ...editing, requiredSkills: editing.requiredSkillsStr?.split(',').map((s) => s.trim()).filter(Boolean) || [], allowedStacks: editing.allowedStacksStr?.split(',').map((s) => s.trim()).filter(Boolean) || [] };
      await api.post('/admin/levels', payload);
      toast.success(`Level ${editing.level} saved!`);
      const { data } = await api.get('/admin/levels');
      setLevels(data.levels || []);
      setEditing(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Interview Level Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((lvl) => {
          const level = levels.find((l) => l.level === lvl) || { level: lvl };
          return (
            <div key={lvl} onClick={() => setEditing({ ...level, requiredSkillsStr: level.requiredSkills?.join(', ') || '', allowedStacksStr: level.allowedStacks?.join(', ') || '' })} className={`card cursor-pointer hover:border-primary-500/40 transition-all ${editing?.level === lvl ? 'border-primary-500 bg-primary-900/20' : ''}`}>
              <h3 className="text-white font-bold mb-1">Level {lvl}</h3>
              <p className="text-gray-400 text-sm">{level.name || 'Not configured'}</p>
              <div className="mt-3 space-y-1 text-xs text-gray-500">
                <p>Pass score: {level.minimumPassScore || '-'}%</p>
                <p>Duration: {level.durationMinutes || '-'} min</p>
                <p>Questions: {level.questionCount || '-'}</p>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="card space-y-4">
          <h2 className="section-title">Edit Level {editing.level}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Name</label><input className="input" value={editing.name || ''} onChange={(e) => setEditing((d) => ({ ...d, name: e.target.value }))} /></div>
            <div><label className="label">Min Pass Score (%)</label><input type="number" className="input" value={editing.minimumPassScore || 70} onChange={(e) => setEditing((d) => ({ ...d, minimumPassScore: e.target.value }))} /></div>
            <div><label className="label">Duration (min)</label><input type="number" className="input" value={editing.durationMinutes || 60} onChange={(e) => setEditing((d) => ({ ...d, durationMinutes: e.target.value }))} /></div>
            <div><label className="label">Question Count</label><input type="number" className="input" value={editing.questionCount || 10} onChange={(e) => setEditing((d) => ({ ...d, questionCount: e.target.value }))} /></div>
            <div className="col-span-2"><label className="label">Description</label><textarea className="input h-16 resize-none" value={editing.description || ''} onChange={(e) => setEditing((d) => ({ ...d, description: e.target.value }))} /></div>
            <div className="col-span-2"><label className="label">Required Skills (comma-separated)</label><input className="input" value={editing.requiredSkillsStr || ''} onChange={(e) => setEditing((d) => ({ ...d, requiredSkillsStr: e.target.value }))} /></div>
            <div className="col-span-2"><label className="label">Allowed Stacks (comma-separated)</label><input className="input" value={editing.allowedStacksStr || ''} onChange={(e) => setEditing((d) => ({ ...d, allowedStacksStr: e.target.value }))} /></div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2"><HiSave />{saving ? 'Saving...' : 'Save Level'}</button>
            <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
