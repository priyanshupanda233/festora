import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag, Eye, Check, Tag } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/currency';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onToast: (message: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onToast
}) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variations?.colors?.[0] || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variations?.sizes?.[0] || ''
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, quantity, selectedColor, selectedSize);
    setAddedAnimation(true);
    onToast(`Added "${product.name}" to your enquiry cart!`);

    setTimeout(() => {
      setAddedAnimation(false);
    }, 1200);
  };

  const handleQuantityChange = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => Math.max(1, Math.min(99, prev + delta)));
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-amber-400/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Category Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-festive-dark/85 backdrop-blur-md text-amber-300 border border-amber-500/30">
            <Tag className="w-3 h-3 text-amber-400" />
            {product.category}
          </span>
        </div>

        {/* Stock Status Badge */}
        {product.availability === 'out_of_stock' && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-600/90 text-white backdrop-blur-md">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-3 right-3 z-10 p-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          aria-label={`View details of ${product.name}`}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Info Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-sans font-bold text-base sm:text-lg text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Variations Preview (Colors or Sizes) */}
          {product.variations?.colors && product.variations.colors.length > 1 && (
            <div className="mt-3" onClick={(e) => e.stopPropagation()}>
              <span className="text-[11px] font-medium text-slate-500 block mb-1">
                Colours Available:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.variations.colors.map(col => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      selectedColor === col
                        ? 'bg-amber-100 border border-amber-500 text-amber-900 font-semibold'
                        : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes or Lengths */}
          {product.variations?.sizes && product.variations.sizes.length > 1 && (
            <div className="mt-2.5" onClick={(e) => e.stopPropagation()}>
              <span className="text-[11px] font-medium text-slate-500 block mb-1">
                Length/Option:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.variations.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      selectedSize === size
                        ? 'bg-amber-100 border border-amber-500 text-amber-900 font-semibold'
                        : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Cart Action Bar */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          
          {/* Price display */}
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
              Price
            </span>
            <div className="text-lg sm:text-xl font-bold text-slate-900">
              {product.price !== null ? (
                <span className="text-amber-700">{formatINR(product.price)}</span>
              ) : (
                <span className="text-xs sm:text-sm font-semibold text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                  Price on Enquiry
                </span>
              )}
            </div>
          </div>

          {/* Quantity Stepper & Add Button */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
              <button
                onClick={(e) => handleQuantityChange(-1, e)}
                disabled={quantity <= 1}
                className="p-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-slate-800">
                {quantity}
              </span>
              <button
                onClick={(e) => handleQuantityChange(1, e)}
                className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.availability === 'out_of_stock'}
              className={`p-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-festive-dark hover:bg-amber-600 text-white hover:shadow-glow-sm'
              } disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed`}
              aria-label={`Add ${product.name} to enquiry cart`}
            >
              {addedAnimation ? (
                <Check className="w-4 h-4 text-white animate-bounce" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
