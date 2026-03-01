import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiSave, HiPlus, HiTrash } from 'react-icons/hi';

const STACKS = ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'PHP', 'SQL', 'MongoDB', 'Docker', 'AWS', 'Go', 'C#'];

export default function PostJob() {
  const navigate = useNavigate();
  const { id } = useParams(); // id = edit mode
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState([{ id: Date.now(), stack: '', level: '1', minScore: '70' }]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { title: '', description: '', experienceRequired: 0, salaryMin: '', salaryMax: '', location: 'Remote', isRemote: true, status: 'Open' }
  });

  useEffect(() => {
    if (id) {
      api.get(`/jobs/${id}`).then(({ data }) => {
        const j = data.job;
        reset({ title: j.title, description: j.description, experienceRequired: j.experienceRequired, salaryMin: j.salaryMin || '', salaryMax: j.salaryMax || '', location: j.location, isRemote: j.isRemote, status: j.status });
        if (j.requirements && j.requirements.length > 0) {
          setRequirements(j.requirements.map(r => ({ ...r, id: Math.random() })));
        }
      });
    }
  }, [id, reset]);

  const addReq = () => setRequirements([...requirements, { id: Date.now(), stack: '', level: '1', minScore: '70' }]);
  const removeReq = (id) => setRequirements(requirements.filter(r => r.id !== id));
  const updateReq = (id, field, value) => setRequirements(requirements.map(r => r.id === id ? { ...r, [field]: value } : r));

  const onSubmit = async (data) => {
    const validReqs = requirements.filter(r => r.stack).map(r => ({ stack: r.stack, level: Number(r.level), minScore: Number(r.minScore) }));
    if (validReqs.length === 0) return toast.error('Add at least one complete stack requirement');
    
    setLoading(true);
    try {
      const payload = { ...data, requirements: validReqs, experienceRequired: Number(data.experienceRequired) };
      if (id) { await api.put(`/jobs/${id}`, payload); toast.success('Job updated!'); }
      else { await api.post('/jobs', payload); toast.success('Job posted!'); }
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">{id ? 'Edit Job' : 'Post a New Job'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card space-y-4">
          <div><label className="label">Job Title *</label><input className="input" placeholder="Senior React Developer" {...register('title', { required: 'Title required' })} />{errors.title && <p className="text-danger-400 text-xs mt-1">{errors.title.message}</p>}</div>
          <div><label className="label">Job Description *</label><textarea className="input h-32 resize-none" placeholder="Describe the role, responsibilities, requirements..." {...register('description', { required: 'Description required' })} />{errors.description && <p className="text-danger-400 text-xs mt-1">{errors.description.message}</p>}</div>
        </div>

        <div className="card space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-white font-semibold flex items-center gap-2">Stack Requirements <span className="text-danger-400">*</span></h2>
            <button type="button" onClick={addReq} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"><HiPlus /> Add Requirement</button>
          </div>
          
          <div className="space-y-3">
            {requirements.map((req) => (
              <div key={req.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-dark-800/50 p-3 rounded-lg border border-dark-border">
                <div className="md:col-span-5">
                  <label className="label text-xs">Required Stack</label>
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
                  <button type="button" onClick={() => removeReq(req.id)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-danger-500/10 text-danger-400 hover:bg-danger-500 hover:text-white transition-colors" disabled={requirements.length === 1}>
                    <HiTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card grid grid-cols-2 gap-4">
          <div><label className="label">Experience (years) *</label><input type="number" min="0" max="30" className="input" {...register('experienceRequired')} /></div>
          <div>
            <label className="label">Status</label>
            <select className="input" {...register('status')}>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div><label className="label">Salary Range Min ($k)</label><input type="number" className="input" placeholder="50" {...register('salaryMin')} /></div>
          <div><label className="label">Salary Range Max ($k)</label><input type="number" className="input" placeholder="100" {...register('salaryMax')} /></div>
          <div><label className="label">Location</label><input className="input" placeholder="New York / Remote" {...register('location')} /></div>
          <div className="flex items-center gap-3 mt-6">
            <input type="checkbox" id="isRemote" className="w-4 h-4 accent-primary-500" {...register('isRemote')} />
            <label htmlFor="isRemote" className="text-gray-300">Remote OK</label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <HiSave />}
          {id ? 'Update Job' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}
