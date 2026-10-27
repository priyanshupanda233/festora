import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, MessageCircle, Check, Tag } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { siteConfig } from '../config/siteConfig';
import { buildWhatsAppUrl, generateSingleProductWhatsAppMessage } from '../utils/whatsapp';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onToast: (message: string) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onToast
}) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedColor(product.variations?.colors?.[0] || '');
      setSelectedSize(product.variations?.sizes?.[0] || '');
      setAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor, selectedSize);
    setAdded(true);
    onToast(`Added "${product.name}" (${quantity} qty) to enquiry cart!`);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  // Direct WhatsApp single item message
  const variationString = [selectedColor, selectedSize, product.variations?.pack_size]
    .filter(Boolean)
    .join(' | ');

  const singleItemMessage = generateSingleProductWhatsAppMessage(
    product.name,
    product.price,
    quantity,
    variationString
  );

  const { url: directWhatsAppUrl } = buildWhatsAppUrl(
    siteConfig.whatsappNumber,
    singleItemMessage
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col md:flex-row animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-slate-950 relative overflow-hidden flex items-center justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-festive-dark/90 text-amber-300 backdrop-blur-md border border-amber-500/30">
              <Tag className="w-3.5 h-3.5" />
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Information Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Stock indicator */}
            <div className="mb-2">
              {product.availability === 'in_stock' && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ● In Stock for Diwali Delivery
                </span>
              )}
              {product.availability === 'limited' && (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  ● Limited Festive Stock
                </span>
              )}
              {product.availability === 'out_of_stock' && (
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  ● Temporarily Out of Stock
                </span>
              )}
            </div>

            {/* Product Title */}
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {product.name}
            </h2>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-amber-700">
                {product.price !== null ? formatINR(product.price) : 'Price on Enquiry'}
              </span>
              {product.price !== null && (
                <span className="text-xs text-slate-500 font-medium">
                  (Includes all standard festive accessories)
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Product Details
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Colour Variations */}
            {product.variations?.colors && product.variations.colors.length > 0 && (
              <div className="mt-5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Select Colour: <span className="text-amber-800 font-normal">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variations.colors.map(col => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedColor === col
                          ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size / Length Variations */}
            {product.variations?.sizes && product.variations.sizes.length > 0 && (
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Length / Size Option: <span className="text-amber-800 font-normal">{selectedSize}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variations.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedSize === size
                          ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pack Size Info */}
            {product.variations?.pack_size && (
              <div className="mt-3 text-xs text-slate-600 font-medium">
                Standard Packaging: <span className="font-bold text-slate-800">{product.variations.pack_size}</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="mt-8 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-slate-900 text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={product.availability === 'out_of_stock'}
                className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-glow-sm'
                } disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 animate-bounce" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Enquiry Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct WhatsApp button */}
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Direct WhatsApp Enquiry For This Item</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
