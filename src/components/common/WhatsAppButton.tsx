import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../../hooks/usePortfolioData';
import { sanitizeWhatsappNumber } from '../../lib/utils';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings } = useSettings();

  const message = `Hi ${settings.personName || 'Vishwa'}, I found ${settings.name || 'VP Creations'} and would like to discuss a website/project.`;
  const whatsappUrl = `https://wa.me/${sanitizeWhatsappNumber(settings.whatsappNumber)}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${settings.personName || 'Vishwa'} on WhatsApp`}
        className="flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-400/40"
      >
        <MessageCircle className="w-5 h-5 fill-white/20 animate-bounce" />
        <span className="hidden sm:inline font-sans">Chat on WhatsApp</span>
      </a>
    </div>
  );
};
