import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiTrash, HiPlus } from 'react-icons/hi';

const STACKS = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'Java', 'AWS'];
const TYPES = ['mcq', 'coding', 'text', 'scenario'];
const DIFFS = ['easy', 'medium', 'hard'];

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ stack: '', level: '', type: '' });
  const [form, setForm] = useState({ stack: 'JavaScript', level: 1, type: 'text', question: '', skill: '', difficulty: 'medium', options: ['', '', '', ''], correctAnswer: '' });

  const load = () => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    api.get(`/admin/questions?${params}`).then(({ data }) => setQuestions(data.questions || [])).finally(() => setLoading(false));
  };

  useEffect(load, [filters]);

  const addQuestion = async () => {
    if (!form.question.trim()) return toast.error('Question text required');
    try {
      const payload = { ...form, options: form.type === 'mcq' ? form.options.filter(Boolean) : [] };
      await api.post('/admin/questions', payload);
      toast.success('Question added!');
      setShowForm(false);
      load();
    } catch { toast.error('Failed to add question'); }
  };

  const deleteQ = async (id) => {
    try { await api.delete(`/admin/questions/${id}`); setQuestions((q) => q.filter((x) => x._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Question Bank ({questions.length})</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2"><HiPlus /> Add Question</button>
      </div>

      {/* Filters */}
      <div className="card mb-6 flex gap-4 flex-wrap">
        <select className="input w-36" value={filters.stack} onChange={(e) => setFilters((f) => ({ ...f, stack: e.target.value }))}>
          <option value="">All Stacks</option>
          {STACKS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input w-32" value={filters.level} onChange={(e) => setFilters((f) => ({ ...f, level: e.target.value }))}>
          <option value="">All Levels</option>
          {[1, 2, 3].map((l) => <option key={l} value={l}>Level {l}</option>)}
        </select>
        <select className="input w-32" value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
          <option value="">All Types</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card mb-6 space-y-4">
          <h2 className="section-title">New Question</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><label className="label">Stack</label><select className="input" value={form.stack} onChange={(e) => setForm((f) => ({ ...f, stack: e.target.value }))}>{STACKS.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div><label className="label">Level</label><select className="input" value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: Number(e.target.value) }))}>{[1, 2, 3].map((l) => <option key={l} value={l}>Level {l}</option>)}</select></div>
            <div><label className="label">Type</label><select className="input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div><label className="label">Difficulty</label><select className="input" value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}>{DIFFS.map((d) => <option key={d}>{d}</option>)}</select></div>
          </div>
          <div><label className="label">Skill</label><input className="input" placeholder="e.g. React Hooks" value={form.skill} onChange={(e) => setForm((f) => ({ ...f, skill: e.target.value }))} /></div>
          <div><label className="label">Question Text *</label><textarea className="input h-24 resize-none" value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} /></div>
          {form.type === 'mcq' && (<>
            <div>
              <label className="label">Options (4)</label>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((i) => <input key={i} className="input" placeholder={`Option ${String.fromCharCode(65 + i)}`} value={form.options[i]} onChange={(e) => { const opts = [...form.options]; opts[i] = e.target.value; setForm((f) => ({ ...f, options: opts })); }} />)}
              </div>
            </div>
            <div><label className="label">Correct Answer</label><input className="input" placeholder="e.g. Option A" value={form.correctAnswer} onChange={(e) => setForm((f) => ({ ...f, correctAnswer: e.target.value }))} /></div>
          </>)}
          <div className="flex gap-3">
            <button onClick={addQuestion} className="btn-primary flex items-center gap-2"><HiPlus />Add Question</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div className="flex justify-center h-32 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
        : questions.length === 0 ? <div className="card text-center py-12"><p className="text-gray-400">No questions found</p></div>
        : (
          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q._id} className="card group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-white">{q.question}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="badge-primary">{q.stack}</span>
                      <span className="badge-gray">L{q.level}</span>
                      <span className="badge bg-blue-900 text-blue-300">{q.type}</span>
                      <span className={`badge ${q.difficulty === 'hard' ? 'badge-danger' : q.difficulty === 'medium' ? 'badge-warning' : 'badge-success'}`}>{q.difficulty}</span>
                      {q.skill && <span className="badge-gray">{q.skill}</span>}
                    </div>
                  </div>
                  <button onClick={() => deleteQ(q._id)} className="opacity-0 group-hover:opacity-100 text-danger-400 hover:text-danger-300 transition-all"><HiTrash className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
