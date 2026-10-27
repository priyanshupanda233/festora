import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';
import { db } from './db.js';
import { verifyCredentials, generateToken, authenticateAdmin } from './auth.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true' || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

// Persistent Uploads Directory for local/VPS
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!isVercel && !fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (e) {
    console.warn('Could not create UPLOADS_DIR:', e);
  }
}

// Multer in-memory storage for compatibility with both serverless and local
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve persistent uploads locally
if (fs.existsSync(UPLOADS_DIR)) {
  app.use('/uploads', express.static(UPLOADS_DIR));
}

// -------------------------------------------------------------
// PUBLIC API ROUTES
// -------------------------------------------------------------

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = db.getAll();
    res.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

// Public store configuration (non-sensitive)
app.get('/api/config', (req, res) => {
  res.json({
    storeName: process.env.VITE_STORE_NAME || 'Festora',
    tagline: process.env.VITE_STORE_TAGLINE || 'Decorative LED Lights & Festive Lighting',
    whatsappNumber: process.env.WHATSAPP_NUMBER || '917848080755',
    phoneNumber: process.env.VITE_CONTACT_PHONE || '7848080755',
    email: process.env.VITE_STORE_EMAIL || 'miishnru@gmail.com',
    announcementText: process.env.VITE_ANNOUNCEMENT_TEXT || 'Light Up Your Celebrations ✨ | Discover Festora Festive Lighting Collection',
    currency: 'INR',
    currencySymbol: '₹'
  });
});

// -------------------------------------------------------------
// ADMIN AUTHENTICATION ROUTES
// -------------------------------------------------------------

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const isValid = verifyCredentials(username.trim(), password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }

  const token = generateToken({ role: 'admin', username: username.trim() });
  res.json({
    message: 'Authentication successful',
    token,
    user: {
      username: username.trim(),
      role: 'admin'
    }
  });
});

// Admin verify session
app.get('/api/admin/me', authenticateAdmin, (req, res) => {
  res.json({
    authenticated: true,
    user: req.admin
  });
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// -------------------------------------------------------------
// PROTECTED PRODUCT MANAGEMENT ROUTES (Admin Only)
// -------------------------------------------------------------

// Upload product image
app.post('/api/upload', authenticateAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds maximum limit of 5MB.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    // If local/VPS environment with writable disk:
    if (!isVercel && fs.existsSync(UPLOADS_DIR)) {
      try {
        const safeName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(safeName) || '.jpg';
        const base = path.basename(safeName, ext);
        const filename = `${base}-${uniqueSuffix}${ext}`;
        const filePath = path.join(UPLOADS_DIR, filename);

        fs.writeFileSync(filePath, req.file.buffer);
        const imageUrl = `/uploads/${filename}`;
        return res.status(201).json({
          message: 'Image uploaded successfully',
          imageUrl,
          filename
        });
      } catch (writeErr) {
        console.warn('Disk write failed, using data URL fallback:', writeErr);
      }
    }

    // Serverless (Vercel) persistent fallback: Base64 data URI
    const b64 = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${b64}`;
    res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl,
      filename: req.file.originalname
    });
  });
});

// Create product
app.post('/api/products', authenticateAdmin, (req, res) => {
  try {
    const { name, description, price, category, variations, availability, image_url } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Product name is required.' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Product description is required.' });
    }

    const newProduct = db.create({
      name,
      description,
      price,
      category,
      variations,
      availability,
      image_url
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Failed to create product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
app.put('/api/products/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updated = db.update(id, req.body);
    res.json({
      message: 'Product updated successfully',
      product: updated
    });
  } catch (error) {
    console.error('Failed to update product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
app.delete('/api/products/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.delete(id);

    // Clean up uploaded file if it is an uploaded file and not shared (local only)
    if (!isVercel && existing.image_url && existing.image_url.startsWith('/uploads/')) {
      const filename = path.basename(existing.image_url);
      const allProducts = db.getAll();
      const isShared = allProducts.some(p => p.image_url && p.image_url.endsWith(filename));
      if (!isShared && !filename.startsWith('sample_')) {
        const filePath = path.join(UPLOADS_DIR, filename);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.warn('Could not remove unreferenced image file:', e);
          }
        }
      }
    }

    res.json({
      message: 'Product deleted successfully',
      id
    });
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Reset products to initial 15 seed products
app.post('/api/admin/reset-catalogue', authenticateAdmin, (req, res) => {
  try {
    const reset = db.resetToInitial();
    res.json({
      message: 'Catalogue reset to initial 15 festive lighting products',
      products: reset
    });
  } catch (error) {
    console.error('Failed to reset catalogue:', error);
    res.status(500).json({ error: 'Failed to reset catalogue' });
  }
});

// Serve frontend in production (Node standalone / VPS)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
