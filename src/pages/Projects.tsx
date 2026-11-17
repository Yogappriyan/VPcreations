import React, { useState } from 'react';
import { useProjects } from '../hooks/usePortfolioData';
import { Project } from '../types';
import { ProjectCard } from '../components/cards/ProjectCard';
import { Sparkles } from 'lucide-react';

export const Projects: React.FC = () => {
  const { projects } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const baseCategories = [
    'All',
    'E-Commerce',
    'Fashion & Apparel',
    'Women Accessories',
    'Menswear',
    'Car Rental'
  ];

  const matchesCategory = (p: Project, category: string): boolean => {
    if (category === 'All') return true;
    const cat = (p.category || '').toLowerCase();
    if (cat === category.toLowerCase()) return true;

    const sub = (p.subtitle || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const client = (p.clientType || '').toLowerCase();
    const full = `${cat} ${sub} ${desc} ${client}`;

    if (category === 'E-Commerce') {
      return full.includes('commerce') || full.includes('store') || full.includes('shop');
    }
    if (category === 'Fashion & Apparel') {
      return full.includes('fashion') || full.includes('cloth') || full.includes('saree') || full.includes('kurti') || full.includes('menswear') || full.includes('apparel');
    }
    if (category === 'Women Accessories') {
      return full.includes('women') || full.includes('earring') || full.includes('necklace') || full.includes('bridal') || full.includes('accesori') || full.includes('accessory');
    }
    if (category === 'Menswear') {
      return full.includes('menswear') || full.includes('mens wear') || full.includes("men's") || full.includes(' men ');
    }
    if (category === 'Car Rental') {
      return full.includes('car') || full.includes('rental') || full.includes('automotive');
    }
    return full.includes(category.toLowerCase());
  };

  // Include any custom project categories (e.g. AI, Automation, Web Applications) not covered by baseCategories
  const extraCategories = Array.from(
    new Set<string>(
      projects
        .map(p => (p.category || '').trim())
        .filter(cat =>
          Boolean(cat) &&
          !baseCategories.some(bc => bc.toLowerCase() === cat.toLowerCase()) &&
          !baseCategories.some(bc => bc !== 'All' && matchesCategory({ category: cat } as Project, bc))
        )
    )
  );
  const categories = [...baseCategories, ...extraCategories];

  const getCategoryCount = (category: string) => {
    if (category === 'All') return projects.length;
    return projects.filter(p => matchesCategory(p, category)).length;
  };

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => matchesCategory(p, selectedCategory));

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header (Aligned with Reference Image) */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            FEATURED PROJECTS
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 font-['Outfit']">
            REAL PROJECTS. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">REAL IMPACT.</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            I build modern websites, web applications and digital solutions that help businesses grow. Clean design, powerful functionality and real-world impact — explore our production projects below.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105 font-bold'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{cat}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    active ? 'bg-slate-950/80 text-cyan-300 font-bold' : 'bg-slate-800/80 text-slate-400'
                  }`}>
                    {getCategoryCount(cat)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-16 rounded-2xl bg-slate-900/40 border border-slate-800 text-center max-w-md mx-auto mb-20">
            <p className="text-slate-400 font-mono text-sm">
              No projects found under "{selectedCategory}".
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 px-4 py-2 text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
            >
              Reset to All Projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-12">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
