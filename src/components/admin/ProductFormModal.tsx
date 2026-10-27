import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Plus, AlertCircle, Check } from 'lucide-react';
import { Product } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { productService } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';

interface ProductFormModalProps {
  product: Product | null; // null means "Add New Product"
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: Product, isEdit: boolean) => void;
  onToast: (msg: string) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
  onToast
}) => {
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1].id);
  const [isPriceOnEnquiry, setIsPriceOnEnquiry] = useState(false);
  const [price, setPrice] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [availability, setAvailability] = useState<'in_stock' | 'limited' | 'out_of_stock'>('in_stock');
  const [packSize, setPackSize] = useState('');

  // Variations (Colors & Sizes)
  const [colors, setColors] = useState<string[]>([]);
  const [newColor, setNewColor] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');

  // Upload & Save State
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize or reset form
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setCategory(product.category || CATEGORIES[1].id);
      setIsPriceOnEnquiry(product.price === null || product.price === undefined);
      setPrice(product.price !== null && product.price !== undefined ? String(product.price) : '');
      setImageUrl(product.image_url || '');
      setAvailability(product.availability || 'in_stock');
      setPackSize(product.variations?.pack_size || '');
      setColors(product.variations?.colors || []);
      setSizes(product.variations?.sizes || []);
    } else {
      setName('');
      setDescription('');
      setCategory(CATEGORIES[1].id);
      setIsPriceOnEnquiry(false);
      setPrice('');
      setImageUrl('');
      setAvailability('in_stock');
      setPackSize('');
      setColors(['Warm Amber', 'Golden Glow']);
      setSizes(['Standard Length']);
    }
    setError(null);
  }, [product, isOpen]);

  if (!isOpen) return null;

  // Handle Image Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid JPEG, PNG, or WebP image.');
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB.');
      return;
    }

    if (!token) {
      setError('Authentication token missing. Please sign in again.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const res = await productService.uploadImage(file, token);
      setImageUrl(res.imageUrl);
      onToast('Image uploaded successfully to server storage!');
    } catch (err: any) {
      setError(err.message || 'Failed to upload image to server');
    } finally {
      setIsUploading(false);
    }
  };

  // Tag Handlers
  const handleAddColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor('');
    }
  };

  const handleRemoveColor = (col: string) => {
    setColors(colors.filter(c => c !== col));
  };

  const handleAddSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize('');
    }
  };

  const handleRemoveSize = (s: string) => {
    setSizes(sizes.filter(item => item !== s));
  };

  // Save Product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }

    if (!description.trim()) {
      setError('Product description is required.');
      return;
    }

    if (!isPriceOnEnquiry && (!price || isNaN(Number(price)) || Number(price) < 0)) {
      setError('Please enter a valid price in INR, or check "Price on Enquiry".');
      return;
    }

    if (!token) {
      setError('Administrator authentication required.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const productPayload = {
      name: name.trim(),
      description: description.trim(),
      category,
      price: isPriceOnEnquiry ? null : Math.round(Number(price)),
      image_url: imageUrl.trim() || '/placeholder.svg',
      availability,
      variations: {
        colors,
        sizes,
        pack_size: packSize.trim() || undefined
      }
    };

    try {
      let savedProduct: Product;
      if (product) {
        // Edit
        savedProduct = await productService.updateProduct(product.id, productPayload, token);
        onToast(`Product "${savedProduct.name}" updated successfully!`);
        onSuccess(savedProduct, true);
      } else {
        // Create
        savedProduct = await productService.createProduct(productPayload, token);
        onToast(`New product "${savedProduct.name}" added to catalogue!`);
        onSuccess(savedProduct, false);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product in database.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-festive-dark text-white border-b border-festive-border flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-festive-cream">
              {product ? 'Edit Festive Product' : 'Add New Decorative Light'}
            </h3>
            <p className="text-xs text-amber-300/80">
              {product ? 'Update specifications and images in catalogue' : 'Create a new item in your online lighting catalogue'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-festive-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Image Upload & Preview Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Product Image <span className="text-rose-500">*</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-amber-400 bg-slate-50/70 transition-colors">
              {/* Preview Thumbnail */}
              <div className="w-28 h-28 rounded-xl bg-slate-900 overflow-hidden relative shrink-0 flex items-center justify-center border border-slate-200 shadow-sm">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-500" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Choose File / Photo'}</span>
                  </button>

                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-slate-600 hover:text-rose-600 text-xs font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500">
                  Accepts JPEG, PNG, WebP (max 5MB). Images are stored persistently on the server.
                </p>

                {/* Optional direct URL input */}
                <div className="pt-1">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or enter image URL path (e.g. /uploads/lights.jpg)"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Flameless LED Diya Set (Pack of 12)"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm font-medium"
            />
          </div>

          {/* Category & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm bg-white"
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Stock Availability
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm bg-white"
              >
                <option value="in_stock">In Stock for Festive Delivery</option>
                <option value="limited">Limited Quantity</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Price in Indian Rupees (₹)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-900">
                <input
                  type="checkbox"
                  checked={isPriceOnEnquiry}
                  onChange={(e) => setIsPriceOnEnquiry(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span>Mark as "Price on Enquiry"</span>
              </label>
            </div>

            {!isPriceOnEnquiry ? (
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 499"
                  required={!isPriceOnEnquiry}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm font-bold bg-white"
                />
              </div>
            ) : (
              <p className="text-xs text-amber-800 italic">
                Customers will see "Price on Enquiry" and quotation will be requested on WhatsApp.
              </p>
            )}
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of festive features, power options, and decor applications..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-sm leading-relaxed"
            />
          </div>

          {/* Variations: Colours */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Colour Variations
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddColor();
                  }
                }}
                placeholder="e.g. Warm Amber, Golden Glow, Multicolour"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            {colors.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {colors.map(col => (
                  <span
                    key={col}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    <span>{col}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(col)}
                      className="text-slate-400 hover:text-rose-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Variations: Lengths / Sizes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Length / Size Variations
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSize();
                  }
                }}
                placeholder="e.g. 10 Metres, 3m x 3m Curtain, Standard"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            {sizes.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {sizes.map(size => (
                  <span
                    key={size}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    <span>{size}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(size)}
                      className="text-slate-400 hover:text-rose-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Packaging / Pack Size */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pack Size (Optional)
            </label>
            <input
              type="text"
              value={packSize}
              onChange={(e) => setPackSize(e.target.value)}
              placeholder="e.g. Pack of 12, Single Roll with Adapter"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{product ? 'Save Changes' : 'Create Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
