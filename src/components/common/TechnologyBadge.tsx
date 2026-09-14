import React from 'react';
import { 
  Atom, 
  Flame, 
  Database, 
  Server, 
  CreditCard, 
  Layers, 
  GitBranch, 
  Github, 
  Workflow, 
  MessageSquare,
  Cpu,
  Code2
} from 'lucide-react';

interface TechnologyBadgeProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'icon';
  showLabel?: boolean;
}

export const TechnologyBadge: React.FC<TechnologyBadgeProps> = ({ 
  name, 
  className = '',
  size = 'sm',
  variant = 'pill',
  showLabel = false
}) => {
  const norm = name.toLowerCase().trim();

  // If icon variant is requested (matching the square badges in the reference image)
  if (variant === 'icon') {
    const sizeMap = {
      sm: 'w-7 h-7 text-[10px] rounded-lg',
      md: 'w-8 h-8 text-xs rounded-xl',
      lg: 'w-10 h-10 text-sm rounded-xl'
    };

    let badgeContent = null;

    if (norm === 'html' || norm === 'html5') {
      badgeContent = (
        <div 
          className={`${sizeMap[size]} bg-gradient-to-b from-[#ff5722] to-[#e64a19] text-white font-black flex items-center justify-center shadow-md shadow-orange-950/40 border border-orange-400/30 select-none group/icon relative`}
          title="HTML5"
        >
          <span className="font-extrabold tracking-tighter">5</span>
        </div>
      );
    } else if (norm === 'css' || norm === 'css3') {
      badgeContent = (
        <div 
          className={`${sizeMap[size]} bg-gradient-to-b from-[#2196f3] to-[#1976d2] text-white font-black flex items-center justify-center shadow-md shadow-blue-950/40 border border-blue-400/30 select-none group/icon relative`}
          title="CSS3"
        >
          <span className="font-extrabold tracking-tighter">3</span>
        </div>
      );
    } else if (norm === 'javascript' || norm === 'js') {
      badgeContent = (
        <div 
          className={`${sizeMap[size]} bg-gradient-to-b from-[#ffd600] to-[#fbc02d] text-slate-950 font-black flex items-center justify-center shadow-md shadow-amber-950/40 border border-amber-300/40 select-none group/icon relative`}
          title="JavaScript (ES6+)"
        >
          <span className="font-black tracking-tight">JS</span>
        </div>
      );
    } else if (norm.includes('react')) {
      badgeContent = (
        <div 
          className={`${sizeMap[size]} bg-slate-900 text-cyan-400 font-bold flex items-center justify-center shadow-md border border-cyan-500/40 select-none group/icon relative`}
          title="React.js"
        >
          <Atom className="w-4 h-4 animate-[spin_12s_linear_infinite]" />
        </div>
      );
    } else if (norm.includes('tailwind')) {
      badgeContent = (
        <div 
          className={`${sizeMap[size]} bg-slate-900 text-sky-400 font-bold flex items-center justify-center shadow-md border border-sky-500/40 select-none group/icon relative`}
          title="Tailwind CSS"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
          </svg>
        </div>
      );
    } else if (norm.includes('mongo') || norm.includes('leaf')) {
      badgeContent = (
        <div 
          className={`${sizeMap[size]} bg-gradient-to-b from-emerald-900/90 to-emerald-950 text-emerald-400 font-bold flex items-center justify-center shadow-md border border-emerald-500/40 select-none group/icon relative`}
          title="MongoDB"
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      );
    } else if (norm.includes('node')) {
      badgeContent = (
        <div 
          className={`${sizeMap[size]} bg-gradient-to-b from-green-900 to-green-950 text-green-400 font-black flex items-center justify-center shadow-md border border-green-500/40 select-none group/icon relative`}
          title="Node.js"
        >
          <Server className="w-3.5 h-3.5 text-green-400" />
        </div>
      );
    } else if (norm.includes('firebase')) {
      badgeContent = (
        <div 
          className={`${sizeMap[size]} bg-slate-900 text-amber-500 font-bold flex items-center justify-center shadow-md border border-amber-500/40 select-none group/icon relative`}
          title="Firebase"
        >
          <Flame className="w-4 h-4 text-amber-500" />
        </div>
      );
    } else if (norm.includes('typescript') || norm === 'ts') {
      badgeContent = (
        <div 
          className={`${sizeMap[size]} bg-gradient-to-b from-[#3178c6] to-[#235a96] text-white font-black flex items-center justify-center shadow-md border border-blue-300/40 select-none group/icon relative`}
          title="TypeScript"
        >
          <span className="font-extrabold tracking-tight">TS</span>
        </div>
      );
    } else if (norm.includes('razorpay')) {
      badgeContent = (
        <div 
          className={`${sizeMap[size]} bg-slate-900 text-cyan-300 font-bold flex items-center justify-center shadow-md border border-cyan-500/40 select-none group/icon relative`}
          title="Razorpay Payment Gateway"
        >
          <CreditCard className="w-3.5 h-3.5" />
        </div>
      );
    } else if (norm.includes('n8n')) {
      badgeContent = (
        <div 
          className={`${sizeMap[size]} bg-gradient-to-b from-rose-900 to-rose-950 text-rose-300 font-bold flex items-center justify-center shadow-md border border-rose-500/40 select-none group/icon relative`}
          title="n8n Automation"
        >
          <Workflow className="w-3.5 h-3.5" />
        </div>
      );
    } else if (norm.includes('git') && !norm.includes('github')) {
      badgeContent = (
        <div 
          className={`${sizeMap[size]} bg-slate-900 text-orange-400 font-bold flex items-center justify-center shadow-md border border-orange-500/40 select-none group/icon relative`}
          title="Git Version Control"
        >
          <GitBranch className="w-3.5 h-3.5" />
        </div>
      );
    } else if (norm.includes('github')) {
      badgeContent = (
        <div 
          className={`${sizeMap[size]} bg-slate-900 text-slate-200 font-bold flex items-center justify-center shadow-md border border-slate-700/80 select-none group/icon relative`}
          title="GitHub"
        >
          <Github className="w-3.5 h-3.5" />
        </div>
      );
    } else {
      badgeContent = (
        <div 
          className={`${sizeMap[size]} bg-slate-900 text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center shadow-md border border-slate-700 select-none`}
          title={name}
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
        </div>
      );
    }

    return (
      <div className={`inline-flex items-center gap-1.5 transition-transform hover:scale-110 ${className}`}>
        {badgeContent}
        {showLabel && (
          <span className="text-xs font-mono text-slate-300">{name}</span>
        )}
      </div>
    );
  }

  // Default Pill Variant
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs md:text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 font-mono tracking-tight hover:border-cyan-500/40 hover:text-cyan-300 transition-colors ${sizeClasses} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80"></span>
      {name}
    </span>
  );
};
