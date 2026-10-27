import React from 'react';
import { CATEGORIES } from '../data/categories';
import { Flame, Wand2, Layers, Zap, Home, PackageOpen, Sparkles } from 'lucide-react';

interface CategoryFiltersProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Wand2':
        return <Wand2 className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Home':
        return <Home className="w-5 h-5" />;
      case 'PackageOpen':
        return <PackageOpen className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="categories" className="py-12 bg-festive-midnight border-y border-festive-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Browse By Category
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            Curated Festive Lighting Collections
          </h2>
        </div>

        {/* Categories Grid / Horizontal Scroll on Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === (cat.id === 'all' ? 'All' : cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id === 'all' ? 'All' : cat.id)}
                className={`p-3.5 sm:p-4 rounded-xl flex flex-col items-center text-center transition-all duration-300 focus:outline-none group relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/25 to-amber-600/10 border-2 border-amber-400 text-white shadow-glow-sm scale-[1.02]'
                    : 'bg-festive-surface/80 hover:bg-festive-card border border-festive-border/70 text-slate-300 hover:text-white hover:border-amber-500/40'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2.5 transition-colors ${
                    isSelected
                      ? 'bg-amber-500 text-festive-dark shadow-sm'
                      : 'bg-festive-dark text-amber-400 group-hover:bg-amber-500/20 group-hover:text-amber-300'
                  }`}
                >
                  {getCategoryIcon(cat.iconName)}
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-wide leading-tight">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 line-clamp-1 hidden sm:block">
                  {cat.shortDesc}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
