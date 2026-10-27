import React from 'react';
import { MessageCircle, Clock, MapPin, Mail, Sparkles, Send } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export const ContactSection: React.FC = () => {
  const { url: directWhatsAppUrl, validation } = buildWhatsAppUrl(
    siteConfig.whatsappNumber,
    'Hello! 👋 I would like to get in touch regarding your Diwali festive lighting collection.'
  );

  return (
    <section id="contact" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-festive-dark via-festive-midnight to-festive-dark rounded-3xl p-8 sm:p-12 text-white border border-festive-border shadow-2xl relative overflow-hidden">
          
          {/* Festive glow decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct Customer Support</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                Plan Your Festive Lighting With Us
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
                Have questions regarding custom lengths, bulk pricing for residential societies, or availability? Reach out directly on WhatsApp for swift answers.
              </p>

              <div className="pt-2">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/40 transition-all transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Start WhatsApp Conversation</span>
                  <Send className="w-4 h-4 ml-1" />
                </a>

                {validation.isPlaceholder && (
                  <p className="text-[11px] text-amber-400 mt-2 font-mono">
                    * WhatsApp number currently configured with placeholder ({siteConfig.whatsappNumber}).
                  </p>
                )}
              </div>
            </div>

            {/* Right Information Cards */}
            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 rounded-2xl bg-festive-surface/80 border border-festive-border/80 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Enquiry Hours
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                    {siteConfig.businessHours}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-festive-surface/80 border border-festive-border/80 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Service Area
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                    Pan-India Delivery & Festive Dispatches
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {siteConfig.businessAddress}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-festive-surface/80 border border-festive-border/80 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Email Enquiries
                  </h4>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-xs sm:text-sm text-slate-300 hover:text-amber-300 transition-colors mt-0.5 block"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-festive-surface/80 border border-festive-border/80 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Phone & WhatsApp
                  </h4>
                  <a
                    href={`tel:+91${siteConfig.phoneNumber || '7848080755'}`}
                    className="text-xs sm:text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors mt-0.5 block"
                  >
                    +91 {siteConfig.phoneNumber || '7848080755'}
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
