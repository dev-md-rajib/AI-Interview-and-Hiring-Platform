import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { HiPlus, HiTrash, HiSave } from 'react-icons/hi';

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const STACKS = ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'PHP', 'SQL', 'MongoDB', 'Docker', 'AWS', 'Go', 'Ruby', 'Swift', 'Kotlin', 'C#', 'C++'];

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioDesc, setPortfolioDesc] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      expertise: [],
      yearsOfExperience: 0,
      education: [],
      certifications: [],
      skills: [],
      bio: '',
      linkedIn: '',
      github: '',
      website: '',
      availability: 'Available',
    }
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'education' });
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: 'certifications' });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: 'skills' });

  useEffect(() => {
    api.get('/profile/me').then(({ data }) => {
      if (data.profile) reset({
        expertise: data.profile.expertise?.join(', ') || '',
        yearsOfExperience: data.profile.yearsOfExperience || 0,
        education: data.profile.education || [],
        certifications: data.profile.certifications || [],
        skills: data.profile.skills || [],
        bio: data.profile.bio || '',
        linkedIn: data.profile.linkedIn || '',
        github: data.profile.github || '',
        website: data.profile.website || '',
        availability: data.profile.availability || 'Available',
      });
    }).finally(() => setInitLoading(false));
  }, [reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        expertise: typeof data.expertise === 'string'
          ? data.expertise.split(',').map((s) => s.trim()).filter(Boolean)
          : data.expertise,
        yearsOfExperience: Number(data.yearsOfExperience),
      };
      await api.put('/profile/me', payload);
      await api.put('/profile/skills', { skills: data.skills });
      toast.success('Profile updated!');
      navigate('/candidate/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const addPortfolio = async () => {
    if (!portfolioTitle) return toast.error('Title required');
    try {
      await api.post('/profile/portfolio', { title: portfolioTitle, description: portfolioDesc, mediaUrl: portfolioUrl, mediaType: 'link' });
      toast.success('Portfolio item added!');
      setPortfolioTitle(''); setPortfolioDesc(''); setPortfolioUrl('');
    } catch { toast.error('Failed to add portfolio item'); }
  };

  const tabs = ['basic', 'education', 'skills', 'portfolio'];

  if (initLoading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
        <button onClick={() => navigate('/candidate/profile')} className="btn-secondary text-sm">Cancel</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === t ? 'bg-primary-600 text-white' : 'bg-dark-card text-gray-400 hover:text-white'}`}>
            {t === 'basic' ? 'Basic Info' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic info */}
        {activeTab === 'basic' && (
          <div className="card space-y-4">
            <div>
              <label className="label">Bio</label>
              <textarea className="input h-24 resize-none" placeholder="Tell recruiters about yourself..." {...register('bio')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Years of Experience</label>
                <input type="number" min="0" max="50" className="input" {...register('yearsOfExperience')} />
              </div>
              <div>
                <label className="label">Availability</label>
                <select className="input" {...register('availability')}>
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                  <option value="Open to Offers">Open to Offers</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Expertise / Tech Stacks</label>
              <input className="input" placeholder="e.g. React, Node.js, Python (comma-separated)" {...register('expertise')} />
            </div>
            <div>
              <label className="label">LinkedIn URL</label>
              <input className="input" placeholder="https://linkedin.com/in/..." {...register('linkedIn')} />
            </div>
            <div>
              <label className="label">GitHub URL</label>
              <input className="input" placeholder="https://github.com/..." {...register('github')} />
            </div>
            <div>
              <label className="label">Website/Portfolio URL</label>
              <input className="input" placeholder="https://..." {...register('website')} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <HiSave />}
              Save Changes
            </button>
          </div>
        )}

        {/* Education */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-white font-semibold mb-4">Education</h3>
              {eduFields.map((field, i) => (
                <div key={field.id} className="border border-dark-border rounded-lg p-4 mb-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">Degree</label><input className="input" {...register(`education.${i}.degree`)} placeholder="B.Sc Computer Science" /></div>
                    <div><label className="label">Institution</label><input className="input" {...register(`education.${i}.institution`)} placeholder="MIT" /></div>
                    <div><label className="label">Year</label><input type="number" className="input" {...register(`education.${i}.year`)} placeholder="2022" /></div>
                  </div>
                  <button type="button" onClick={() => removeEdu(i)} className="text-danger-400 text-sm flex items-center gap-1"><HiTrash /> Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => appendEdu({ degree: '', institution: '', year: '' })} className="btn-secondary text-sm flex items-center gap-1"><HiPlus /> Add Education</button>
            </div>

            <div className="card">
              <h3 className="text-white font-semibold mb-4">Certifications</h3>
              {certFields.map((field, i) => (
                <div key={field.id} className="border border-dark-border rounded-lg p-4 mb-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">Name</label><input className="input" {...register(`certifications.${i}.name`)} placeholder="AWS Certified Developer" /></div>
                    <div><label className="label">Issuer</label><input className="input" {...register(`certifications.${i}.issuer`)} placeholder="Amazon" /></div>
                    <div><label className="label">Year</label><input type="number" className="input" {...register(`certifications.${i}.year`)} /></div>
                  </div>
                  <button type="button" onClick={() => removeCert(i)} className="text-danger-400 text-sm flex items-center gap-1"><HiTrash /> Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => appendCert({ name: '', issuer: '', year: '' })} className="btn-secondary text-sm flex items-center gap-1"><HiPlus /> Add Certification</button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <HiSave />} Save
            </button>
          </div>
        )}

        {/* Skills */}
        {activeTab === 'skills' && (
          <div className="card">
            <h3 className="text-white font-semibold mb-4">Skills Matrix</h3>
            {skillFields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-3 gap-3 items-end mb-3">
                <div><label className="label">Skill Name</label><input className="input" {...register(`skills.${i}.name`)} placeholder="React" /></div>
                <div><label className="label">Score (0-100)</label><input type="number" min="0" max="100" className="input" {...register(`skills.${i}.score`)} /></div>
                <div className="flex gap-2">
                  <div className="flex-1"><label className="label">Level</label>
                    <select className="input" {...register(`skills.${i}.level`)}>
                      {SKILL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <button type="button" onClick={() => removeSkill(i)} className="text-danger-400 mt-6"><HiTrash /></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => appendSkill({ name: '', score: 50, level: 'Intermediate' })} className="btn-secondary text-sm flex items-center gap-1 mb-4"><HiPlus /> Add Skill</button>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <HiSave />} Save Skills
            </button>
          </div>
        )}

        {/* Portfolio */}
        {activeTab === 'portfolio' && (
          <div className="card space-y-4">
            <h3 className="text-white font-semibold">Add Portfolio Item</h3>
            <div><label className="label">Title *</label><input className="input" value={portfolioTitle} onChange={(e) => setPortfolioTitle(e.target.value)} placeholder="My Project" /></div>
            <div><label className="label">Description</label><textarea className="input h-20 resize-none" value={portfolioDesc} onChange={(e) => setPortfolioDesc(e.target.value)} placeholder="Project description..." /></div>
            <div><label className="label">URL</label><input className="input" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://github.com/..." /></div>
            <button type="button" onClick={addPortfolio} className="btn-primary flex items-center gap-2"><HiPlus /> Add to Portfolio</button>
          </div>
        )}
      </form>
    </div>
  );
}
