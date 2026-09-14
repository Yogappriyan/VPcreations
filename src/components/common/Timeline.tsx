import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { Experience } from '../../types';
import { TechnologyBadge } from './TechnologyBadge';

interface ExperienceTimelineProps {
  items: Experience[];
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ items }) => {
  return (
    <div className="relative border-l border-cyan-500/25 ml-4 md:ml-32 space-y-12 py-4">
      {items.map((item, idx) => (
        <div key={item.id || idx} className="relative pl-8 group">
          
          {/* Timeline bullet / pulse node */}
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:bg-cyan-400 group-hover:scale-125 transition-all shadow-[0_0_12px_rgba(6,182,212,0.6)]"></div>

          {/* Left Year Badge for Desktop */}
          <div className="hidden md:block absolute -left-36 top-1 text-right w-24">
            <span className="inline-block px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              {item.year}
            </span>
          </div>

          {/* Card Container */}
          <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30">
            {/* Mobile Year Badge */}
            <div className="md:hidden inline-block mb-3">
              <span className="px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
                {item.year}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>
              {item.role && (
                <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-slate-950 border border-slate-800">
                  {item.role}
                </span>
              )}
            </div>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
              {item.description}
            </p>

            {item.technologies && item.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/80">
                {item.technologies.map((t) => (
                  <TechnologyBadge key={t} name={t} />
                ))}
              </div>
            )}
          </div>

        </div>
      ))}
    </div>
  );
};
