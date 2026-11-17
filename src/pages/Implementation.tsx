import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  FileCode2, 
  Code2, 
  Rocket, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Server,
  Database,
  CreditCard,
  Cloud,
  Workflow,
  Sparkles,
  Smartphone,
  Gauge,
  Lock
} from 'lucide-react';
import { useProjects } from '../hooks/usePortfolioData';
import { TechnologyBadge } from '../components/common/TechnologyBadge';
import { Button } from '../components/common/Button';
import { normalizeUrl } from '../lib/utils';

export const Implementation: React.FC = () => {
  const { projects } = useProjects();

  const coreTechnologies = [
    'HTML5',
    'CSS3',
    'JavaScript',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Node.js',
    'MongoDB',
    'Firebase',
    'Razorpay',
    'n8n',
    'WhatsApp API'
  ];

  const methodologyPhases = [
    {
      phase: "01",
      name: "DISCOVERY & SPECIFICATION",
      tagline: "Architecture from first principles",
      icon: <Lightbulb className="w-6 h-6 text-amber-400" />,
      bullets: [
        "Brand identity alignment & user journey mapping",
        "Technical requirements analysis & SKU scalability sizing",
        "API contract design & third-party dependency review",
        "Deliverable milestones with clear client sign-offs"
      ]
    },
    {
      phase: "02",
      name: "DESIGN SYSTEM & PROTOTYPING",
      tagline: "High-contrast, mobile-first design",
      icon: <FileCode2 className="w-6 h-6 text-cyan-400" />,
      bullets: [
        "Tailwind CSS custom design token configuration",
        "Desktop browser frames and mobile thumb-zone wireframes",
        "Micro-animations with silky Motion page transitions",
        "High-resolution image optimization pipelines (WebP)"
      ]
    },
    {
      phase: "03",
      name: "FULL-STACK ENGINEERING",
      tagline: "Modern TypeScript & clean architecture",
      icon: <Code2 className="w-6 h-6 text-blue-400" />,
      bullets: [
        "Modular React 18 component structure with strict type-safety",
        "Fast Express & Node.js backend with data validation",
        "Optimized MongoDB indexing for sub-15ms catalog queries",
        "Client-side state caching and instant search filters"
      ]
    },
    {
      phase: "04",
      name: "PAYMENTS & AUTOMATION",
      tagline: "Secure checkout & real-time alerts",
      icon: <CreditCard className="w-6 h-6 text-purple-400" />,
      bullets: [
        "Razorpay Standard and Custom checkout integration",
        "HMAC SHA-256 webhook signature verification for payments",
        "Automated WhatsApp Business API order receipts",
        "n8n CRM synchronization and PDF invoice generation"
      ]
    },
    {
      phase: "05",
      name: "DEPLOYMENT & PRODUCTION",
      tagline: "Edge CDN & Core Web Vitals optimization",
      icon: <Rocket className="w-6 h-6 text-emerald-400" />,
      bullets: [
        "Edge CDN distribution for global sub-second TTFB",
        "95+ Google Lighthouse mobile performance score audit",
        "SSL/TLS automated certificate provisioning",
        "Post-launch telemetry and maintenance handover"
      ]
    }
  ];

  const architecturalPillars = [
    {
      icon: <Gauge className="w-6 h-6 text-cyan-400" />,
      title: "Sub-Second Speed",
      desc: "Static site generation and edge caching guarantee page loads under 0.8 seconds even on mobile 4G."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-blue-400" />,
      title: "100% Mobile Optimized",
      desc: "Every button, filter, drawer, and modal is engineered specifically for thumb zones and touch gestures."
    },
    {
      icon: <Lock className="w-6 h-6 text-purple-400" />,
      title: "Enterprise Grade Security",
      desc: "End-to-end HTTPS encryption, webhook cryptographic verification, and zero client-side secret exposure."
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Automated Workflows",
      desc: "Eliminate manual tasks with instant WhatsApp order updates, automated billing, and CRM syncing."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            ENGINEERING & IMPLEMENTATION ARCHITECTURE
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 font-['Outfit']">
            HOW WE IMPLEMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">DIGITAL IDEAS</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            At VP Creations, we don't just write code — we engineer scalable, high-converting digital products. Explore our battle-tested implementation methodology, architectural standards, and production project case studies.
          </p>
        </div>

        {/* Core Technology Stack Grid */}
        <div className="mb-20 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1">
              PRODUCTION TECH STACK
            </span>
            <h2 className="text-2xl font-bold text-white font-['Outfit']">
              Modern, Proven Technologies
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Industry-standard tools selected for speed, developer velocity, and bulletproof security.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
            {coreTechnologies.map((tech) => (
              <div 
                key={tech}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all hover:scale-105"
              >
                <TechnologyBadge name={tech} variant="icon" size="sm" />
                <span className="text-xs sm:text-sm font-mono font-medium text-slate-200">
                  {tech}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Phase Implementation Blueprint */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-2">
              THE 5-PHASE LIFECYCLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
              From Concept to Production Launch
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              A systematic 5-stage blueprint that guarantees high quality, transparent milestones, and zero post-launch bugs.
            </p>
          </div>

          <div className="space-y-6">
            {methodologyPhases.map((phase) => (
              <div 
                key={phase.phase}
                className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
              >
                <div className="flex items-center gap-4 shrink-0">
                  <span className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-mono text-lg font-bold flex items-center justify-center">
                    {phase.phase}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors font-['Outfit']">
                      {phase.name}
                    </h3>
                    <p className="text-xs font-mono text-cyan-400/90">
                      {phase.tagline}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 max-w-2xl">
                  {phase.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shrink-0 hidden lg:block text-slate-400 group-hover:text-cyan-400 transition-colors">
                  {phase.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Project Implementations Section */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-2">
              REAL CLIENT EXECUTIONS
            </span>
            <h2 className="text-3xl font-black text-white font-['Outfit']">
              Explore Project Implementations
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Deep dive into the architecture, challenges, and measurable results for each implemented client system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj) => (
              <div 
                key={proj.id}
                className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                      {proj.category}
                    </span>
                    {proj.subtitle && (
                      <span className="text-xs font-mono text-slate-400">
                        {proj.subtitle}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 font-['Outfit']">
                    {proj.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                    {proj.shortDescription || proj.description}
                  </p>

                  {/* Architecture snapshot */}
                  {proj.architecture && (
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-5 space-y-2">
                      {proj.architecture.frontend && (
                        <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5" />
                          <span>Frontend: {proj.architecture.frontend.split('with')[0]}</span>
                        </div>
                      )}
                      {proj.architecture.payments && (
                        <div className="text-[11px] font-mono text-blue-300 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Payments: {proj.architecture.payments.split('with')[0]}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Key Badges */}
                  <div className="flex items-center gap-2 mb-6">
                    {(proj.keyBadges || (proj.technologies || []).slice(0, 4)).map((t) => (
                      <TechnologyBadge key={t} name={t} variant="icon" size="sm" />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <Link
                    to={`/projects/${proj.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    View Implementation Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {normalizeUrl(proj.liveUrl) && (
                    <a
                      href={normalizeUrl(proj.liveUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Four Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {architecturalPillars.map((pillar, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4">
                {pillar.icon}
              </div>
              <h4 className="text-base font-bold text-white mb-2 font-['Outfit']">
                {pillar.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-blue-950/40 border border-cyan-500/30 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-4xl font-black text-white font-['Outfit']">
              Ready to Implement Your Digital Project?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Let's build your e-commerce storefront, web application, or custom business automation with modern standards and flawless execution.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Button to="/contact" variant="primary" size="lg">
                Discuss Your Requirements
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button to="/projects" variant="secondary" size="lg">
                Browse All Projects
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
