import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface AnnouncementBarProps {
  text?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ text }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 text-white text-xs sm:text-sm font-medium py-2 px-4 shadow-sm z-50 overflow-hidden">
      {/* Decorative festive sparkle overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex items-center justify-center text-center pr-8 sm:pr-0">
        <div className="flex items-center gap-2 tracking-wide font-medium">
          <Sparkles className="w-4 h-4 text-amber-200 animate-spin-slow shrink-0" />
          <span>{text || siteConfig.announcementText}</span>
          <Sparkles className="w-4 h-4 text-amber-200 animate-spin-slow shrink-0 hidden sm:inline-block" />
        </div>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white hover:bg-black/10 rounded-full transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
