import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiSave, HiPlus, HiTrash, HiCode } from 'react-icons/hi';
import { SECTORS, TECH_STACKS, getSectorById, isSector } from '../../constants/sectors';

export default function PostJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState([{ id: Date.now(), stack: '', level: '1', minScore: '70', method: 'Both' }]);
  const [selectedSector, setSelectedSector] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '', description: '', experienceRequired: 0,
      salaryMin: '', salaryMax: '', location: 'Remote', isRemote: true, status: 'Open',
    }
  });

  useEffect(() => {
    if (id) {
      api.get(`/jobs/${id}`).then(({ data }) => {
        const j = data.job;
        reset({
          title: j.title, description: j.description,
          experienceRequired: j.experienceRequired,
          salaryMin: j.salaryMin || '', salaryMax: j.salaryMax || '',
          location: j.location, isRemote: j.isRemote, status: j.status,
        });
        if (j.sector) setSelectedSector(j.sector);
        if (j.requirements && j.requirements.length > 0) {
          setRequirements(j.requirements.map(r => ({ ...r, id: Math.random() })));
        }
      });
    }
  }, [id, reset]);

  const addReq = () => setRequirements([...requirements, { id: Date.now(), stack: '', level: '1', minScore: '70', method: 'Both' }]);
  const removeReq = (reqId) => setRequirements(requirements.filter(r => r.id !== reqId));
  const updateReq = (reqId, field, value) => setRequirements(requirements.map(r => r.id === reqId ? { ...r, [field]: value } : r));

  const onSubmit = async (data) => {
    const validReqs = requirements
      .filter(r => r.stack)
      .map(r => ({ stack: r.stack, level: Number(r.level), minScore: Number(r.minScore), method: r.method }));
    if (validReqs.length === 0) return toast.error('Add at least one complete requirement');

    setLoading(true);
    try {
      const payload = {
        ...data,
        requirements: validReqs,
        experienceRequired: Number(data.experienceRequired),
        sector: selectedSector || null,
      };
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

        {/* Job Details */}
        <div className="card space-y-4">
          <h2 className="section-title">Job Details</h2>
          <div>
            <label className="label">Job Title *</label>
            <input className="input" placeholder="Senior Marketing Manager" {...register('title', { required: 'Title required' })} />
            {errors.title && <p className="text-danger-400 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Job Description *</label>
            <textarea className="input h-32 resize-none" placeholder="Describe the role, responsibilities, requirements..." {...register('description', { required: 'Description required' })} />
            {errors.description && <p className="text-danger-400 text-xs mt-1">{errors.description.message}</p>}
          </div>
        </div>

        {/* Field / Domain */}
        <div className="card space-y-4">
          <h2 className="section-title">Job Field / Domain <span className="text-gray-400 text-sm font-normal">(optional)</span></h2>
          <p className="text-gray-400 text-sm">If this is a professional/general domain role (e.g. Marketing, Sales, HR, Finance), select the field it falls under. Candidates will see a domain badge on the job card.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setSelectedSector('')}
              className={`p-2.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-2 ${
                !selectedSector ? 'border-gray-500 bg-gray-700/50 text-white' : 'border-dark-border text-gray-400 hover:border-gray-500'
              }`}
            >
              <HiCode className="w-4 h-4 text-cyan-400" />
              <span>Technical / Other</span>
            </button>
            {SECTORS.map((sector) => {
              const isSelected = selectedSector === sector.id;
              const Icon = sector.Icon;
              return (
                <button
                  type="button"
                  key={sector.id}
                  onClick={() => setSelectedSector(sector.id)}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-2 ${
                    isSelected ? `${sector.border} ${sector.bg} text-white` : 'border-dark-border text-gray-400 hover:border-gray-500 bg-dark-800/40'
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${isSelected ? sector.color : 'text-gray-400'}`} />}
                  <span>{sector.label}</span>
                </button>
              );
            })}
          </div>
          {selectedSector && (
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-2">
              <span>Selected sector:</span>
              <span className={`font-semibold inline-flex items-center gap-1 ${getSectorById(selectedSector)?.color}`}>
                {getSectorById(selectedSector)?.Icon && React.createElement(getSectorById(selectedSector).Icon, { className: 'w-3.5 h-3.5' })}
                {selectedSector}
              </span>
            </p>
          )}
        </div>

        {/* Interview Requirements */}
        <div className="card space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-white font-semibold flex items-center gap-2">
              Interview Requirements <span className="text-danger-400">*</span>
            </h2>
            <button type="button" onClick={addReq} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
              <HiPlus /> Add Requirement
            </button>
          </div>
          <p className="text-gray-400 text-xs">Candidates must pass these interviews to apply. You can require both Tech Stack and Business Sector interviews.</p>

          <div className="space-y-3">
            {requirements.map((req) => {
              const reqSector = isSector(req.stack) ? getSectorById(req.stack) : null;
              return (
                <div key={req.id} className={`grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-3 rounded-lg border ${reqSector ? reqSector.bg + ' ' + reqSector.border + '/40' : 'bg-dark-800/50 border-dark-border'}`}>
                  <div className="md:col-span-4">
                    <label className="label text-xs">Required Stack / Sector</label>
                    <select className="input text-sm px-2" value={req.stack} onChange={(e) => updateReq(req.id, 'stack', e.target.value)}>
                      <option value="">Select...</option>
                      <optgroup label="— Tech Stacks —">
                        {TECH_STACKS.map(s => <option key={s} value={s}>{s}</option>)}
                      </optgroup>
                      <optgroup label="— Business Sectors —">
                        {SECTORS.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
                      </optgroup>
                    </select>
                    {reqSector && (
                      <p className="text-xs mt-1 flex items-center gap-1">
                        <span>{reqSector.icon}</span>
                        <span className={reqSector.color}>{reqSector.label} sector</span>
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="label text-xs">Method</label>
                    <select className="input text-sm px-2" value={req.method || 'Both'} onChange={(e) => updateReq(req.id, 'method', e.target.value)}>
                      <option value="Both">Both (Any)</option>
                      <option value="Standard">Standard</option>
                      <option value="AI">AI Agent</option>
                      <option value="Human">Human Interview</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="label text-xs">Min Level</label>
                    <select className="input text-sm px-2" value={req.level} onChange={(e) => updateReq(req.id, 'level', e.target.value)}>
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
              );
            })}
          </div>
        </div>

        {/* Additional Details */}
        <div className="card space-y-4">
          <h2 className="section-title">Additional Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Min Salary (k)</label>
              <input type="number" className="input" placeholder="50" {...register('salaryMin')} />
            </div>
            <div>
              <label className="label">Max Salary (k)</label>
              <input type="number" className="input" placeholder="80" {...register('salaryMax')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Experience Required (years)</label>
              <input type="number" min="0" className="input" {...register('experienceRequired')} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" placeholder="London / Remote" {...register('location')} />
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isRemote" className="w-4 h-4 accent-primary-500" {...register('isRemote')} />
              <label htmlFor="isRemote" className="text-gray-300 text-sm">Remote Position</label>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" {...register('status')}>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
          <HiSave />
          {loading ? 'Saving...' : id ? 'Update Job' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}
