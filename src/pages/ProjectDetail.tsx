import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Target,
  Zap,
  Layers,
  Globe,
  ShieldCheck,
  Server,
  Database,
  CreditCard,
  Cloud,
  Code2,
  Workflow,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useProjects } from '../hooks/usePortfolioData';
import { defaultProjects } from '../data/defaultData';
import { TechnologyBadge } from '../components/common/TechnologyBadge';
import { Button } from '../components/common/Button';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { projects } = useProjects();
  const navigate = useNavigate();

  const activeProjects = (projects && projects.length > 0) ? projects : defaultProjects;
  const projectIndex = activeProjects.findIndex((p) => p.slug === slug || p.id === slug);
  const project = projectIndex !== -1 
    ? activeProjects[projectIndex] 
    : defaultProjects.find((p) => p.slug === slug || p.id === slug) || null;

  const nextProject = projectIndex !== -1 && projectIndex < activeProjects.length - 1
    ? activeProjects[projectIndex + 1]
    : activeProjects[0];

  if (!project) {
    return (
      <div className="min-h-screen pt-40 pb-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
        <p className="text-slate-400 mb-6">The requested case study could not be located.</p>
        <Button to="/projects" variant="primary">
          Back to Projects
        </Button>
      </div>
    );
  }

  const browserTabTitle = project.browserUrl || project.title;
  const subtitle = project.subtitle || (project.category === 'E-Commerce' ? 'Ecommerce Website' : `${project.category} Application`);

  const displayBadges = project.keyBadges && project.keyBadges.length > 0
    ? project.keyBadges
    : ['HTML5', 'CSS3', 'JavaScript', ...(project.technologies.includes('MongoDB') ? ['MongoDB'] : project.technologies.includes('Node.js') ? ['Node.js'] : [])];

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Projects Portfolio
          </Link>
        </div>

        {/* Case Study Header Banner */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800">
              {subtitle}
            </span>
            {project.clientType && (
              <span className="text-xs font-mono text-slate-400">
                Client: <span className="text-slate-200">{project.clientType}</span>
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-['Outfit']">
              {project.title}
            </h1>

            {/* Quick Iconic Tech Badges from Image */}
            <div className="flex items-center gap-2.5">
              {displayBadges.map((tech) => (
                <TechnologyBadge 
                  key={tech} 
                  name={tech} 
                  variant="icon" 
                  size="lg" 
                />
              ))}
            </div>
          </div>

          <p className="text-base md:text-xl text-slate-300 leading-relaxed max-w-4xl">
            {project.shortDescription || project.description}
          </p>

          {/* Action Links */}
          <div className="pt-2 flex flex-wrap gap-4 items-center">
            {project.liveUrl && (
              <Button href={project.liveUrl} variant="primary" size="md">
                <ExternalLink className="w-4 h-4" />
                Live Website
              </Button>
            )}

            {project.githubUrl && (
              <Button href={project.githubUrl} variant="secondary" size="md">
                <Github className="w-4 h-4 text-slate-300" />
                View Source Repository
              </Button>
            )}

            <Button to="/contact" variant="outline" size="md">
              Inquire Similar Project
            </Button>
          </div>
        </div>

        {/* Primary Desktop Browser Frame Artwork (Matching Reference Image) */}
        <div className="rounded-3xl overflow-hidden bg-slate-950 border border-slate-800/90 mb-16 shadow-2xl shadow-cyan-950/40 flex flex-col">
          {/* Top Browser Chrome Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/95 border-b border-slate-800/80 select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/90 border border-rose-600"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/90 border border-amber-600"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/90 border border-emerald-600"></span>
            </div>

            <div className="flex items-center gap-2 px-4 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>{project.liveUrl || `https://${project.slug}.vpcreations.dev`}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">SSL Secure</span>
            </div>
          </div>

          {/* Banner Display Preview */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-slate-950 overflow-hidden">
            <img
              src={project.image || '/images/hero-workspace.jpg'}
              alt={project.title}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/hero-workspace.jpg';
              }}
            />

            {project.bannerHeadline && (
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent p-6 sm:p-10 flex flex-col justify-end">
                <span className="text-white font-black text-2xl sm:text-4xl font-['Outfit'] drop-shadow-md">
                  {project.bannerHeadline}
                </span>
                {project.bannerSubheadline && (
                  <span className="text-cyan-300 font-mono text-sm sm:text-base mt-1 drop-shadow-sm">
                    {project.bannerSubheadline}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Metrics Bar if available */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {project.metrics.map((m, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-center flex flex-col items-center justify-center"
              >
                <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-['Outfit'] mb-1">
                  {m.value}
                </span>
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wide mb-1">
                  {m.label}
                </span>
                <span className="text-[11px] text-slate-400 leading-tight">
                  {m.desc}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Case Study Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          
          {/* Main narrative */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Overview */}
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-['Outfit']">
                <Layers className="w-5 h-5 text-cyan-400" />
                Project Overview & Execution Scope
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                {project.description}
              </p>
            </div>

            {/* Problem & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Problem */}
              <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center gap-2.5 text-rose-400 font-mono text-xs font-bold uppercase mb-3">
                  <AlertCircle className="w-4 h-4" />
                  The Business Problem
                </div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {project.problem || 'Client lacked a modern, performant web presence capable of handling high-volume consumer traffic without latency or cart abandonment.'}
                </p>
              </div>

              {/* Solution */}
              <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-xs font-bold uppercase mb-3">
                  <Sparkles className="w-4 h-4" />
                  The Engineered Solution
                </div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {project.solution || 'Engineered a bespoke React frontend coupled with high-speed API middleware, instant payment reconciliation, and automated notification webhooks.'}
                </p>
              </div>

            </div>

            {/* Architecture Matrix */}
            {project.architecture && (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 font-['Outfit']">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  Technical Architecture & Infrastructure
                </h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                    <Code2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-mono font-bold text-cyan-300 uppercase block mb-1">
                        Frontend Interface
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300">
                        {project.architecture.frontend}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                    <Server className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-300 uppercase block mb-1">
                        Backend & API Services
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300">
                        {project.architecture.backend}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                    <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-300 uppercase block mb-1">
                        Database & Real-time State
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300">
                        {project.architecture.database}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-mono font-bold text-purple-300 uppercase block mb-1">
                        Payment Gateway & Security
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300">
                        {project.architecture.payments}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                    <Cloud className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-mono font-bold text-sky-300 uppercase block mb-1">
                        Edge Hosting & Delivery
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300">
                        {project.architecture.hosting}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Key Features List */}
            {project.features && (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 font-['Outfit']">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Key Feature Implementation
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {project.features.map((feature, i) => (
                    <div 
                      key={i} 
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Implementation Lifecycle */}
            {project.developmentProcess && (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 font-['Outfit']">
                  <Workflow className="w-5 h-5 text-cyan-400" />
                  Implementation Phases & Delivery
                </h3>

                <div className="space-y-3">
                  {project.developmentProcess.map((step, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3.5"
                    >
                      <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        0{idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-200 font-medium">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges */}
            {project.challenges && (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 font-['Outfit']">
                  <Target className="w-5 h-5 text-amber-400" />
                  Engineering Challenges & Mitigations
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  {project.challenges}
                </p>
              </div>
            )}

            {/* Results */}
            {project.results && (
              <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-slate-900/80 border border-emerald-500/30 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 font-['Outfit']">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  Business Results & Impact
                </h3>
                <p className="text-slate-200 leading-relaxed text-sm md:text-base">
                  {project.results}
                </p>
              </div>
            )}

          </div>

          {/* Sidebar Meta */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-6 sticky top-28">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider text-cyan-400">
                Technology Stack
              </h3>

              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <TechnologyBadge key={tech} name={tech} size="md" />
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="text-xs font-mono text-slate-400">
                  Category: <span className="text-white font-semibold">{project.category}</span>
                </div>
                {project.subtitle && (
                  <div className="text-xs font-mono text-slate-400">
                    Type: <span className="text-white font-semibold">{project.subtitle}</span>
                  </div>
                )}
                {project.clientType && (
                  <div className="text-xs font-mono text-slate-400">
                    Client: <span className="text-white font-semibold">{project.clientType}</span>
                  </div>
                )}
                <div className="text-xs font-mono text-slate-400">
                  Status: <span className="text-emerald-400 font-semibold">Production Deployed</span>
                </div>
              </div>

              {/* Consultation prompt */}
              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400 mb-3">
                  Interested in building an online storefront or custom platform like {project.title}?
                </p>
                <Button to="/contact" variant="primary" size="sm" className="w-full">
                  Start Your Project
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* Next Project Footer Bar */}
        {nextProject && (
          <div className="pt-12 border-t border-slate-800 flex items-center justify-between">
            <Link
              to="/projects"
              className="text-sm font-mono text-slate-400 hover:text-white transition-colors"
            >
              ← All Projects
            </Link>

            <Link
              to={`/projects/${nextProject.slug}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Next Project: {nextProject.title}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
