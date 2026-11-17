import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../hooks/usePortfolioData';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Experience', path: '/experience' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#040711]/85 backdrop-blur-xl border-b border-cyan-500/15 py-3.5 shadow-2xl shadow-black/40' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/30 group-hover:border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all">
              <img 
                src="/images/vp-logo.jpg" 
                alt="VP Creations" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent pointer-events-none"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-wider text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5 font-['Outfit']">
                {settings.name || 'VP CREATIONS'}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase -mt-1 font-semibold">
                {settings.tagline || 'WE BUILD YOUR IDEAS'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 rounded-full px-4 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors rounded-full ${
                    active 
                      ? 'text-cyan-300 font-semibold' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-cyan-500/10 border border-cyan-500/30 -z-10 shadow-[0_0_12px_rgba(6,182,212,0.2)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {isAdmin && (
              <Link 
                to="/admin" 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium hover:bg-cyan-900/60 transition-colors"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                Admin
              </Link>
            )}

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all active:scale-[0.98]"
            >
              Let's Talk
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {isAdmin && (
              <Link 
                to="/admin" 
                className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs"
              >
                <ShieldCheck className="w-4 h-4" />
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:text-white hover:border-cyan-500/50 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#050814]/95 backdrop-blur-2xl border-b border-cyan-500/20 px-6 py-6 shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    active 
                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300' 
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"></span>}
                </Link>
              );
            })}

            <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-3">
              <Link
                to="/contact"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                Let's Talk
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/admin/login"
                className="w-full py-2.5 text-center text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
              >
                Admin Access
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
