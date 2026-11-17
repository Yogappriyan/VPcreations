import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Linkedin, 
  Github, 
  Instagram,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useSettings } from '../hooks/usePortfolioData';
import { SectionHeader } from '../components/common/SectionHeader';
import { ContactForm } from '../components/forms/ContactForm';
import { normalizeUrl, sanitizeWhatsappNumber } from '../lib/utils';

export const Contact: React.FC = () => {
  const { settings } = useSettings();

  const message = `Hi ${settings.personName || 'Vishwa'}, I found ${settings.name || 'VP Creations'} and would like to discuss a website/project.`;
  const whatsappUrl = `https://wa.me/${sanitizeWhatsappNumber(settings.whatsappNumber)}?text=${encodeURIComponent(message)}`;
  const linkedinHref = normalizeUrl(settings.linkedinUrl);
  const githubHref = normalizeUrl(settings.githubUrl);
  const instagramHref = normalizeUrl(settings.instagramUrl);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <SectionHeader
          label="GET IN TOUCH"
          title="LET'S BUILD YOUR"
          highlight="IDEA"
          description="Start a project with VP Creations. Tell me about your goals, specifications, or timeline, and let's craft an exceptional digital experience."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & Socials */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-6">
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Direct Contact Channels
              </h3>

              <div className="space-y-4 text-sm font-mono">
                
                {/* Phone */}
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all group"
                >
                  <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase">Call Directly</div>
                    <div className="font-bold text-white group-hover:text-cyan-300">{settings.phone}</div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all group"
                >
                  <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] text-slate-400 uppercase">Email Inbox</div>
                    <div className="font-bold text-white group-hover:text-cyan-300 truncate">{settings.email}</div>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-300">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase">Studio Location</div>
                    <div className="font-semibold text-white">India • Remote Available Worldwide</div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-300">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase">Average Response Time</div>
                    <div className="font-semibold text-emerald-400">Within 2 to 4 Hours</div>
                  </div>
                </div>

              </div>

              {/* Instant WhatsApp card */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/40 text-emerald-300 hover:text-white hover:border-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Need Instant Feedback?</div>
                      <div className="text-xs text-emerald-400/80 font-mono">Chat on WhatsApp Now</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-800">
                <div className="text-xs font-mono uppercase text-slate-400 mb-3">Connect on Social</div>
                <div className="flex items-center gap-3">
                  {linkedinHref && (
                    <a
                      href={linkedinHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {githubHref && (
                    <a
                      href={githubHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {instagramHref && (
                    <a
                      href={instagramHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Contact Enquiry Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>

      </div>
    </div>
  );
};
