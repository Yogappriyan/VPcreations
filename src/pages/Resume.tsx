import React from 'react';
import { 
  Download, 
  Printer, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  ExternalLink,
  GraduationCap,
  Award,
  Code2,
  Briefcase
} from 'lucide-react';
import { useSettings, useExperience, useProjects } from '../hooks/usePortfolioData';
import { Button } from '../components/common/Button';

export const Resume: React.FC = () => {
  const { settings } = useSettings();
  const { experience } = useExperience();
  const { projects } = useProjects();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-white font-['Outfit']">Official Curriculum Vitae</h1>
            <p className="text-xs text-slate-400 font-mono">
              {settings.personName || 'Vishwa'} • {settings.profession || 'Full Stack Developer & AI Specialist'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500/40 text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              Print / Save PDF
            </button>

            <Button to="/contact" variant="primary" size="sm">
              Contact Me
            </Button>
          </div>
        </div>

        {/* Printable Resume Document Sheet */}
        <div className="p-8 sm:p-14 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl shadow-cyan-950/20 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
          
          {/* Header */}
          <div className="border-b border-slate-800 print:border-black pb-8 mb-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white print:text-black tracking-tight font-['Outfit'] uppercase">
                {settings.personName || 'VISHWA'}
              </h2>
              <p className="text-base sm:text-lg font-mono text-cyan-400 print:text-black font-semibold mt-1">
                {settings.profession || 'Full Stack Developer | AI & Automation Specialist'}
              </p>
              <p className="text-xs text-slate-400 print:text-slate-700 font-mono uppercase tracking-widest mt-1">
                Founder, {settings.name || 'VP Creations'} ({settings.tagline || 'We Build Your Ideas'})
              </p>
            </div>

            <div className="space-y-1.5 text-xs font-mono text-slate-300 print:text-slate-800">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400 print:text-black" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 print:text-black" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 print:text-black" />
                <span>India • Remote Available Worldwide</span>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="mb-8">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 print:text-black mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 print:bg-black"></span>
              Professional Summary
            </h3>
            <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">
              Results-oriented Full Stack Developer with extensive expertise in architecting high-performance e-commerce platforms, modern web applications, and automated enterprise workflows. Proven track record delivering production-grade solutions for retail apparel and digital commerce clients with 100% on-time milestone execution. Skilled in TypeScript, React, Node.js, Firebase, secure payment gateways, and autonomous n8n workflows.
            </p>
          </div>

          {/* Core Technical Competencies */}
          <div className="mb-8">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 print:text-black mb-3 flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5" />
              Technical Competencies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <strong className="text-white print:text-black block mb-1">Frontend Development:</strong>
                <span className="text-slate-300 print:text-slate-700">React.js, TypeScript, Next.js, Tailwind CSS, JavaScript (ES6+), HTML5, CSS3, Responsive UI/UX</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <strong className="text-white print:text-black block mb-1">Backend & Databases:</strong>
                <span className="text-slate-300 print:text-slate-700">Node.js, Express.js, Firebase (Firestore, Auth, Storage), MongoDB, REST APIs</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <strong className="text-white print:text-black block mb-1">Payments & Commerce:</strong>
                <span className="text-slate-300 print:text-slate-700">Razorpay API, Stripe Webhooks, Cart Optimization, Inventory Synchronization, SSL</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <strong className="text-white print:text-black block mb-1">Automation & AI:</strong>
                <span className="text-slate-300 print:text-slate-700">n8n Workflow Automation, Gemini AI API, Chatbots, WhatsApp Business APIs, CI/CD, Git</span>
              </div>
            </div>
          </div>

          {/* Experience & Milestones */}
          <div className="mb-8">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 print:text-black mb-4 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" />
              Professional Experience
            </h3>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-cyan-500/40 print:border-black pl-4 py-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-white print:text-black">{exp.title}</h4>
                    <span className="text-xs font-mono text-cyan-400 print:text-black">{exp.year}</span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 print:text-slate-600 mb-1.5">{exp.role}</p>
                  <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed mb-2">
                    {exp.description}
                  </p>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="text-[11px] font-mono text-slate-400 print:text-slate-600">
                      <strong>Tech:</strong> {exp.technologies.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Projects */}
          <div className="mb-8">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 print:text-black mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 print:bg-black"></span>
              Highlighted Commercial Projects
            </h3>
            <div className="space-y-4">
              {projects.slice(0, 3).map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-xl bg-slate-950/40 print:bg-slate-100 border border-slate-800/80 print:border-slate-300">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-bold text-white print:text-black">{proj.title}</h5>
                    <span className="text-xs font-mono text-cyan-400 print:text-black">{proj.category}</span>
                  </div>
                  <p className="text-xs text-slate-300 print:text-slate-700 mb-2">
                    {proj.shortDescription || proj.description}
                  </p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[11px] font-mono text-slate-400 print:text-slate-600">
                      <strong>Stack:</strong> {proj.technologies.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800 print:border-slate-400">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 print:text-black mb-2 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5" />
                Education
              </h3>
              <div className="text-xs space-y-1">
                <p className="font-bold text-white print:text-black">Bachelor of Technology (B.Tech)</p>
                <p className="text-slate-400 print:text-slate-700 font-mono">Computer Science & Engineering</p>
                <p className="text-slate-500 print:text-slate-600 text-[11px]">Academic focus on Data Structures, Algorithms, Cloud Computing, and Software Engineering.</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 print:text-black mb-2 flex items-center gap-2">
                <Award className="w-3.5 h-3.5" />
                Certifications
              </h3>
              <ul className="text-xs space-y-1.5 text-slate-300 print:text-slate-800">
                <li className="flex items-center gap-1.5">
                  <span className="text-cyan-400 print:text-black">•</span>
                  Full Stack Web Development (MERN & React Ecosystem)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-cyan-400 print:text-black">•</span>
                  Cloud Architecture & Firebase Database Administration
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-cyan-400 print:text-black">•</span>
                  n8n Advanced Workflow Automation & AI Orchestration
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
