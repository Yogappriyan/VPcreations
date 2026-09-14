import React, { useState } from 'react';
import { useSkills } from '../hooks/usePortfolioData';
import { SectionHeader } from '../components/common/SectionHeader';
import { SkillCard } from '../components/cards/SkillCard';

export const Skills: React.FC = () => {
  const { skills } = useSkills();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Frontend',
    'Backend',
    'Database',
    'Payments',
    'Automation',
    'Deployment',
    'AI'
  ];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());

  // Grouped by categories when 'All' is selected
  const groupedCategories = ['Frontend', 'Backend', 'Database', 'Payments', 'Automation', 'Deployment', 'AI'];

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          label="PROFICIENCIES & STACK"
          title="TECHNICAL"
          highlight="SKILLS"
          description="A comprehensive inventory of programming languages, frameworks, cloud databases, and automation tooling."
        />

        {/* Filter Buttons */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-14">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grouped View vs Filtered View */}
        {selectedCategory === 'All' ? (
          <div className="space-y-14">
            {groupedCategories.map((group) => {
              const groupItems = skills.filter(s => s.category === group);
              if (groupItems.length === 0) return null;

              return (
                <div key={group} className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"></span>
                    <h3 className="text-xl font-bold text-white tracking-wide font-['Outfit']">
                      {group} Technologies
                    </h3>
                    <span className="text-xs font-mono text-slate-500">
                      ({groupItems.length} skills)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {groupItems.map((skill) => (
                      <SkillCard key={skill.id} skill={skill} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
