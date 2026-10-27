import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Product } from '../../types';
import { productService } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';

interface DeleteConfirmModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: (productId: string) => void;
  onToast: (msg: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  product,
  isOpen,
  onClose,
  onDeleted,
  onToast
}) => {
  const { token } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    if (!token) {
      setError('Admin token required.');
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      await productService.deleteProduct(product.id, token);
      onToast(`Product "${product.name}" deleted from catalogue.`);
      onDeleted(product.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product from database.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Delete Product
            </h3>
            <p className="text-xs text-slate-500">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          Are you sure you want to delete <strong className="text-slate-900">"{product.name}"</strong>? It will be permanently removed from your active public catalogue.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
