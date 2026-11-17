import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Zap, 
  Code2, 
  Cpu, 
  Rocket, 
  ShieldCheck, 
  Sparkles,
  Award,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { Button } from '../components/common/Button';
import { TechnologyBadge } from '../components/common/TechnologyBadge';
import { useProjects, useSettings, useSkills } from '../hooks/usePortfolioData';

export const About: React.FC = () => {
  const { settings } = useSettings();
  const { skills } = useSkills();
  const { projects } = useProjects();
  const brandName = settings.name || 'VP Creations';
  const brandTagline = settings.tagline || 'WE BUILD YOUR IDEAS';
  const personName = settings.personName || 'Vishwa';

  const focusAreas = [
    {
      title: 'High Performance & Speed',
      description: 'Zero bloat, lightning load times, and optimized Core Web Vitals that keep visitors engaged and boost conversions.',
      icon: <Zap className="w-5 h-5 text-cyan-400" />
    },
    {
      title: 'Scalable Architecture',
      description: 'Built with modular React, TypeScript, and cloud-native databases ready to scale seamlessly as your user base expands.',
      icon: <Layers className="w-5 h-5 text-sky-400" />
    },
    {
      title: 'Real Business Results',
      description: 'Digital solutions built around measurable sales, user retention, streamlined operations, and frictionless checkouts.',
      icon: <Rocket className="w-5 h-5 text-blue-400" />
    },
    {
      title: 'Clean & Modern UI',
      description: 'Sophisticated dark aesthetics, smooth micro-interactions, responsive typography, and intuitive customer navigation.',
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />
    },
    {
      title: 'Workflow Automation',
      description: 'Integrating automated pipelines with n8n and AI models to reduce manual overhead and operational latency.',
      icon: <Cpu className="w-5 h-5 text-teal-400" />
    },
    {
      title: 'Security & Reliability',
      description: 'Strict role-based access rules, tokenized payment processing, encrypted data channels, and continuous monitoring.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          label="ABOUT ME"
          title="THE MIND BEHIND"
          highlight="VP CREATIONS"
          description="A dedicated Full Stack Developer and digital architect committed to engineering high-impact web software and automation systems."
        />

        {/* Founder Story & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-2 bg-gradient-to-b from-cyan-500/30 via-slate-800 to-blue-600/20 shadow-2xl shadow-cyan-950/50">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/5]">
                <img
                  src={settings.heroImage || '/images/hero-workspace.jpg'}
                  alt={personName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md">
                  <h3 className="text-xl font-bold text-white font-['Outfit']">{personName}</h3>
                  <p className="text-xs font-mono text-cyan-400 mt-0.5">Founder & {settings.profession || 'Full Stack Developer'}</p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Specializing in Full Stack Web, E-Commerce, and Intelligent Automation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4 text-slate-300 text-base md:text-lg leading-relaxed">
              <p>
                Welcome! I'm <strong className="text-white">{personName}</strong>, the creator and lead engineer at <span className="text-cyan-400 font-bold">{brandName}</span>.
              </p>
              <p>
                My mission is simple and unwavering: <strong className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">"{brandTagline}"</strong>. 
                Too many businesses struggle with clunky, generic templates or fragmented tech stacks that don't scale. I bridge that gap by delivering bespoke software crafted with modern engineering practices.
              </p>
              <p>
                Whether it's building blazing-fast e-commerce stores with customized cart logic and Razorpay integrations, or engineering multi-tenant administrative dashboards and automated n8n workflows, I approach every project with craftsmanship, speed, and precision.
              </p>
            </div>

            {/* Quick stats / credentials */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-2xl font-bold text-cyan-400 font-mono">{projects.length}+</div>
                <div className="text-xs text-slate-400 mt-1">Shipped Projects</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-2xl font-bold text-cyan-400 font-mono">100%</div>
                <div className="text-xs text-slate-400 mt-1">Client Satisfaction</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-2xl font-bold text-cyan-400 font-mono">24/7</div>
                <div className="text-xs text-slate-400 mt-1">Reliable Support</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex flex-wrap gap-4">
              <Button to="/contact" variant="primary" size="md">
                Let's Work Together
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button to="/resume" variant="secondary" size="md">
                <Download className="w-4 h-4 text-cyan-400" />
                Download Resume
              </Button>
            </div>

          </div>

        </div>

        {/* What I Focus On (6 Core Pillars) */}
        <div className="mb-24">
          <SectionHeader
            label="METHODOLOGY"
            title="WHAT I"
            highlight="FOCUS ON"
            description="The engineering principles behind every line of code and product architecture deployed at VP Creations."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {focusAreas.map((item, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/30 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-5 group-hover:border-cyan-500/40 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 font-['Outfit']">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Arsenal Snapshot */}
        <div className="p-8 md:p-12 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden">
          <div className="max-w-3xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-['Outfit']">
              Engineered With Modern Technologies
            </h3>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
              I stay at the forefront of modern web standards, using TypeScript, React, Tailwind, and resilient cloud storage to build software that performs reliably in production.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {skills.map((s) => (
                <TechnologyBadge key={s.id} name={s.name} size="md" />
              ))}
            </div>
            <Button to="/projects" variant="primary">
              See What I've Built With These Tools
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
