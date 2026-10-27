import { Product, SiteConfig } from '../types';

export const productService = {
  /**
   * Fetch all products from persistent server database
   */
  async getProducts(): Promise<Product[]> {
    const res = await fetch('/api/products');
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Fetch single product details
   */
  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) {
      throw new Error(`Product not found: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Fetch public site configuration
   */
  async getConfig(): Promise<SiteConfig> {
    const res = await fetch('/api/config');
    if (!res.ok) {
      throw new Error('Failed to load site configuration');
    }
    return res.json();
  },

  /**
   * Upload image file to server persistent storage
   */
  async uploadImage(file: File, token: string): Promise<{ imageUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to upload product image');
    }

    return data;
  },

  /**
   * Create new product (Admin only)
   */
  async createProduct(product: Partial<Product>, token: string): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create product');
    }

    return data.product;
  },

  /**
   * Update existing product (Admin only)
   */
  async updateProduct(id: string, updates: Partial<Product>, token: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update product');
    }

    return data.product;
  },

  /**
   * Delete product (Admin only)
   */
  async deleteProduct(id: string, token: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to delete product');
    }
  },

  /**
   * Reset catalogue to initial 15 products (Admin only)
   */
  async resetCatalogue(token: string): Promise<Product[]> {
    const res = await fetch('/api/admin/reset-catalogue', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to reset catalogue');
    }

    return data.products;
  }
};
