import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '../../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="relative p-7 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl hover:shadow-cyan-950/30 text-center">
      <div className="absolute top-6 right-6 text-slate-800 group-hover:text-cyan-500/20 transition-colors pointer-events-none">
        <Quote className="w-10 h-10" />
      </div>

      <div className="flex flex-col items-center">
        {/* Rating Stars */}
        <div className="flex items-center justify-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? 'text-cyan-400 fill-cyan-400'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Text */}
        <p className="text-sm md:text-base text-slate-300 leading-relaxed italic mb-6 text-center">
          "{testimonial.testimonial}"
        </p>
      </div>

      {/* Author info */}
      <div className="flex flex-col items-center gap-2 pt-4 border-t border-slate-800/60 text-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-[0_0_12px_rgba(6,182,212,0.3)]">
          {(testimonial.clientName || '?').charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
            {testimonial.clientName}
          </h4>
          <p className="text-xs text-slate-400 font-mono">
            {testimonial.business}
          </p>
        </div>
      </div>
    </div>
  );
};
