import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Menu, X, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { siteConfig } from '../config/siteConfig';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface NavbarProps {
  onNavigateSection?: (sectionId: string) => void;
  currentPage: 'home' | 'admin';
  onNavigatePage: (page: 'home' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateSection,
  currentPage,
  onNavigatePage
}) => {
  const { totalItemsCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentPage !== 'home') {
      onNavigatePage('home');
      setTimeout(() => {
        onNavigateSection?.(sectionId);
      }, 100);
    } else {
      onNavigateSection?.(sectionId);
    }
  };

  const { url: directWhatsAppUrl } = buildWhatsAppUrl(
    siteConfig.whatsappNumber,
    `Hello! 👋 I am browsing the ${siteConfig.storeName} website and would like to enquire about your decorative festive lights collection.`
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-festive-dark/90 backdrop-blur-md border-b border-festive-border/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
              <div className="w-full h-full bg-festive-dark rounded-[10px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-amber-400 group-hover:text-yellow-300 transition-colors" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider text-festive-cream group-hover:text-amber-300 transition-colors block">
                {siteConfig.storeName}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-amber-400/90 font-medium -mt-1 block">
                Festive LED Lights
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick('hero')}
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors focus:outline-none"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('catalogue')}
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors focus:outline-none"
            >
              Shop All
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors focus:outline-none"
            >
              Categories
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors focus:outline-none"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors focus:outline-none"
            >
              FAQ
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors focus:outline-none"
            >
              Contact
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* WhatsApp Direct Chat Button */}
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow-emerald-900/20"
              title="Chat directly on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl bg-festive-surface hover:bg-festive-card border border-festive-border/80 text-festive-cream hover:text-amber-300 transition-all focus:outline-none group shadow-sm"
              aria-label="View Enquiry Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs min-w-[20px] h-5 rounded-full px-1.5 flex items-center justify-center shadow-glow-sm animate-pulse-slow">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-festive-surface focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-festive-midnight border-b border-festive-border px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <button
            onClick={() => handleNavClick('hero')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-base font-medium text-slate-200 hover:bg-festive-surface hover:text-amber-400"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('catalogue')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-base font-medium text-slate-200 hover:bg-festive-surface hover:text-amber-400"
          >
            Shop All Lights
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-base font-medium text-slate-200 hover:bg-festive-surface hover:text-amber-400"
          >
            Categories
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-base font-medium text-slate-200 hover:bg-festive-surface hover:text-amber-400"
          >
            About Us
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-base font-medium text-slate-200 hover:bg-festive-surface hover:text-amber-400"
          >
            Frequently Asked Questions
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-base font-medium text-slate-200 hover:bg-festive-surface hover:text-amber-400"
          >
            Contact & Support
          </button>

          <div className="pt-3 border-t border-festive-border/50">
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp Enquiry</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
