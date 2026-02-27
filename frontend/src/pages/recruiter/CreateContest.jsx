import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiPlus, HiTrash, HiSave, HiLightningBolt } from 'react-icons/hi';

const LANGS = ['javascript', 'python'];

const defaultMcqQ = () => ({ text: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 });
const defaultCodingQ = () => ({ text: '', marks: 1, allowedLanguages: ['javascript'], testCases: [{ input: '', expectedOutput: '', hidden: false }] });

export default function CreateContest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [tab, setTab] = useState('settings');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '',
    scheduledAt: '', endsAt: '',
    mcqRound: { enabled: false, timeLimitMinutes: 30, passThreshold: 60, questions: [] },
    codingRound: { timeLimitMinutes: 90, questions: [] },
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/contests/${id}`).then(({ data }) => {
        const c = data.contest;
        setForm({
          title: c.title, description: c.description || '',
          scheduledAt: c.scheduledAt ? new Date(c.scheduledAt).toISOString().slice(0, 16) : '',
          endsAt: c.endsAt ? new Date(c.endsAt).toISOString().slice(0, 16) : '',
          mcqRound: c.mcqRound || { enabled: false, timeLimitMinutes: 30, passThreshold: 60, questions: [] },
          codingRound: c.codingRound || { timeLimitMinutes: 90, questions: [] },
        });
      });
    }
  }, [id]);

  const set = (path, val) => {
    setForm(f => {
      const parts = path.split('.');
      const next = JSON.parse(JSON.stringify(f));
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = val;
      return next;
    });
  };

  // MCQ helpers
  const addMcqQ = () => setForm(f => ({ ...f, mcqRound: { ...f.mcqRound, questions: [...f.mcqRound.questions, defaultMcqQ()] } }));
  const removeMcqQ = i => setForm(f => ({ ...f, mcqRound: { ...f.mcqRound, questions: f.mcqRound.questions.filter((_, j) => j !== i) } }));
  const setMcqQ = (i, field, val) => {
    const qs = JSON.parse(JSON.stringify(form.mcqRound.questions));
    if (field === 'option') { qs[i].options[val.idx] = val.text; }
    else qs[i][field] = val;
    setForm(f => ({ ...f, mcqRound: { ...f.mcqRound, questions: qs } }));
  };

  // Coding helpers
  const addCodingQ = () => setForm(f => ({ ...f, codingRound: { ...f.codingRound, questions: [...f.codingRound.questions, defaultCodingQ()] } }));
  const removeCodingQ = i => setForm(f => ({ ...f, codingRound: { ...f.codingRound, questions: f.codingRound.questions.filter((_, j) => j !== i) } }));
  const setCodingQ = (i, field, val) => {
    const qs = JSON.parse(JSON.stringify(form.codingRound.questions));
    qs[i][field] = val;
    setForm(f => ({ ...f, codingRound: { ...f.codingRound, questions: qs } }));
  };
  const addTestCase = (qi) => {
    const qs = JSON.parse(JSON.stringify(form.codingRound.questions));
    qs[qi].testCases.push({ input: '', expectedOutput: '', hidden: false });
    setForm(f => ({ ...f, codingRound: { ...f.codingRound, questions: qs } }));
  };
  const setTestCase = (qi, ti, field, val) => {
    const qs = JSON.parse(JSON.stringify(form.codingRound.questions));
    qs[qi].testCases[ti][field] = val;
    setForm(f => ({ ...f, codingRound: { ...f.codingRound, questions: qs } }));
  };
  const removeTestCase = (qi, ti) => {
    const qs = JSON.parse(JSON.stringify(form.codingRound.questions));
    qs[qi].testCases = qs[qi].testCases.filter((_, j) => j !== ti);
    setForm(f => ({ ...f, codingRound: { ...f.codingRound, questions: qs } }));
  };
  const toggleLang = (qi, lang) => {
    const qs = JSON.parse(JSON.stringify(form.codingRound.questions));
    const langs = qs[qi].allowedLanguages;
    qs[qi].allowedLanguages = langs.includes(lang) ? langs.filter(l => l !== lang) : [...langs, lang];
    setForm(f => ({ ...f, codingRound: { ...f.codingRound, questions: qs } }));
  };

  const saveContest = async (activate = false) => {
    if (!form.title || !form.scheduledAt || !form.endsAt)
      return toast.error('Title, start and end times are required');
    setSaving(true);
    try {
      const payload = { ...form, scheduledAt: new Date(form.scheduledAt), endsAt: new Date(form.endsAt) };
      let res;
      if (isEdit) { res = await api.put(`/contests/${id}`, payload); }
      else { res = await api.post('/contests', payload); }
      const contestId = res.data.contest._id;

      if (activate) {
        await api.post(`/contests/${contestId}/activate`);
        toast.success('Contest activated!');
      } else {
        toast.success(isEdit ? 'Contest updated!' : 'Contest saved as draft!');
      }
      navigate('/recruiter/contests');
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const tabs = ['settings', 'mcq', 'coding'];
  const totalCodingPts = form.codingRound.questions.reduce((s, q) => s + (Number(q.marks) || 1), 0);
  const totalMcqPts = form.mcqRound.questions.reduce((s, q) => s + (Number(q.marks) || 1), 0);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">{isEdit ? 'Edit Contest' : 'Create Contest'}</h1>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-dark-800 rounded-xl p-1">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >{t === 'mcq' ? `MCQ ${form.mcqRound.enabled ? `(${form.mcqRound.questions.length}q · ${totalMcqPts}pts)` : '(disabled)'}` : t === 'coding' ? `Coding (${form.codingRound.questions.length}q · ${totalCodingPts}pts)` : 'Settings'}</button>
        ))}
      </div>

      {/* Settings tab */}
      {tab === 'settings' && (
        <div className="card space-y-4">
          <div><label className="label">Contest Title *</label><input className="input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. JavaScript Challenge Round 1" /></div>
          <div><label className="label">Description</label><textarea className="input h-20 resize-none" value={form.description} onChange={e => set('description', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Start Date & Time *</label><input type="datetime-local" className="input" value={form.scheduledAt} onChange={e => set('scheduledAt', e.target.value)} /></div>
            <div><label className="label">End Date & Time *</label><input type="datetime-local" className="input" value={form.endsAt} onChange={e => set('endsAt', e.target.value)} /></div>
          </div>
        </div>
      )}

      {/* MCQ tab */}
      {tab === 'mcq' && (
        <div className="space-y-4">
          <div className="card flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Enable MCQ Round</p>
              <p className="text-gray-400 text-sm">Candidates must pass MCQ to unlock coding</p>
            </div>
            <button onClick={() => set('mcqRound.enabled', !form.mcqRound.enabled)}
              className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${form.mcqRound.enabled ? 'bg-primary-600' : 'bg-gray-600'}`}>
              <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform mt-1 ${form.mcqRound.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {form.mcqRound.enabled && (
            <>
              <div className="card grid grid-cols-2 gap-4">
                <div><label className="label">Time Limit (min)</label><input type="number" className="input" min="5" value={form.mcqRound.timeLimitMinutes} onChange={e => set('mcqRound.timeLimitMinutes', Number(e.target.value))} /></div>
                <div>
                  <label className="label">Pass Threshold: {form.mcqRound.passThreshold}%</label>
                  <input type="range" min="0" max="100" step="5" value={form.mcqRound.passThreshold} onChange={e => set('mcqRound.passThreshold', Number(e.target.value))} className="w-full accent-primary-500 mt-2" />
                </div>
              </div>

              <div className="space-y-4">
                {form.mcqRound.questions.map((q, i) => (
                  <div key={i} className="card border border-dark-border">
                    <div className="flex justify-between items-start mb-3">
                      <span className="badge-primary">Q{i + 1}</span>
                      <button onClick={() => removeMcqQ(i)} className="text-danger-400 hover:text-danger-300"><HiTrash /></button>
                    </div>
                    <div className="space-y-3">
                      <div><label className="label">Question Text</label><textarea className="input h-16 resize-none" value={q.text} onChange={e => setMcqQ(i, 'text', e.target.value)} /></div>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi}><label className="text-xs text-gray-400 mb-1 block">Option {String.fromCharCode(65 + oi)}</label>
                            <input className="input text-sm py-1.5" value={opt} onChange={e => setMcqQ(i, 'option', { idx: oi, text: e.target.value })} /></div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="label">Correct Answer</label>
                          <select className="input" value={q.correctAnswer} onChange={e => setMcqQ(i, 'correctAnswer', e.target.value)}>
                            <option value="">Select correct</option>
                            {q.options.map((opt, oi) => opt && <option key={oi} value={opt}>{String.fromCharCode(65 + oi)}: {opt.slice(0, 30)}</option>)}
                          </select></div>
                        <div><label className="label">Marks</label><input type="number" min="1" className="input" value={q.marks} onChange={e => setMcqQ(i, 'marks', Number(e.target.value))} /></div>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addMcqQ} className="btn-secondary w-full flex items-center justify-center gap-2"><HiPlus />Add MCQ Question</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Coding tab */}
      {tab === 'coding' && (
        <div className="space-y-4">
          <div className="card">
            <label className="label">Coding Round Time Limit (min)</label>
            <input type="number" className="input w-32" min="15" value={form.codingRound.timeLimitMinutes} onChange={e => set('codingRound.timeLimitMinutes', Number(e.target.value))} />
          </div>

          {form.codingRound.questions.map((q, qi) => (
            <div key={qi} className="card border border-dark-border">
              <div className="flex justify-between items-start mb-3">
                <span className="badge-primary">Problem {qi + 1}</span>
                <button onClick={() => removeCodingQ(qi)} className="text-danger-400 hover:text-danger-300"><HiTrash /></button>
              </div>
              <div className="space-y-3">
                <div><label className="label">Problem Statement</label><textarea className="input h-24 resize-none" value={q.text} onChange={e => setCodingQ(qi, 'text', e.target.value)} placeholder="Describe the problem, input format, output format, constraints..." /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label">Points</label><input type="number" min="1" className="input" value={q.marks} onChange={e => setCodingQ(qi, 'marks', Number(e.target.value))} /></div>
                  <div>
                    <label className="label">Allowed Languages</label>
                    <div className="flex gap-2 mt-1">{LANGS.map(lang => (
                      <button key={lang} type="button" onClick={() => toggleLang(qi, lang)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all capitalize ${q.allowedLanguages.includes(lang) ? 'bg-primary-700 border-primary-500 text-white' : 'border-dark-border text-gray-400 hover:border-gray-500'}`}>{lang}</button>
                    ))}</div>
                  </div>
                </div>

                <div>
                  <label className="label">Test Cases</label>
                  <div className="space-y-2">
                    {q.testCases.map((tc, ti) => (
                      <div key={ti} className="bg-dark-800 rounded-lg p-3 flex gap-3 items-start">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div><p className="text-xs text-gray-500 mb-1">Input</p><textarea rows={2} className="input text-xs resize-none font-mono" value={tc.input} onChange={e => setTestCase(qi, ti, 'input', e.target.value)} placeholder="stdin input" /></div>
                          <div><p className="text-xs text-gray-500 mb-1">Expected Output</p><textarea rows={2} className="input text-xs resize-none font-mono" value={tc.expectedOutput} onChange={e => setTestCase(qi, ti, 'expectedOutput', e.target.value)} placeholder="expected stdout" /></div>
                        </div>
                        <div className="flex flex-col items-center gap-2 pt-4">
                          <label className="text-xs text-gray-400">Hidden</label>
                          <input type="checkbox" checked={tc.hidden} onChange={e => setTestCase(qi, ti, 'hidden', e.target.checked)} className="accent-primary-500" />
                          <button onClick={() => removeTestCase(qi, ti)} className="text-danger-400 hover:text-danger-300 mt-1"><HiTrash className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => addTestCase(qi)} className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1"><HiPlus className="w-3.5 h-3.5" />Add Test Case</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addCodingQ} className="btn-secondary w-full flex items-center justify-center gap-2"><HiPlus />Add Coding Problem</button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mt-6">
        <button onClick={() => saveContest(false)} disabled={saving} className="btn-secondary flex-1 flex items-center justify-center gap-2">
          <HiSave />{saving ? 'Saving...' : 'Save as Draft'}
        </button>
        <button onClick={() => saveContest(true)} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
          <HiLightningBolt />{saving ? 'Activating...' : 'Save & Activate'}
        </button>
      </div>
    </div>
  );
}
