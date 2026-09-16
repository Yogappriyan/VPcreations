import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Download, 
  Sparkles, 
  CheckCircle, 
  Code2, 
  Cpu, 
  Zap, 
  ExternalLink,
  MessageCircle,
  Briefcase
} from 'lucide-react';
import { 
  useProjects, 
  useSkills, 
  useTestimonials, 
  useSettings 
} from '../hooks/usePortfolioData';
import { Button } from '../components/common/Button';
import { SectionHeader } from '../components/common/SectionHeader';
import { TechMarquee } from '../components/common/TechMarquee';
import { ProjectCard } from '../components/cards/ProjectCard';
import { SkillCard } from '../components/cards/SkillCard';
import { TestimonialCard } from '../components/cards/TestimonialCard';
import { ProcessSection } from '../components/common/ProcessSection';
import { ContactForm } from '../components/forms/ContactForm';

export const Home: React.FC = () => {
  const { settings } = useSettings();
  const { projects } = useProjects();
  const { skills } = useSkills();
  const { testimonials } = useTestimonials();

  // Featured items
  const featuredProjects = projects.filter(p => p.featured).slice(0, 6);
  const highlightSkills = skills.slice(0, 8);

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    "Hi Vishwam, I found VP Creations and would like to discuss a website/project."
  )}`;

  return (
    <div className="min-h-screen">
      
      {/* ================================================== */}
      {/* 5. HERO SECTION */}
      {/* ================================================== */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background glow meshes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Centered Hero Content */}
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center space-y-6">
            
            {/* Brand Chip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.2)] mx-auto">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              VP CREATIONS • WE BUILD YOUR IDEAS
            </div>

            {/* Sub-heading / Greeting */}
            <div className="space-y-2 text-center">
              <h2 className="text-xl sm:text-2xl font-mono text-slate-300 tracking-wide font-medium">
                HI, I'M{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 font-bold">
                  VISHWAM KUMAR
                </span>
              </h2>
              <p className="text-xs sm:text-sm font-mono tracking-widest text-cyan-400 font-semibold uppercase">
                A FULL STACK DEVELOPER
              </p>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] font-['Outfit'] text-center">
              I TURN IDEAS INTO<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 underline decoration-cyan-500/30 underline-offset-8">
                DIGITAL EXPERIENCES.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto text-center">
              I build modern websites, web applications and digital solutions that help businesses grow. 
              Clean design, powerful functionality and real-world impact — that's what I create.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button to="/projects" variant="primary" size="lg">
                VIEW MY WORK
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button to="/resume" variant="secondary" size="lg">
                <Download className="w-4 h-4 text-cyan-400" />
                DOWNLOAD RESUME
              </Button>

              <Button to="/contact" variant="outline" size="lg">
                LET'S TALK
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick WhatsApp pill */}
            <div className="pt-1 flex justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Available for new projects • Direct WhatsApp consultation →
              </a>
            </div>

          </div>

          {/* Centered Workspace Visual Showcase */}
          <div className="mt-14 max-w-4xl mx-auto relative">
            <div className="relative rounded-3xl p-2.5 bg-gradient-to-b from-cyan-500/30 via-slate-800 to-blue-600/20 shadow-2xl shadow-cyan-950/60">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[16/9] sm:aspect-[21/9] md:aspect-[16/8]">
                <img
                  src="/images/hero-workspace.jpg"
                  alt="Vishwam Kumar Software Workspace"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

                {/* Integrated Logo Watermark */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md">
                  <div className="w-5 h-5 rounded-md overflow-hidden">
                    <img src="https://i.postimg.cc/WzcNTVqV/VP-logo.png" alt="VP" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-white tracking-wider">VP CREATIONS</span>
                </div>

                {/* Active Status Badge */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md flex items-center justify-between sm:justify-start gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-mono text-slate-200">Architecture & Deploy Ready</span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold">Full-Stack & AI</span>
                </div>
              </div>
            </div>

            {/* Floating Metric 1 */}
            <div className="absolute -bottom-6 -left-4 sm:left-6 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-xl shadow-cyan-950/40">
              <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-base font-bold text-white font-mono">100% Client Score</div>
                <div className="text-[11px] text-slate-400 font-mono">Verified Satisfaction</div>
              </div>
            </div>

            {/* Floating Metric 2 */}
            <div className="absolute -top-6 -right-4 sm:right-6 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-xl shadow-cyan-950/40">
              <div className="p-2.5 rounded-xl bg-blue-950 border border-blue-500/40 text-sky-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-base font-bold text-white font-mono">Production Grade</div>
                <div className="text-[11px] text-slate-400 font-mono">Scalable Cloud Systems</div>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* Below Hero: Statistics */}
          {/* ================================================== */}
          <div className="mt-16 md:mt-24 pt-10 border-t border-slate-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/40 transition-all text-center group">
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400 font-['Outfit'] group-hover:scale-105 transition-transform duration-200 inline-block">
                  10+
                </div>
                <div className="text-sm font-semibold text-slate-200 mt-2">Projects Completed</div>
                <div className="text-xs text-slate-400 font-mono mt-1">E-Commerce & Custom Web Apps</div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/40 transition-all text-center group">
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400 font-['Outfit'] group-hover:scale-105 transition-transform duration-200 inline-block">
                  3+
                </div>
                <div className="text-sm font-semibold text-slate-200 mt-2">Happy Clients</div>
                <div className="text-xs text-slate-400 font-mono mt-1">Retained Business Partners</div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/40 transition-all text-center group">
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400 font-['Outfit'] group-hover:scale-105 transition-transform duration-200 inline-block">
                  100%
                </div>
                <div className="text-sm font-semibold text-slate-200 mt-2">Client Satisfaction</div>
                <div className="text-xs text-slate-400 font-mono mt-1">On-Time & Pixel-Perfect Delivery</div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 6. TRUST / TECHNOLOGY MARQUEE STRIP */}
      {/* ================================================== */}
      <TechMarquee />

      {/* ================================================== */}
      {/* 7. DEVELOPMENT PROCESS ("ENGINEERED FOR PRECISION") */}
      {/* ================================================== */}
      <ProcessSection />

      {/* ================================================== */}
      {/* 9. FEATURED PROJECTS ("FEATURED PROJECTS") */}
      {/* ================================================== */}
      <section className="py-24 relative bg-[#030612]/60 border-y border-cyan-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-widest uppercase mb-4 bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              FEATURED PROJECTS
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight font-['Outfit']">
              REAL PROJECTS.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">
                REAL IMPACT.
              </span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Production-grade e-commerce solutions, high-speed web platforms, and automated systems built for scalability and performance.
            </p>
          </div>

          {featuredProjects.length === 0 ? (
            <div className="text-center py-16 text-slate-400 font-mono">
              No projects available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <Button to="/projects" variant="outline" size="lg">
              View All Projects ({projects.length})
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SKILLS HIGHLIGHT */}
      {/* ================================================== */}
      <section className="py-24 relative bg-[#02040c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="TECHNICAL ARSENAL"
            title="CORE TECHNOLOGIES &"
            highlight="EXPERTISE"
            description="Modern, industry-tested technologies selected for maximum speed, maintainability, and scalability."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlightSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button to="/skills" variant="secondary" size="md">
              View Complete Categorized Skills Matrix →
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* CLIENT TESTIMONIALS */}
      {/* ================================================== */}
      <section className="py-24 relative border-t border-cyan-500/15 bg-[#030612]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="CLIENT TESTIMONIALS"
            title="TRUSTED BY"
            highlight="GROWING BUSINESSES"
            description="Direct feedback from brand founders and business owners who entrusted VP Creations with their digital vision."
          />

          {testimonials.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-mono">
              Client stories coming soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((test) => (
                <TestimonialCard key={test.id} testimonial={test} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================================================== */}
      {/* CONTACT CTA BANNER & FORM */}
      {/* ================================================== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Centered CTA Header Content */}
          <div className="text-center max-w-3xl mx-auto space-y-5 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-widest uppercase bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              READY TO START?
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight font-['Outfit']">
              LET'S BUILD SOMETHING{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">
                GREAT TOGETHER.
              </span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Have a project in mind? Whether you need a high-converting e-commerce platform, 
              a bespoke web application, or automated enterprise workflows, let's turn your idea into reality.
            </p>

            {/* Centered Contact Quick Links */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4 font-mono text-sm">
              <div className="flex items-center gap-2 text-slate-300 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-cyan-400 font-bold">Phone:</span>
                <a href={`tel:${settings.phone}`} className="hover:text-cyan-300 transition-colors font-bold">
                  {settings.phone}
                </a>
              </div>

              <div className="flex items-center gap-2 text-slate-300 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-cyan-400 font-bold">Email:</span>
                <a href={`mailto:${settings.email}`} className="hover:text-cyan-300 transition-colors">
                  {settings.email}
                </a>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                CHAT DIRECTLY ON WHATSAPP
              </a>
            </div>
          </div>

          {/* Centered Contact Form Container */}
          <div className="max-w-3xl mx-auto">
            <ContactForm />
          </div>

        </div>
      </section>

    </div>
  );
};
