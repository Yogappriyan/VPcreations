import React from 'react';

export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading VP Creations...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="relative w-16 h-16 mb-4">
        {/* Outer glowing spinner */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
        {/* Inner pulse ring */}
        <div className="absolute inset-2 rounded-full border border-blue-500/30 animate-ping"></div>
        {/* Center brand dot */}
        <div className="absolute inset-5 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-[0_0_15px_#06b6d4]"></div>
      </div>
      <p className="text-slate-400 font-mono text-sm tracking-wider animate-pulse">{message}</p>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose}></div>
      <div className={`relative w-full ${maxWidth} bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl shadow-cyan-950/50 z-10 my-8`}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="mt-4 max-h-[80vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
};
