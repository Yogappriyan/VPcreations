import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  MessageCircle,
  HelpCircle,
  Globe,
  Smartphone,
  ShoppingBag,
  Bot,
  Workflow,
  Cpu,
  Palette,
  TrendingUp
} from 'lucide-react';
import { useServices, useSettings } from '../hooks/usePortfolioData';
import { TechnologyBadge } from '../components/common/TechnologyBadge';
import { Button } from '../components/common/Button';
import { ContactForm } from '../components/forms/ContactForm';
import { sanitizeWhatsappNumber } from '../lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-10 h-10 text-cyan-400" />,
  Smartphone: <Smartphone className="w-10 h-10 text-sky-400" />,
  ShoppingBag: <ShoppingBag className="w-10 h-10 text-blue-400" />,
  Bot: <Bot className="w-10 h-10 text-cyan-400" />,
  Workflow: <Workflow className="w-10 h-10 text-teal-400" />,
  Cpu: <Cpu className="w-10 h-10 text-indigo-400" />,
  Palette: <Palette className="w-10 h-10 text-sky-400" />,
  TrendingUp: <TrendingUp className="w-10 h-10 text-emerald-400" />
};

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { services } = useServices();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen pt-40 pb-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Service Not Found</h2>
        <p className="text-slate-400 mb-6">The requested service could not be located.</p>
        <Button to="/services" variant="primary">
          Back to Services
        </Button>
      </div>
    );
  }

  const icon = iconMap[service.icon] || <Globe className="w-10 h-10 text-cyan-400" />;

  const whatsappUrl = `https://wa.me/${sanitizeWhatsappNumber(settings.whatsappNumber)}?text=${encodeURIComponent(
    `Hi Vishwa, I'm interested in your ${service.title} service for my business.`
  )}`;

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Services
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="p-8 md:p-14 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.2)]">
              {icon}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Outfit']">
              {service.title}
            </h1>

            <p className="text-base sm:text-xl text-slate-300 leading-relaxed">
              {service.description}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button to="/contact" variant="primary" size="lg">
                Request This Service
                <ArrowRight className="w-4 h-4" />
              </Button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/60 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                <MessageCircle className="w-4 h-4" />
                Discuss via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Features & Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          
          {/* Key Deliverables & Features */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 font-['Outfit']">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Key Deliverables & Specifications
            </h3>
            <ul className="space-y-4">
              {(service.features || []).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="p-1 rounded bg-cyan-950/60 border border-cyan-500/30 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-slate-300 text-sm md:text-base leading-snug">
                    {feat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Benefits */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 font-['Outfit']">
              <Zap className="w-5 h-5 text-sky-400" />
              Business Impact & Advantages
            </h3>
            <ul className="space-y-4">
              {(service.benefits || []).map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="p-1 rounded bg-blue-950/60 border border-blue-500/30 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  </div>
                  <span className="text-slate-300 text-sm md:text-base leading-snug">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Technologies Applied */}
        {service.technologies && service.technologies.length > 0 && (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 mb-16">
            <h3 className="text-lg font-bold text-white mb-4 font-mono">
              Technologies & Frameworks Applied
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.technologies.map((t) => (
                <TechnologyBadge key={t} name={t} size="md" />
              ))}
            </div>
          </div>
        )}

        {/* Contact form pre-anchored */}
        <div className="pt-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h3 className="text-2xl md:text-4xl font-black text-white font-['Outfit']">
              Initiate Your {service.title} Project
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              Send your project specifications directly to Vishwa for a quick turnaround estimate.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <ContactForm defaultService={service.title} />
          </div>
        </div>

      </div>
    </div>
  );
};
