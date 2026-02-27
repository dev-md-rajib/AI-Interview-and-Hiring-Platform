import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Candidate pages (lazy loaded)
const CandidateDashboard = lazy(() => import('./pages/candidate/Dashboard'));
const CandidateProfile = lazy(() => import('./pages/candidate/Profile'));
const EditProfile = lazy(() => import('./pages/candidate/EditProfile'));
const InterviewStart = lazy(() => import('./pages/candidate/InterviewStart'));
const InterviewRoom = lazy(() => import('./pages/candidate/InterviewRoom'));
const InterviewResult = lazy(() => import('./pages/candidate/InterviewResult'));
const JobBoard = lazy(() => import('./pages/candidate/JobBoard'));
const MyApplications = lazy(() => import('./pages/candidate/MyApplications'));
const MyInterviews = lazy(() => import('./pages/candidate/MyInterviews'));

// Recruiter pages (lazy loaded)
const RecruiterDashboard = lazy(() => import('./pages/recruiter/Dashboard'));
const PostJob = lazy(() => import('./pages/recruiter/PostJob'));
const MyJobs = lazy(() => import('./pages/recruiter/MyJobs'));
const CandidateSearch = lazy(() => import('./pages/recruiter/CandidateSearch'));
const CandidateView = lazy(() => import('./pages/recruiter/CandidateView'));
const JobApplications = lazy(() => import('./pages/recruiter/JobApplications'));

// Admin pages (lazy loaded)
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const LevelManager = lazy(() => import('./pages/admin/LevelManager'));
const QuestionBank = lazy(() => import('./pages/admin/QuestionBank'));
const UserManager = lazy(() => import('./pages/admin/UserManager'));

// Shared pages
const Messages = lazy(() => import('./pages/shared/Messages'));
const NotFound = lazy(() => import('./pages/NotFound'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-900">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }
  return children;
};

const getDefaultRoute = (role) => {
  if (role === 'ADMIN') return '/admin';
  if (role === 'RECRUITER') return '/recruiter';
  return '/candidate';
};

// Public route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to={getDefaultRoute(user.role)} replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* Candidate routes */}
            <Route path="/candidate" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<CandidateDashboard />} />
              <Route path="profile" element={<CandidateProfile />} />
              <Route path="profile/edit" element={<EditProfile />} />
              <Route path="interview" element={<InterviewStart />} />
              <Route path="interview/:id" element={<InterviewRoom />} />
              <Route path="interview/:id/result" element={<InterviewResult />} />
              <Route path="jobs" element={<JobBoard />} />
              <Route path="applications" element={<MyApplications />} />
              <Route path="history" element={<MyInterviews />} />
              <Route path="messages" element={<Messages />} />
            </Route>

            {/* Recruiter routes */}
            <Route path="/recruiter" element={<ProtectedRoute allowedRoles={['RECRUITER']}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<RecruiterDashboard />} />
              <Route path="jobs/new" element={<PostJob />} />
              <Route path="jobs" element={<MyJobs />} />
              <Route path="jobs/:id/edit" element={<PostJob />} />
              <Route path="jobs/:id/applications" element={<JobApplications />} />
              <Route path="candidates" element={<CandidateSearch />} />
              <Route path="candidates/:id" element={<CandidateView />} />
              <Route path="messages" element={<Messages />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="levels" element={<LevelManager />} />
              <Route path="questions" element={<QuestionBank />} />
              <Route path="users" element={<UserManager />} />
              <Route path="candidates" element={<CandidateSearch />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
