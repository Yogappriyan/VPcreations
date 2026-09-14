import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloatingButton } from './components/common/WhatsAppButton';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Skills } from './pages/Skills';
import { Experience } from './pages/Experience';
import { Resume } from './pages/Resume';
import { Contact } from './pages/Contact';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

// Protected Route for Admin Dashboard
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-400 font-mono text-sm">
        Verifying authorization...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// 404 Not Found Page
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen pt-40 pb-24 flex flex-col items-center justify-center text-center px-4">
    <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-['Outfit'] mb-4">
      404
    </div>
    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-['Outfit']">Page Not Found</h1>
    <p className="text-slate-400 max-w-md mb-8 text-sm">
      The digital experience or route you are looking for has been relocated or does not exist.
    </p>
    <a
      href="/"
      className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] text-sm transition-all"
    >
      Return to VP Creations Homepage
    </a>
  </div>
);

// Layout wrapper to conditionally show/hide Navbar and Footer for clean admin view
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="flex flex-col min-h-screen bg-[#040711] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {!isAdminDashboard && <Footer />}
      {!isAdminDashboard && <WhatsAppFloatingButton />}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/implementation" element={<Navigate to="/projects" replace />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Authentication & Panel */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
