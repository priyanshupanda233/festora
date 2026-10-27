import React from 'react';
import { ArrowDown, MessageCircle, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const { url: whatsappUrl } = buildWhatsAppUrl(
    siteConfig.whatsappNumber,
    'Hello! 👋 I would like to enquire about your Diwali decorative LED lighting collection.'
  );

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-festive-dark text-festive-cream">
      {/* Background Image with Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero.jpg"
          alt="Festive Diwali home interior adorned with glowing warm LED fairy lights and diyas"
          className="w-full h-full object-cover object-center brightness-75 scale-105 transform animate-float duration-1000"
          onError={(e) => {
            // Graceful fallback to dark gradient if image is loading
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
        {/* Layered luxury lighting gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-festive-dark via-festive-dark/70 to-festive-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-festive-dark/90 via-transparent to-festive-dark/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />
      </div>

      {/* Floating subtle ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow delay-1000"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center flex flex-col items-center">
        
        {/* Subtle festive badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-glow-sm mb-6 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span>India's Festive Electronic Lighting Catalogue</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.15] mb-6 drop-shadow-md">
          Make Every Corner Glow <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200 drop-shadow-[0_2px_15px_rgba(245,158,11,0.5)]">
            This Diwali
          </span>
        </h1>

        {/* Supporting text */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-200/90 font-normal leading-relaxed mb-10">
          Discover decorative LED diyas, fairy lights, curtain lights, glowing lamps, and festive lighting essentials for every celebration.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-festive-dark font-bold text-base tracking-wide hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group shadow-glow-md"
          >
            <span>Explore Collection</span>
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 font-semibold text-base tracking-wide transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2 group shadow-sm"
          >
            <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>

        {/* Feature Highlights Pills */}
        <div className="mt-14 pt-8 border-t border-festive-border/40 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl w-full text-slate-300 text-xs sm:text-sm">
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>100% Electronic & LED Lights</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Smokeless & Safe Indoors</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Direct WhatsApp Quotations</span>
          </div>
        </div>

      </div>
    </section>
  );
};
