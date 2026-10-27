import React from 'react';
import { Flame, MessageCircle, Heart, Lock } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { CATEGORIES } from '../data/categories';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface FooterProps {
  onNavigateSection?: (sectionId: string) => void;
  onSelectCategory?: (category: string) => void;
  onNavigatePage: (page: 'home' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onSelectCategory,
  onNavigatePage
}) => {
  const currentYear = new Date().getFullYear();
  const { url: directWhatsAppUrl } = buildWhatsAppUrl(
    siteConfig.whatsappNumber,
    'Hello! 👋 I am browsing Diwali Glow and would like to enquire about decorative lights.'
  );

  return (
    <footer className="bg-festive-dark text-slate-400 border-t border-festive-border pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-festive-border/60">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 flex items-center justify-center shadow-glow-sm">
                <div className="w-full h-full bg-festive-dark rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-festive-cream">
                {siteConfig.storeName}
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Premium decorative electronic & LED lights for Diwali and Indian celebrations. Modern flameless diyas, fairy light waterfalls, curtain drops, and festive installations.
            </p>

            <div>
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-festive-cream uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection?.('hero')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('catalogue')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Product Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('about')}
                  className="hover:text-amber-400 transition-colors"
                >
                  About Our Brand
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('faq')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('contact')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Lighting Categories */}
          <div className="space-y-3 lg:col-span-2">
            <h4 className="font-serif font-bold text-sm text-festive-cream uppercase tracking-wider">
              Festive Collections
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory?.(cat.id);
                    onNavigateSection?.('catalogue');
                  }}
                  className="text-left hover:text-amber-400 transition-colors py-1 truncate"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {siteConfig.storeName}. All rights reserved.</p>

          <p className="flex items-center gap-1 text-[11px]">
            <span>Crafted with festive warmth</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>for Indian Celebrations</span>
          </p>

          {/* Discreet Admin Login Link */}
          <div className="flex items-center gap-4">
            <span className="text-[11px]">Safe Electronic Lighting Only</span>
            <button
              onClick={() => onNavigatePage('admin')}
              className="text-slate-600 hover:text-slate-400 flex items-center gap-1 text-[11px] transition-colors"
              title="Catalogue Management Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
