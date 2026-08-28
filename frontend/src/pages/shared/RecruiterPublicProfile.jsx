import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  HiBriefcase, HiGlobeAlt, HiLocationMarker,
  HiCheckCircle, HiStar, HiArrowLeft, HiMail, HiExternalLink,
  HiClock, HiShieldCheck, HiCurrencyDollar
} from 'react-icons/hi';
import { HiBuildingOffice2 } from 'react-icons/hi2';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function RecruiterPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecruiter();
  }, [id]);

  const fetchRecruiter = async () => {
    setLoading(true);
    try {
      if (id === 'me' || id === currentUser?._id) {
        const { data: myData } = await api.get('/profile/recruiter/me');
        setData({
          recruiter: myData.user,
          jobs: myData.jobs?.filter(j => j.status === 'Open') || [],
          contests: myData.contests || [],
        });
      } else {
        const { data: pubData } = await api.get(`/profile/recruiter/${id}`);
        setData(pubData);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load recruiter profile');
    } finally {
      setLoading(false);
    }
  };

  const startConversation = async (recruiterId) => {
    try {
      const { data: convData } = await api.post('/messages/conversation', { recipientId: recruiterId });
      const basePath = currentUser?.role === 'ADMIN' ? '/admin/messages' : currentUser?.role === 'RECRUITER' ? '/recruiter/messages' : '/candidate/messages';
      navigate(basePath, { state: { conversationId: convData.conversation._id } });
    } catch {
      toast.error('Failed to open message');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center h-64 items-center">
        <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || !data.recruiter) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-gray-400">Recruiter profile not found</p>
        <button onClick={() => navigate(-1)} className="btn-secondary mt-4 text-xs">
          ← Go Back
        </button>
      </div>
    );
  }

  const { recruiter, jobs = [], contests = [] } = data;
  const rp = recruiter.recruiterProfile || {};
  const isOwnProfile = recruiter._id === currentUser?._id;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 text-gray-400 hover:text-white"
        >
          <HiArrowLeft /> Back
        </button>
        {isOwnProfile && (
          <Link to="/recruiter/profile" className="btn-primary text-xs px-3 py-1.5">
            Edit Company Profile
          </Link>
        )}
      </div>

      {/* Main Company & Recruiter Showcase Banner */}
      <div className="card bg-gradient-to-br from-dark-800 via-dark-card to-primary-950/20 border-primary-500/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl bg-primary-800/80 border-2 border-primary-500/50 flex items-center justify-center text-4xl font-bold text-white overflow-hidden shadow-xl flex-shrink-0">
              {rp.companyLogo ? (
                <img src={rp.companyLogo} alt="" className="w-full h-full object-cover" />
              ) : recruiter.profileImage ? (
                <img src={recruiter.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                rp.company?.[0]?.toUpperCase() || recruiter.name?.[0]?.toUpperCase() || <HiBuildingOffice2 />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {rp.company || recruiter.name}
                </h1>
                {recruiter.isVerified && (
                  <span className="badge bg-accent-900/60 text-accent-300 border border-accent-500/40 text-xs flex items-center gap-1 font-bold">
                    <HiShieldCheck className="w-3.5 h-3.5 text-accent-400" /> Verified Partner
                  </span>
                )}
                <span className="badge-primary text-xs">Hiring Company</span>
              </div>

              <p className="text-gray-300 text-sm font-medium">
                {rp.position ? `${rp.position} • ` : ''}<span className="text-white font-semibold">{recruiter.name}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
                {rp.location && (
                  <span className="flex items-center gap-1">
                    <HiLocationMarker className="text-gray-400" /> {rp.location}
                  </span>
                )}
                {rp.companyWebsite && (
                  <a
                    href={rp.companyWebsite.startsWith('http') ? rp.companyWebsite : `https://${rp.companyWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <HiGlobeAlt className="w-3.5 h-3.5" /> {rp.companyWebsite.replace(/^https?:\/\//, '')}
                    <HiExternalLink className="w-3 h-3" />
                  </a>
                )}
                <span className="text-gray-500">Member since {new Date(recruiter.createdAt).getFullYear()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {rp.linkedin && (
              <a
                href={rp.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary p-2.5 rounded-xl text-blue-400 hover:text-white"
                title="LinkedIn Profile"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
            )}
            {rp.twitter && (
              <a
                href={rp.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary p-2.5 rounded-xl text-sky-400 hover:text-white"
                title="Twitter Profile"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
            )}
            {!isOwnProfile && (
              <button
                onClick={() => startConversation(recruiter._id)}
                className="btn-primary flex-1 md:flex-initial py-2.5 px-4 flex items-center justify-center gap-2 shadow-lg shadow-primary-600/30 text-sm font-semibold"
              >
                <HiMail className="w-4 h-4" /> Contact Recruiter
              </button>
            )}
          </div>
        </div>

        {/* Work Details & Hiring Overview */}
        {rp.workDetails ? (
          <div className="mt-6 pt-5 border-t border-dark-border/80">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HiBriefcase className="w-4 h-4 text-primary-400" /> About Company & Work Culture
            </h3>
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line bg-dark-900/40 p-4 rounded-xl border border-dark-border/60">
              {rp.workDetails}
            </p>
          </div>
        ) : (
          <div className="mt-6 pt-5 border-t border-dark-border/80 text-xs text-gray-500 italic">
            This recruiter has not added detailed company overview information yet.
          </div>
        )}
      </div>

      {/* Two Column Layout: Open Positions & Contests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Open Job Posts (2 columns on wide screens) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HiBriefcase className="text-primary-400" /> Open Job Openings ({jobs.length})
            </h2>
          </div>

          {jobs.length === 0 ? (
            <div className="card text-center py-12 border border-dashed border-dark-border text-gray-400">
              No active job vacancies currently open from this recruiter.
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job._id} className="card hover:border-primary-500/40 transition-all space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-white font-bold text-base hover:text-primary-400 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <HiLocationMarker className="text-gray-500" /> {job.isRemote ? 'Remote' : (job.location || 'On-site')}
                        </span>
                        {job.salaryMin && (
                          <span className="flex items-center gap-1 text-accent-400 font-semibold">
                            <HiCurrencyDollar /> {job.salaryMin}k – {job.salaryMax}k {job.salaryCurrency}
                          </span>
                        )}
                        <span>Exp: {job.experienceRequired}+ years</span>
                      </div>
                    </div>

                    <Link
                      to={`/candidate/jobs`}
                      className="btn-primary text-xs px-3 py-1.5 flex-shrink-0"
                    >
                      View on Job Board
                    </Link>
                  </div>

                  <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {job.requirements && job.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.requirements.map((r, i) => (
                        <span key={i} className="badge bg-dark-900 border border-dark-border text-[11px] text-gray-300">
                          {r.stack} L{r.level} ({r.method || 'Both'}) {r.minScore}%+
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hosted Contests / Coding Challenges */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HiStar className="text-yellow-400" /> Coding Contests ({contests.length})
          </h2>

          {contests.length === 0 ? (
            <div className="card text-center py-12 border border-dashed border-dark-border text-gray-400 text-xs">
              No contests hosted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {contests.map((c) => (
                <div key={c._id} className="card p-4 space-y-2 hover:border-yellow-500/30 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-white font-bold text-sm line-clamp-1">{c.title}</h4>
                    <span className={`badge text-[10px] ${c.status === 'active' ? 'badge-success' : 'badge-gray'}`}>
                      {c.status}
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs line-clamp-2">{c.description}</p>

                  <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                    {c.mcqRound?.enabled && (
                      <span className="flex items-center gap-1">
                        <HiClock className="w-3 h-3 text-primary-400" /> {c.mcqRound.timeLimitMinutes}m MCQ
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-yellow-400 font-medium">
                      <HiStar className="w-3 h-3" /> {c.totalCodingMarks || 0} pts
                    </span>
                  </div>

                  {c.status === 'active' && (
                    <Link
                      to={`/candidate/contests/${c._id}/attempt`}
                      className="btn-primary w-full text-center block py-1.5 text-xs font-semibold mt-2"
                    >
                      Participate in Contest →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
