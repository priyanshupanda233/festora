export interface ProductVariations {
  colors: string[];
  sizes: string[];
  pack_size?: string;
}

export type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'limited';

export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  price: number | null; // null represents "Price on Enquiry"
  variations: ProductVariations;
  availability: AvailabilityStatus;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string; // Composite ID: `${productId}-${selectedColor}-${selectedSize}`
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CustomerDetails {
  name: string;
  contact: string;
  location: string;
  notes: string;
}

export interface SiteConfig {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  announcementText: string;
  currency: string;
  currencySymbol: string;
  businessAddress?: string;
  businessHours?: string;
  email?: string;
  phoneNumber?: string;
}

export type SortOption = 
  | 'featured' 
  | 'price-asc' 
  | 'price-desc' 
  | 'name-asc' 
  | 'name-desc';
