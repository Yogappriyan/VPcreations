import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  FileCode2, 
  Code2, 
  Rocket, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { SectionHeader } from './SectionHeader';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'DISCOVER',
      subtitle: 'Understand your needs',
      description: 'In-depth brand discovery, audience persona mapping, technical requirements analysis, and milestone scoping.',
      icon: <Lightbulb className="w-5 h-5 text-amber-400" />
    },
    {
      step: '02',
      title: 'DESIGN',
      subtitle: 'Plan and create the perfect solution',
      description: 'Interactive UI/UX design, mobile-first wireframes, typography pairings, color systems, and conversion funnels.',
      icon: <FileCode2 className="w-5 h-5 text-cyan-400" />
    },
    {
      step: '03',
      title: 'DEVELOP',
      subtitle: 'Build with best practices',
      description: 'Clean component architecture using React, TypeScript, and Tailwind CSS backed by scalable REST APIs and secure databases.',
      icon: <Code2 className="w-5 h-5 text-blue-400" />
    },
    {
      step: '04',
      title: 'DEPLOY',
      subtitle: 'Launch and help you grow',
      description: 'Payment gateway validation, webhook testing, 99+ Core Web Vitals audit, edge CDN deployment, and post-launch support.',
      icon: <Rocket className="w-5 h-5 text-emerald-400" />
    }
  ];

  return (
    <section className="py-24 relative bg-slate-950/40 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="HOW WE WORK"
          title="ENGINEERED FOR"
          highlight="PRECISION"
          description="A structured, high-tempo development methodology that transforms bold ideas into production-ready digital products."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((item) => (
            <div
              key={item.step}
              className="group relative p-7 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between text-center"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-cyan-500/30 transition-colors">
                    {item.icon}
                  </div>
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                    PHASE {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-1 font-['Outfit'] text-center">
                  {item.title}
                </h3>
                
                <h4 className="text-xs font-mono text-cyan-400/90 mb-3 text-center">
                  {item.subtitle}
                </h4>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-center">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60"></span>
                <span>Standard Delivery</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
