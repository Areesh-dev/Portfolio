import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SiteContentProvider } from './hooks/useSiteContent.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import AllProjects from './pages/AllProjects.jsx';
import ResumeView from './pages/ResumeView.jsx';
import AllServices from './pages/AllServices.jsx';
import AllSkills from './pages/AllSkills.jsx';
import AllTestimonials from './pages/AllTestimonials.jsx';
import NotFound from './pages/NotFound.jsx';
import Loader from './components/Loader.jsx';

// Wraps every public route in one shared SiteContentProvider so the
// site-wide copy is fetched once and the boot splash shows only on first
// load — not again every time you navigate from the home page to a project.
function PublicLayout() {
  return (
    <SiteContentProvider>
      <Outlet />
    </SiteContentProvider>
  );
}

// The entire admin panel is code-split into its own chunk — public visitors
// never download it, and it only loads when someone actually visits /admin.
const AdminLogin = lazy(() => import('./admin/AdminLogin.jsx'));
const AdminLayout = lazy(() => import('./admin/AdminLayout.jsx'));
const ProtectedRoute = lazy(() => import('./admin/ProtectedRoute.jsx'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard.jsx'));
const AdminServices = lazy(() => import('./admin/AdminServices.jsx'));
const AdminSkills = lazy(() => import('./admin/AdminSkills.jsx'));
const AdminResume = lazy(() => import('./admin/AdminResume.jsx'));
const AdminProjects = lazy(() => import('./admin/AdminProjects.jsx'));
const AdminProjectEditor = lazy(() => import('./admin/AdminProjectEditor.jsx'));
const AdminUpcomingProjects = lazy(() => import('./admin/AdminUpcomingProjects.jsx'));
const AdminReviews = lazy(() => import('./admin/AdminReviews.jsx'));
const AdminEnquiries = lazy(() => import('./admin/AdminEnquiries.jsx'));
const AdminContent = lazy(() => import('./admin/AdminContent.jsx'));
const AdminSettings = lazy(() => import('./admin/AdminSettings.jsx'));

const AdminFallback = () => <Loader label="Loading admin…" className="min-h-screen" />;

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/resume" element={<ResumeView />} />
          <Route path="/services" element={<AllServices />} />
          <Route path="/skills" element={<AllSkills />} />
          <Route path="/testimonials" element={<AllTestimonials />} />
        </Route>

        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            </Suspense>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="resume" element={<AdminResume />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/new" element={<AdminProjectEditor />} />
          <Route path="projects/:id/edit" element={<AdminProjectEditor />} />
          <Route path="upcoming-projects" element={<AdminUpcomingProjects />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
