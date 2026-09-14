import React from 'react';

export const TechMarquee: React.FC = () => {
  const technologies = [
    { name: 'HTML5', color: '#e34f26' },
    { name: 'CSS3', color: '#1572b6' },
    { name: 'JavaScript', color: '#f7df1e' },
    { name: 'TypeScript', color: '#3178c6' },
    { name: 'React', color: '#61dafb' },
    { name: 'Tailwind CSS', color: '#38bdf8' },
    { name: 'Node.js', color: '#339933' },
    { name: 'Express', color: '#ffffff' },
    { name: 'MongoDB', color: '#47a248' },
    { name: 'Firebase', color: '#ffca28' },
    { name: 'Git', color: '#f05032' },
    { name: 'GitHub', color: '#ffffff' },
    { name: 'Vercel', color: '#ffffff' },
    { name: 'Razorpay', color: '#0c2340' },
    { name: 'n8n', color: '#ea4b71' },
    { name: 'Gemini AI', color: '#38bdf8' },
  ];

  // Duplicate list to achieve infinite seamless loop
  const displayList = [...technologies, ...technologies];

  return (
    <div className="relative w-full overflow-hidden py-10 border-y border-cyan-500/15 bg-[#030611]/80 backdrop-blur-md">
      {/* Left/Right Fade Gradient Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#040711] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#040711] to-transparent z-10 pointer-events-none"></div>

      <div className="animate-marquee items-center gap-6">
        {displayList.map((tech, index) => (
          <div
            key={index}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors shrink-0 group"
          >
            <span 
              className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
              style={{ backgroundColor: tech.color, color: tech.color }}
            />
            <span className="font-mono text-xs md:text-sm font-semibold tracking-wider text-slate-300 group-hover:text-white transition-colors">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
