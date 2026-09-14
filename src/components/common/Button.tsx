import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  id,
  target,
  rel
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs font-medium tracking-wide',
    md: 'px-5 py-2.5 text-sm font-semibold tracking-wide',
    lg: 'px-7 py-3.5 text-base font-semibold tracking-wide'
  }[size];

  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98]',
    glow: 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] hover:bg-cyan-400 active:scale-[0.98]',
    secondary: 'bg-slate-900/90 text-slate-200 border border-slate-700/80 hover:bg-slate-800 hover:border-cyan-500/40 hover:text-white active:scale-[0.98]',
    outline: 'bg-transparent text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/10 hover:border-cyan-400 active:scale-[0.98]',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60'
  }[variant];

  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${sizeClasses} ${variantClasses} ${className}`;

  if (to) {
    return (
      <Link to={to} id={id} className={baseClasses}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a 
        href={href} 
        id={id} 
        className={baseClasses} 
        target={target || (href.startsWith('http') ? '_blank' : undefined)}
        rel={rel || (href.startsWith('http') ? 'noopener noreferrer' : undefined)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
};
