import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiSave } from 'react-icons/hi';

const STACKS = ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'PHP', 'SQL', 'MongoDB', 'Docker', 'AWS', 'Go', 'C#'];

export default function PostJob() {
  const navigate = useNavigate();
  const { id } = useParams(); // id = edit mode
  const [loading, setLoading] = useState(false);
  const [selectedStacks, setSelectedStacks] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { title: '', description: '', requiredLevel: 1, minScore: 70, experienceRequired: 0, salaryMin: '', salaryMax: '', location: 'Remote', isRemote: true, status: 'Open' }
  });

  useEffect(() => {
    if (id) {
      api.get(`/jobs/${id}`).then(({ data }) => {
        const j = data.job;
        reset({ title: j.title, description: j.description, requiredLevel: j.requiredLevel, minScore: j.minScore, experienceRequired: j.experienceRequired, salaryMin: j.salaryMin || '', salaryMax: j.salaryMax || '', location: j.location, isRemote: j.isRemote, status: j.status });
        setSelectedStacks(j.requiredStack || []);
      });
    }
  }, [id, reset]);

  const toggleStack = (s) => setSelectedStacks((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const onSubmit = async (data) => {
    if (selectedStacks.length === 0) return toast.error('Select at least one tech stack');
    setLoading(true);
    try {
      const payload = { ...data, requiredStack: selectedStacks, requiredLevel: Number(data.requiredLevel), minScore: Number(data.minScore), experienceRequired: Number(data.experienceRequired) };
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

        <div className="card">
          <label className="label">Required Tech Stacks *</label>
          <div className="flex flex-wrap gap-2">
            {STACKS.map((s) => (
              <button type="button" key={s} onClick={() => toggleStack(s)} className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${selectedStacks.includes(s) ? 'border-primary-500 bg-primary-900/40 text-primary-300' : 'border-dark-border text-gray-400 hover:border-primary-700'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="card grid grid-cols-2 gap-4">
          <div>
            <label className="label">Required Level</label>
            <select className="input" {...register('requiredLevel')}>
              <option value={1}>Level 1 (Junior)</option>
              <option value={2}>Level 2 (Mid)</option>
              <option value={3}>Level 3 (Senior)</option>
            </select>
          </div>
          <div><label className="label">Min Interview Score (%)</label><input type="number" min="0" max="100" className="input" {...register('minScore')} /></div>
          <div><label className="label">Experience (years)</label><input type="number" min="0" max="30" className="input" {...register('experienceRequired')} /></div>
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
