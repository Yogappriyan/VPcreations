import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Github, Globe } from 'lucide-react';
import { Project } from '../../types';
import { TechnologyBadge } from '../common/TechnologyBadge';

interface ProjectCardProps {
  project: Project;
  featuredOnly?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Use keyBadges if present, or infer from technologies
  const displayBadges = project.keyBadges && project.keyBadges.length > 0
    ? project.keyBadges
    : ['HTML5', 'CSS3', 'JavaScript', ...(project.technologies.includes('MongoDB') ? ['MongoDB'] : project.technologies.includes('Node.js') ? ['Node.js'] : [])];

  const browserTabTitle = project.browserUrl || project.title;
  const subtitle = project.subtitle || (project.category === 'E-Commerce' ? 'Ecommerce Website' : `${project.category} Application`);

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#090e1a]/90 border border-slate-800/90 hover:border-cyan-500/50 backdrop-blur-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/40 hover:-translate-y-1">
      {/* Background glow on hover */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none"></div>

      {/* Browser Window Mockup Frame (Matching Reference Image) */}
      <div className="relative w-full bg-slate-950 border-b border-slate-800/80 overflow-hidden flex flex-col">
        {/* Browser Top Chrome Header Bar */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/90 border-b border-slate-800/70 select-none">
          {/* Window Control Action Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 border border-rose-600/40"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 border border-amber-600/40"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 border border-emerald-600/40"></span>
          </div>

          {/* Browser Address / Tab Pill */}
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300 max-w-[200px] truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span className="truncate">{browserTabTitle}</span>
          </div>

          {/* Right spacer / icon */}
          <div className="flex items-center gap-1 text-slate-500">
            <Globe className="w-3 h-3 text-slate-500" />
          </div>
        </div>

        {/* Website Preview Banner Image */}
        <Link 
          to={`/projects/${project.slug}`} 
          className="relative aspect-[16/10] w-full overflow-hidden block bg-slate-950 cursor-pointer"
        >
          <img
            src={project.image || '/images/hero-workspace.jpg'}
            alt={project.title}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/hero-workspace.jpg';
            }}
          />

          {/* Banner text overlay if matching reference image */}
          {project.bannerHeadline && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 flex flex-col justify-end">
              <span className="text-white font-bold text-base leading-tight drop-shadow-md">
                {project.bannerHeadline}
              </span>
              {project.bannerSubheadline && (
                <span className="text-slate-300 text-xs drop-shadow-sm">
                  {project.bannerSubheadline}
                </span>
              )}
            </div>
          )}

          {/* Subtle vignette on hover */}
          <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors pointer-events-none"></div>
        </Link>
      </div>

      {/* Card Body (Matching Reference Image Layout) */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-medium tracking-wide">
            {project.category}
          </span>
        </div>

        {/* Title & External Link Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight font-['Outfit']">
            <Link to={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          </h3>

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors shrink-0"
              title={`Visit ${project.title} Live Website`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <Link
              to={`/projects/${project.slug}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors shrink-0"
              title={`View ${project.title} Case Study`}
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Technology Badges Row (Exact Square Badges: HTML5 [5], CSS3 [3], JS [JS], Mongo/Node) */}
        <div className="flex items-center gap-2 mb-4">
          {displayBadges.map((tech) => (
            <TechnologyBadge 
              key={tech} 
              name={tech} 
              variant="icon" 
              size="md" 
            />
          ))}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 line-clamp-3">
          {project.description || project.shortDescription}
        </p>

        {/* Bottom Actions: Implementation Details & Live Website Button */}
        <div className="pt-3.5 border-t border-slate-800/80 mt-auto flex items-center justify-between gap-3">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-semibold transition-all shadow-sm group/btn"
              title={`Visit ${project.title} Live Website`}
            >
              <span>Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
