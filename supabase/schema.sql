-- ==============================================================
-- DIWALI GLOW - SUPABASE DATABASE MIGRATION & RLS POLICIES
-- ==============================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL DEFAULT '/placeholder.svg',
    category TEXT NOT NULL DEFAULT 'Decorative Lighting Sets',
    price NUMERIC(10, 2) NULL, -- null represents "Price on Enquiry"
    variations JSONB NOT NULL DEFAULT '{"colors": [], "sizes": [], "pack_size": "Single Piece"}'::jsonb,
    availability TEXT NOT NULL DEFAULT 'in_stock' CHECK (availability IN ('in_stock', 'limited', 'out_of_stock')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for Products:
-- Anyone can view products (Public Read)
CREATE POLICY "Public products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Only authenticated administrators can insert products
CREATE POLICY "Authenticated admins can insert products" 
ON public.products 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Only authenticated administrators can update products
CREATE POLICY "Authenticated admins can update products" 
ON public.products 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Only authenticated administrators can delete products
CREATE POLICY "Authenticated admins can delete products" 
ON public.products 
FOR DELETE 
TO authenticated 
USING (true);

-- 4. Supabase Storage Configuration for "product-images"
-- (Run in Supabase SQL editor or create storage bucket named 'product-images' with Public enabled)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Anyone can view product images
CREATE POLICY "Public Access to Product Images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

-- Storage RLS: Authenticated admin can upload images
CREATE POLICY "Admin Upload Image" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images');

-- Storage RLS: Authenticated admin can update/delete images
CREATE POLICY "Admin Modify Image" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'product-images');

CREATE POLICY "Admin Delete Image" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'product-images');
