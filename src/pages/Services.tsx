import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { useServices, useSettings } from '../hooks/usePortfolioData';
import { SectionHeader } from '../components/common/SectionHeader';
import { ServiceCard } from '../components/cards/ServiceCard';
import { Button } from '../components/common/Button';

export const Services: React.FC = () => {
  const { services } = useServices();
  const { settings } = useSettings();

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    "Hi Vishwam, I would like to consult about your services at VP Creations."
  )}`;

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          label="SERVICES & CAPABILITIES"
          title="WHAT WE"
          highlight="BUILD"
          description="Tailored digital engineering and development services designed to elevate your company, streamline sales, and automate tedious workflows."
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Consultation Callout */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-widest uppercase bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Need a Custom Solution?
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white font-['Outfit']">
              Not sure which service fits your roadmap?
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Let's hop on a brief consultation call. We can analyze your current setup, discuss technical feasibility, and map out an implementation plan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Button to="/contact" variant="primary" size="lg">
              Book a Free Call
              <ArrowRight className="w-4 h-4" />
            </Button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/60 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Direct
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
