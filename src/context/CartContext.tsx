import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product, CustomerDetails } from '../types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  customerDetails: CustomerDetails;
  setCustomerDetails: React.Dispatch<React.SetStateAction<CustomerDetails>>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  pricedSubtotal: number;
  unpricedCount: number;
  unavailableCount: number;
  syncCartWithCatalogue: (freshProducts: Product[]) => void;
}

const CART_STORAGE_KEY = 'diwali_glow_cart_v1';
const CUSTOMER_STORAGE_KEY = 'diwali_glow_customer_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { name: '', contact: '', location: '', notes: '' };
    } catch {
      return { name: '', contact: '', location: '', notes: '' };
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  // Persist items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  // Persist customer details
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerDetails));
    } catch (e) {
      console.error('Failed to save customer details:', e);
    }
  }, [customerDetails]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(prev => !prev);

  const addItem = useCallback((
    product: Product,
    quantity: number = 1,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    const color = selectedColor || product.variations?.colors?.[0] || '';
    const size = selectedSize || product.variations?.sizes?.[0] || '';
    const compositeId = `${product.id}__${color}__${size}`;

    setItems(currentItems => {
      const existingIndex = currentItems.findIndex(item => item.id === compositeId);

      if (existingIndex > -1) {
        const updated = [...currentItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          product // always ensure fresh product details
        };
        return updated;
      }

      return [
        ...currentItems,
        {
          id: compositeId,
          product,
          quantity: Math.max(1, quantity),
          selectedColor: color,
          selectedSize: size
        }
      ];
    });

    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === cartItemId ? { ...item, quantity: Math.min(999, newQuantity) } : item
      )
    );
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Sync cart with authoritative fresh catalogue data
  const syncCartWithCatalogue = useCallback((freshProducts: Product[]) => {
    if (!freshProducts || freshProducts.length === 0) return;

    setItems(currentItems => {
      let changed = false;
      const updated = currentItems.map(item => {
        const fresh = freshProducts.find(p => p.id === item.product.id);
        if (!fresh) {
          // Flag as unavailable
          if (item.product.availability !== 'out_of_stock') {
            changed = true;
            return {
              ...item,
              product: {
                ...item.product,
                availability: 'out_of_stock' as const
              }
            };
          }
          return item;
        }

        // Check if price or availability changed
        if (
          item.product.price !== fresh.price ||
          item.product.name !== fresh.name ||
          item.product.image_url !== fresh.image_url ||
          item.product.availability !== fresh.availability
        ) {
          changed = true;
          return {
            ...item,
            product: fresh
          };
        }

        return item;
      });

      return changed ? updated : currentItems;
    });
  }, []);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const pricedSubtotal = items.reduce((sum, item) => {
    if (item.product.availability === 'out_of_stock') return sum;
    if (item.product.price !== null && item.product.price !== undefined) {
      return sum + item.product.price * item.quantity;
    }
    return sum;
  }, 0);

  const unpricedCount = items.filter(
    item => item.product.availability !== 'out_of_stock' && (item.product.price === null || item.product.price === undefined)
  ).length;

  const unavailableCount = items.filter(
    item => item.product.availability === 'out_of_stock'
  ).length;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        customerDetails,
        setCustomerDetails,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItemsCount,
        pricedSubtotal,
        unpricedCount,
        unavailableCount,
        syncCartWithCatalogue
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
