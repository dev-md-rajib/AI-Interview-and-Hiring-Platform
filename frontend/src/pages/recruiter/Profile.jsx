import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  HiBriefcase, HiGlobeAlt, HiLocationMarker,
  HiCheckCircle, HiStar, HiEye, HiSave, HiExternalLink,
  HiUser, HiDocumentText, HiMail
} from 'react-icons/hi';
import { HiBuildingOffice2 } from 'react-icons/hi2';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function RecruiterProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [contests, setContests] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    profileImage: '',
    company: '',
    position: '',
    workDetails: '',
    location: '',
    companyWebsite: '',
    companyLogo: '',
    linkedin: '',
    twitter: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/profile/recruiter/me');
      const user = data.user || {};
      const rp = user.recruiterProfile || {};
      
      setFormData({
        name: user.name || '',
        profileImage: user.profileImage || '',
        company: rp.company || '',
        position: rp.position || '',
        workDetails: rp.workDetails || '',
        location: rp.location || '',
        companyWebsite: rp.companyWebsite || '',
        companyLogo: rp.companyLogo || '',
        linkedin: rp.linkedin || '',
        twitter: rp.twitter || '',
      });
      setJobs(data.jobs || []);
      setContests(data.contests || []);
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        profileImage: formData.profileImage,
        recruiterProfile: {
          company: formData.company,
          position: formData.position,
          workDetails: formData.workDetails,
          location: formData.location,
          companyWebsite: formData.companyWebsite,
          companyLogo: formData.companyLogo,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        },
      };

      await api.put('/profile/recruiter/me', payload);
      toast.success('Company profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center h-64 items-center">
        <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="card bg-gradient-to-r from-dark-800 via-dark- card to-primary-950/30 border-primary-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary-700 border-2 border-primary-500/50 flex items-center justify-center text-3xl font-bold text-white overflow-hidden shadow-lg flex-shrink-0">
              {formData.companyLogo ? (
                <img src={formData.companyLogo} alt="" className="w-full h-full object-cover" />
              ) : formData.profileImage ? (
                <img src={formData.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                formData.company?.[0]?.toUpperCase() || formData.name?.[0]?.toUpperCase() || <HiBuildingOffice2 />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{formData.company || formData.name || 'Company Profile'}</h1>
                <span className="badge-primary text-xs">Recruiter</span>
              </div>
              <p className="text-gray-400 text-sm mt-0.5">
                {formData.position ? `${formData.position} • ` : ''}{formData.name}
              </p>
              {formData.location && (
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                  <HiLocationMarker className="w-3.5 h-3.5 text-gray-400" /> {formData.location}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/candidate/recruiters/me`}
              className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 hover:text-white"
              title="Preview how candidates see your profile"
            >
              <HiEye className="w-4 h-4 text-primary-400" /> Preview as Candidate
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 shadow-md shadow-primary-600/20"
            >
              <HiSave className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center p-4">
          <p className="text-gray-400 text-xs font-semibold uppercase">Active Jobs</p>
          <p className="text-2xl font-bold text-white mt-1">{jobs.filter(j => j.status === 'Open').length}</p>
        </div>
        <div className="card text-center p-4">
          <p className="text-gray-400 text-xs font-semibold uppercase">Total Jobs Posted</p>
          <p className="text-2xl font-bold text-primary-400 mt-1">{jobs.length}</p>
        </div>
        <div className="card text-center p-4">
          <p className="text-gray-400 text-xs font-semibold uppercase">Active Contests</p>
          <p className="text-2xl font-bold text-accent-400 mt-1">{contests.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="card text-center p-4">
          <p className="text-gray-400 text-xs font-semibold uppercase">Total Contests</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{contests.length}</p>
        </div>
      </div>

      {/* Main Edit Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Company Details */}
          <div className="card space-y-4">
            <h2 className="section-title flex items-center gap-2">
              <HiBuildingOffice2 className="w-5 h-5 text-primary-400" /> Company & Role Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Company Name *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Google, Stripe, Acme Corp"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label">Your Position / Title *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Senior Tech Recruiter, Head of Talent"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label">Company Website URL</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://example.com"
                  value={formData.companyWebsite}
                  onChange={(e) => handleChange('companyWebsite', e.target.value)}
                />
              </div>

              <div>
                <label className="label">Office / Hiring Location</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. San Francisco, CA / Remote"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label">Company Logo Image URL</label>
              <input
                type="url"
                className="input"
                placeholder="https://example.com/logo.png"
                value={formData.companyLogo}
                onChange={(e) => handleChange('companyLogo', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Provide a direct link to your company logo (PNG/SVG recommended).</p>
            </div>
          </div>

          {/* Work Details / About */}
          <div className="card space-y-4">
            <h2 className="section-title flex items-center gap-2">
              <HiBriefcase className="w-5 h-5 text-primary-400" /> Work Details & Hiring Culture
            </h2>
            <p className="text-xs text-gray-400">
              Tell candidates about your company's mission, engineering culture, interview process, and what qualities you value most.
            </p>
            <textarea
              className="input h-36 resize-y"
              placeholder="e.g., We are building the next-generation AI infrastructure. Our team values problem-solving abilities, clean code architecture, and proactive collaboration. In our hiring process, we look for candidates who pass verified level benchmarks and demonstrate strong domain fundamentals."
              value={formData.workDetails}
              onChange={(e) => handleChange('workDetails', e.target.value)}
            />
          </div>

          {/* Social Links */}
          <div className="card space-y-4">
            <h2 className="section-title flex items-center gap-2">
              <HiGlobeAlt className="w-5 h-5 text-primary-400" /> Social & Professional Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-1.5">
                  <FaLinkedin className="text-blue-400" /> LinkedIn Profile / Page
                </label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                />
              </div>
              <div>
                <label className="label flex items-center gap-1.5">
                  <FaTwitter className="text-sky-400" /> Twitter / X Profile
                </label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://twitter.com/username"
                  value={formData.twitter}
                  onChange={(e) => handleChange('twitter', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info & Personal Details */}
        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="section-title flex items-center gap-2">
              <HiUser className="w-5 h-5 text-primary-400" /> Recruiter Account
            </h2>
            
            <div>
              <label className="label">Recruiter Full Name</label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Profile Picture URL</label>
              <input
                type="url"
                className="input"
                placeholder="https://example.com/avatar.jpg"
                value={formData.profileImage}
                onChange={(e) => handleChange('profileImage', e.target.value)}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 shadow-lg shadow-primary-600/30"
              >
                <HiSave className="w-4 h-4" />
                {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/recruiter/jobs/new" className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-1.5 text-gray-300 hover:text-white">
                <HiDocumentText className="w-4 h-4 text-primary-400" /> Post New Job
              </Link>
              <Link to="/recruiter/contests/new" className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-1.5 text-gray-300 hover:text-white">
                <HiStar className="w-4 h-4 text-yellow-400" /> Create Contest
              </Link>
              <Link to="/recruiter/candidates" className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-1.5 text-gray-300 hover:text-white">
                <HiBriefcase className="w-4 h-4 text-accent-400" /> Search Candidates
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
