import React from 'react';
import { ABOUT_CONTENT, siteConfig } from '../config/siteConfig';
import { Flame, ShieldCheck, HeartHandshake } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-festive-midnight text-festive-cream relative overflow-hidden">
      {/* Subtle festive background glow */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Decorative Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-festive-border shadow-2xl bg-festive-card aspect-[4/3] sm:aspect-square">
              <img
                src="/uploads/sample_hanging_diya.jpg"
                alt="Festive hanging LED lights illuminating Diwali interior"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/hero.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-festive-dark via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-festive-surface/90 backdrop-blur-md border border-festive-border/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-white">
                      Electronic & LED Lighting
                    </h4>
                    <p className="text-xs text-slate-300">
                      Safe, flameless, and energy-efficient festive decor
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              About {siteConfig.storeName}
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              {ABOUT_CONTENT.title}
            </h2>

            <p className="text-base sm:text-lg text-amber-200/90 font-medium leading-relaxed">
              {ABOUT_CONTENT.lead}
            </p>

            <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              {ABOUT_CONTENT.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-festive-surface/80 border border-festive-border/60 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Safe & Clean Festivities</span>
                  <span className="text-slate-400">Zero hot wax spillages or open flame hazards</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-festive-surface/80 border border-festive-border/60 flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Personal Assistance</span>
                  <span className="text-slate-400">Direct one-to-one consultation on WhatsApp</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
