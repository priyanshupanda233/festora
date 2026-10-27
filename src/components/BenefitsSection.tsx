import React from 'react';
import { SITE_BENEFITS } from '../config/siteConfig';
import { Sparkles, MessageSquare, Compass, Boxes } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-500" />;
      case 'MessageSquare':
        return <MessageSquare className="w-6 h-6 text-amber-500" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-amber-500" />;
      case 'Boxes':
        return <Boxes className="w-6 h-6 text-amber-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {SITE_BENEFITS.map((b, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-festive-warmWhite/80 border border-slate-200 hover:border-amber-400/50 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {getIcon(b.icon)}
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 mb-2">
                {b.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
