import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Linkedin, 
  Github, 
  Instagram, 
  Mail, 
  Phone, 
  ArrowUpRight, 
  MessageCircle,
  Sparkles,
  Heart
} from 'lucide-react';
import { useSettings } from '../../hooks/usePortfolioData';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Experience', path: '/experience' },
    { name: 'Resume', path: '/resume' },
    { name: 'Contact', path: '/contact' },
  ];

  const serviceLinks = [
    { name: 'Website Development', path: '/services/website-development' },
    { name: 'E-Commerce Development', path: '/services/e-commerce-development' },
    { name: 'Web Applications', path: '/services/web-mobile-applications' },
    { name: 'AI Integration', path: '/services/ai-integration' },
    { name: 'Automation & n8n', path: '/services/automation-n8n' },
  ];

  // WhatsApp link with encoded message
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    "Hi Vishwam, I found VP Creations and would like to discuss a website/project."
  )}`;

  return (
    <footer className="relative bg-[#03050c] border-t border-cyan-500/15 pt-16 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-block">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <img src="https://i.postimg.cc/WzcNTVqV/VP-logo.png" alt="VP Creations" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-wider text-white font-['Outfit']">
                  VP CREATIONS
                </span>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                  WE BUILD YOUR IDEAS
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              VP Creations is the premier software and digital studio founded by Vishwam Kumar. 
              Engineering high-converting e-commerce, custom web apps, and intelligent automation systems.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 flex items-center justify-center transition-all"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 flex items-center justify-center transition-all"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 flex items-center justify-center transition-all"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 flex items-center justify-center transition-all"
                title="WhatsApp Direct"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 flex items-center justify-center transition-all"
                title="Email Me"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider font-mono mb-4 text-cyan-400">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="text-cyan-500/40 group-hover:text-cyan-400 transition-colors">›</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider font-mono mb-4 text-cyan-400">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {serviceLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="text-cyan-500/40 group-hover:text-cyan-400 transition-colors">›</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider font-mono mb-4 text-cyan-400">
              Get In Touch
            </h4>
            
            <a 
              href={`tel:${settings.phone}`}
              className="flex items-center gap-2.5 text-slate-300 hover:text-cyan-300 text-sm transition-colors group"
            >
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-cyan-500/40">
                <Phone className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-mono">{settings.phone}</span>
            </a>

            <a 
              href={`mailto:${settings.email}`}
              className="flex items-center gap-2.5 text-slate-300 hover:text-cyan-300 text-sm transition-colors group"
            >
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-cyan-500/40">
                <Mail className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="truncate max-w-[180px] font-mono">{settings.email}</span>
            </a>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 hover:bg-emerald-900/60 hover:border-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {currentYear} VP Creations. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="hover:text-cyan-400 transition-colors">
              Admin Portal
            </Link>
            <span>•</span>
            <span className="text-slate-400">Architected by Vishwam Kumar</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
