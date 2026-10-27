import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { Product, SortOption } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onQuickView: (product: Product) => void;
  onToast: (message: string) => void;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onQuickView,
  onToast,
  isLoading,
  error,
  onRetry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'All') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.variations?.colors?.some(c => c.toLowerCase().includes(q)) ||
        p.variations?.sizes?.some(s => s.toLowerCase().includes(q))
      );
    }

    // Apply Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => {
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return a.price - b.price;
        });
        break;
      case 'price-desc':
        list.sort((a, b) => {
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return b.price - a.price;
        });
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'featured':
      default:
        // Default order
        break;
    }

    return list;
  }, [products, selectedCategory, searchTerm, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    onSelectCategory('All');
    setSortBy('featured');
  };

  return (
    <section id="catalogue" className="py-16 bg-festive-warmWhite scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Festive Catalogue</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Browse Decorative Lighting
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
              Select products, review prices, choose lengths & quantities, and send your WhatsApp enquiry directly to our team.
            </p>
          </div>

          {/* Product Count Pill */}
          <div className="text-sm font-medium text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm self-start md:self-auto">
            Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> of {products.length} products
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, fairy lights, curtain, diyas..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none bg-white cursor-pointer"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A to Z</option>
              <option value="name-desc">Alphabetical: Z to A</option>
            </select>
          </div>

        </div>

        {/* Active Filters Tag Pills */}
        {(selectedCategory !== 'All' || searchTerm) && (
          <div className="flex items-center flex-wrap gap-2 mb-6 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Active Filters:</span>
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-medium">
                Category: {selectedCategory}
                <button
                  onClick={() => onSelectCategory('All')}
                  className="hover:text-amber-950 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 font-medium">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="hover:text-black font-bold ml-1"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-amber-700 hover:text-amber-900 underline font-semibold ml-2 cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset all
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading festive lighting catalogue...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center max-w-lg mx-auto my-12">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-rose-900 mb-1">Failed to Load Products</h3>
            <p className="text-xs sm:text-sm text-rose-700 mb-4">{error}</p>
            <button
              onClick={onRetry}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 text-amber-500">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">No lights match your search</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              We couldn't find any products matching your current filters. Try searching with a different term or reset filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onToast={onToast}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
