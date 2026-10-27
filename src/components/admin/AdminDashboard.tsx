import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  LogOut,
  Flame,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Package
} from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../utils/currency';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { ProductFormModal } from './ProductFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { siteConfig } from '../../config/siteConfig';

interface AdminDashboardProps {
  products: Product[];
  onProductsUpdated: (products: Product[]) => void;
  onNavigateHome: () => void;
  onToast: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onProductsUpdated,
  onNavigateHome,
  onToast
}) => {
  const { logout, adminUser, token } = useAuth();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, search, categoryFilter]);

  // Categories list from current catalogue
  const existingCategories = useMemo(() => {
    const set = new Set(products.map(p => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Handle Create / Edit callbacks
  const handleProductSaved = (saved: Product, isEdit: boolean) => {
    if (isEdit) {
      onProductsUpdated(products.map(p => (p.id === saved.id ? saved : p)));
    } else {
      onProductsUpdated([saved, ...products]);
    }
  };

  const handleProductDeleted = (deletedId: string) => {
    onProductsUpdated(products.filter(p => p.id !== deletedId));
  };

  // Handle Reset to initial 15 seed lights
  const handleResetCatalogue = async () => {
    if (!token) return;
    const confirm = window.confirm(
      'Are you sure you want to reset the catalogue to the original 15 sample festive lighting products?'
    );
    if (!confirm) return;

    try {
      setIsResetting(true);
      const reset = await productService.resetCatalogue(token);
      onProductsUpdated(reset);
      onToast('Catalogue reset to initial 15 festive lighting products!');
    } catch (err: any) {
      alert(err.message || 'Failed to reset catalogue.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 bg-festive-dark border-b border-festive-border shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 flex items-center justify-center shadow-glow-sm">
                <div className="w-full h-full bg-festive-dark rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <h1 className="font-serif text-lg font-bold text-festive-cream tracking-wide">
                  {siteConfig.storeName} <span className="text-amber-400 text-xs font-sans font-medium uppercase ml-1">Admin</span>
                </h1>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-festive-surface border border-festive-border transition-colors"
                title="View Public Storefront"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View Storefront</span>
              </button>

              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 border border-rose-500/30 transition-colors"
                title="Sign out of admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Dashboard Title & Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-festive-midnight p-6 rounded-3xl border border-festive-border shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Signed in as {adminUser?.username || 'Administrator'}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Catalogue Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your festive lighting catalogue without modifying source code. Changes appear instantly for all visitors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Total Count Badge */}
            <div className="px-4 py-2.5 rounded-xl bg-festive-surface border border-festive-border text-center">
              <span className="block text-xl font-bold text-amber-400">
                {products.length}
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Total Products
              </span>
            </div>

            {/* Add New Product Button */}
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-festive-dark font-bold text-xs uppercase tracking-wider shadow-glow-sm transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-festive-midnight p-4 rounded-2xl border border-festive-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-festive-surface border border-festive-border text-white text-xs placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-festive-surface border border-festive-border text-xs text-slate-300 font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {existingCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Reset initial sample data button */}
          <button
            onClick={handleResetCatalogue}
            disabled={isResetting}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
            title="Reset to 15 default festive lighting products"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset 15 Sample Lights</span>
          </button>
        </div>

        {/* Product Management Table / Cards */}
        <div className="bg-festive-midnight rounded-2xl border border-festive-border overflow-hidden shadow-sm">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Package className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <h3 className="text-base font-bold text-white mb-1">No products found</h3>
              <p className="text-xs text-slate-400">Try adjusting your search query or category filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-festive-surface text-slate-400 uppercase tracking-wider font-semibold border-b border-festive-border">
                  <tr>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (INR)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-festive-border/60">
                  {filteredProducts.map((p) => {
                    return (
                      <tr key={p.id} className="hover:bg-festive-surface/50 transition-colors">
                        {/* Thumbnail */}
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden relative border border-festive-border shrink-0">
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        </td>

                        {/* Name & Variations */}
                        <td className="py-3 px-4 font-medium text-white max-w-xs">
                          <div className="font-semibold text-sm line-clamp-1">{p.name}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {p.description}
                          </div>
                          {p.variations?.colors && p.variations.colors.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {p.variations.colors.slice(0, 3).map(c => (
                                <span key={c} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                                  {c}
                                </span>
                              ))}
                              {p.variations.colors.length > 3 && (
                                <span className="text-[9px] text-slate-400">+{p.variations.colors.length - 3}</span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-slate-300">
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold bg-festive-surface border border-festive-border text-amber-300">
                            {p.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-bold">
                          {p.price !== null ? (
                            <span className="text-amber-400">{formatINR(p.price)}</span>
                          ) : (
                            <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                              Price on Enquiry
                            </span>
                          )}
                        </td>

                        {/* Availability */}
                        <td className="py-3 px-4">
                          {p.availability === 'in_stock' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              In Stock
                            </span>
                          )}
                          {p.availability === 'limited' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Limited
                            </span>
                          )}
                          {p.availability === 'out_of_stock' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              Out of Stock
                            </span>
                          )}
                        </td>

                        {/* Action buttons */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setIsFormOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-festive-surface hover:bg-festive-card text-slate-300 hover:text-amber-400 border border-festive-border transition-colors"
                              title={`Edit ${p.name}`}
                              aria-label={`Edit ${p.name}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeletingProduct(p)}
                              className="p-1.5 rounded-lg bg-festive-surface hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-festive-border hover:border-rose-800 transition-colors"
                              title={`Delete ${p.name}`}
                              aria-label={`Delete ${p.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        product={editingProduct}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSuccess={handleProductSaved}
        onToast={onToast}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        product={deletingProduct}
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onDeleted={handleProductDeleted}
        onToast={onToast}
      />
    </div>
  );
};
