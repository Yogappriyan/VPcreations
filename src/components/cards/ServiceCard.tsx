import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Globe, 
  Smartphone, 
  ShoppingBag, 
  Bot, 
  Workflow, 
  Cpu, 
  Palette, 
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
}

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-6 h-6 text-cyan-400" />,
  Smartphone: <Smartphone className="w-6 h-6 text-sky-400" />,
  ShoppingBag: <ShoppingBag className="w-6 h-6 text-blue-400" />,
  Bot: <Bot className="w-6 h-6 text-cyan-400" />,
  Workflow: <Workflow className="w-6 h-6 text-teal-400" />,
  Cpu: <Cpu className="w-6 h-6 text-indigo-400" />,
  Palette: <Palette className="w-6 h-6 text-sky-400" />,
  TrendingUp: <TrendingUp className="w-6 h-6 text-emerald-400" />
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const icon = iconMap[service.icon] || <Globe className="w-6 h-6 text-cyan-400" />;

  return (
    <div className="group relative flex flex-col justify-between p-7 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/40 hover:-translate-y-1 text-center">
      {/* Background glow hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none"></div>

      <div className="flex flex-col items-center">
        {/* Icon & Title */}
        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-5 mx-auto group-hover:border-cyan-500/40 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all">
          {icon}
        </div>

        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-3 text-center">
          {service.title}
        </h3>

        <p className="text-sm text-slate-400 leading-relaxed mb-6 text-center">
          {service.description}
        </p>

        {/* Feature snippet bullets */}
        {service.features && service.features.length > 0 && (
          <ul className="space-y-2 mb-6 w-full max-w-xs mx-auto text-left">
            {service.features.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{feat}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Learn More link */}
      <div className="pt-4 border-t border-slate-800/80 flex justify-center">
        <Link
          to={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors"
        >
          Learn More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
