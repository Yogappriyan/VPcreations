import React from 'react';
import { useExperience } from '../hooks/usePortfolioData';
import { SectionHeader } from '../components/common/SectionHeader';
import { ExperienceTimeline } from '../components/common/Timeline';
import { Button } from '../components/common/Button';
import { ArrowRight, Briefcase } from 'lucide-react';

export const Experience: React.FC = () => {
  const { experience } = useExperience();

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          label="CAREER MILESTONES"
          title="PROFESSIONAL"
          highlight="JOURNEY"
          description="A chronological record of full-stack engineering milestones, software solutions, and technical leadership."
        />

        {/* Timeline Container */}
        <div className="max-w-4xl mx-auto mb-20">
          <ExperienceTimeline items={experience} />
        </div>

        {/* Work with me banner */}
        <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/20 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white font-['Outfit']">
            Looking for a Dedicated Full Stack Engineer?
          </h3>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            I'm currently partnering with forward-thinking businesses and startups on high-impact web and automation projects.
          </p>
          <div className="pt-2">
            <Button to="/contact" variant="primary" size="md">
              Start a Conversation
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
