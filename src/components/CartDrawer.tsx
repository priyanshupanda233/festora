import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { siteConfig } from '../config/siteConfig';
import { formatINR, formatSubtotal } from '../utils/currency';
import { generateCartWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalItemsCount,
    pricedSubtotal,
    unpricedCount,
    unavailableCount,
    customerDetails,
    setCustomerDetails
  } = useCart();

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [whatsappSentWarning, setWhatsappSentWarning] = useState(false);

  if (!isOpen) return null;

  // Generate WhatsApp Enquiry URL
  const enquiryMessage = generateCartWhatsAppMessage(items, customerDetails);
  const { url: whatsappUrl, validation } = buildWhatsAppUrl(
    siteConfig.whatsappNumber,
    enquiryMessage
  );

  const handleWhatsAppClick = () => {
    if (items.length === 0) return;
    setWhatsappSentWarning(true);
    // Open WhatsApp in new window/tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 bg-festive-dark text-white border-b border-festive-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="font-serif text-lg font-bold text-festive-cream">
                  Enquiry Cart
                </h2>
                <span className="text-xs text-amber-300/80">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors px-2 py-1"
                  title="Clear all items from cart"
                >
                  Clear Cart
                </button>
              )}
              <button
                onClick={closeCart}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-festive-surface transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Setup Alert: WhatsApp placeholder notice */}
          {validation.isPlaceholder && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Configuration Notice:</span> The WhatsApp number is currently set to placeholder <code className="bg-amber-200/60 px-1 rounded font-mono">91XXXXXXXXXX</code>. Test links will open with standard test destination until configured in <code className="bg-amber-200/60 px-1 rounded font-mono">.env</code>.
              </div>
            </div>
          )}

          {/* Unavailable products warning */}
          {unavailableCount > 0 && (
            <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 flex items-start gap-2 text-xs text-rose-900">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Attention:</span> {unavailableCount} item(s) in your cart are currently out of stock or have been updated in the catalogue. Please remove them to proceed.
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-800 mb-1">
                  Your Enquiry Cart is Empty
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mb-6">
                  Browse our Diwali decorative lights catalogue and add your favorite lights to create an enquiry.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-xl bg-festive-dark text-amber-400 font-bold text-xs uppercase tracking-wider hover:bg-slate-900 transition-colors"
                >
                  Start Exploring Lights
                </button>
              </div>
            ) : (
              items.map((item) => {
                const { product, quantity, selectedColor, selectedSize } = item;
                const isOutOfStock = product.availability === 'out_of_stock';
                const hasPrice = product.price !== null && product.price !== undefined;
                const lineSubtotal = hasPrice ? product.price! * quantity : null;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all flex gap-3 ${
                      isOutOfStock
                        ? 'bg-rose-50/50 border-rose-200 opacity-80'
                        : 'bg-white border-slate-200 hover:border-amber-300 shadow-sm'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl bg-slate-900 overflow-hidden shrink-0 relative">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Remove item"
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Selected variations */}
                        <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] text-slate-500">
                          {selectedColor && (
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                              {selectedColor}
                            </span>
                          )}
                          {selectedSize && (
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                              {selectedSize}
                            </span>
                          )}
                        </div>

                        {isOutOfStock && (
                          <span className="text-[10px] font-bold text-rose-600 block mt-1">
                            Currently Out of Stock
                          </span>
                        )}
                      </div>

                      {/* Pricing and Stepper */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        {/* Price */}
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {hasPrice ? (
                              <span>{formatINR(product.price)}</span>
                            ) : (
                              <span className="text-amber-700">Price on Enquiry</span>
                            )}
                          </div>
                          {hasPrice && quantity > 1 && (
                            <div className="text-[10px] text-slate-500">
                              Subtotal: {formatSubtotal(lineSubtotal!)}
                            </div>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            className="p-1 text-slate-600 hover:bg-slate-200 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-800">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            className="p-1 text-slate-600 hover:bg-slate-200 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Optional Customer Information Accordion */}
            {items.length > 0 && (
              <div className="mt-6 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/70">
                <button
                  onClick={() => setShowCustomerForm(prev => !prev)}
                  className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span>Optional Delivery & Contact Details</span>
                    <span className="text-[10px] font-normal text-slate-500">(Recommended)</span>
                  </span>
                  {showCustomerForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showCustomerForm && (
                  <div className="p-4 bg-white border-t border-slate-200 space-y-3 animate-fadeIn text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={customerDetails.name}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Contact Phone Number
                      </label>
                      <input
                        type="text"
                        value={customerDetails.contact}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, contact: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Delivery City / Location
                      </label>
                      <input
                        type="text"
                        value={customerDetails.location}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, location: e.target.value })}
                        placeholder="e.g. Mumbai, Maharashtra (Pincode: 400001)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Special Instructions / Bulk Notes
                      </label>
                      <textarea
                        rows={2}
                        value={customerDetails.notes}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, notes: e.target.value })}
                        placeholder="e.g. Require urgent dispatch before Diwali festival; enquire for society decoration"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Drawer Footer with Totals and WhatsApp Trigger */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-4">
              
              {/* Pricing Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Priced Items Subtotal:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {pricedSubtotal > 0 ? formatSubtotal(pricedSubtotal) : 'Price on Enquiry'}
                  </span>
                </div>

                {unpricedCount > 0 && (
                  <div className="flex items-center justify-between text-amber-800 bg-amber-50 px-2 py-1 rounded">
                    <span>Items requiring custom quotation:</span>
                    <span className="font-bold">{unpricedCount} item(s)</span>
                  </div>
                )}

                <div className="flex items-start gap-1.5 pt-1 text-[11px] text-slate-500">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    Subtotal excludes delivery & bulk discounts. Final invoice and payment details will be confirmed directly on WhatsApp.
                  </span>
                </div>
              </div>

              {/* Notice after WhatsApp click */}
              {whatsappSentWarning && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  <p className="font-semibold flex items-center gap-1.5 mb-1">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp chat has opened!
                  </p>
                  <p className="text-[11px] text-emerald-800">
                    Your enquiry was pre-filled. Please press <strong>"Send"</strong> in WhatsApp to deliver the message to our team. Your cart remains saved here.
                  </p>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                onClick={handleWhatsAppClick}
                disabled={unavailableCount > 0}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <MessageCircle className="w-5 h-5 text-white" />
                <span>Enquire on WhatsApp</span>
              </button>

              <button
                onClick={closeCart}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Continue Browsing
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
