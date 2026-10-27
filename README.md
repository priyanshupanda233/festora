# ✨ Festora — Festive Decorative LED Lights Website & Admin Portal

A full-stack, responsive web application for selling festive decorative electronic LED lights and illumination products across India. Includes a customer-facing product catalogue with an interactive enquiry cart and direct WhatsApp handoff, alongside a private authenticated Admin Dashboard for catalogue and image management.

---

## 🌟 Key Features

### 🛍️ Public Product Catalogue (`/`)
- **Festive Indian Brand Identity:** Warm gold, deep midnight navy, and glowing ambient accents with typography inspired by Indian festive aesthetics.
- **Announcement Bar:** Top notification banner highlighting seasonal collections.
- **Hero Section:** Diwali festive home decor photography with "Explore Collection" smooth scroll and direct WhatsApp enquiry.
- **Category Navigation & Filtering:** 
  - LED Diyas and Lamps
  - Fairy and String Lights
  - Curtain and Waterfall Lights
  - Rope and Strip Lights
  - Hanging and Entrance Decorations
  - Decorative Lighting Sets
  - All Products
- **Real-Time Search & Sorting:** Search by keyword/category; sort by Featured, Price (Low to High / High to Low), or Alphabetically (A–Z / Z–A).
- **15 Initial Sample LED Products:** Realistic photography, Indian Rupee (`₹`) pricing, color and length variations, and explicit "Price on Enquiry" handling.
- **Product Details Modal:** High-resolution view, length/color selection, quantity counter, and single-item WhatsApp enquiry option.
- **Informative Sections:** Benefits highlights, About story, 6-item interactive FAQ accordion, and Contact channels.

### 🛒 Shopping & Enquiry Cart (`/cart` or Slide-Over Drawer)
- **Local Persistence:** Retains customer cart selections in `localStorage` across page refreshes.
- **Price Integrity & Live Sync:** Automatically recalculates subtotals and flags out-of-stock or updated products against authoritative database records.
- **Priced vs. Unpriced Handling:** Clearly distinguishes priced line subtotals from items requiring custom quotation.
- **Optional Delivery Details:** Optional fields for Customer Name, Contact Number, Delivery City/Pincode, and Custom Requirements without forcing a customer login.

### 💬 Official WhatsApp Enquiry Integration
- Generates a structured enquiry message adhering strictly to business requirements:
  - Selected products, variations, unit prices, quantities, and line subtotals.
  - Calculated subtotals for priced items and counters for quotation items.
  - Optional customer delivery details.
  - Standard confirmation checklist (stock, bulk discounts, transit time, delivery charges).
- Encoded safely (`encodeURIComponent`) into official click-to-chat links (`https://wa.me/{NUMBER}?text={MESSAGE}`).
- Includes validation warnings if the WhatsApp number is unset or remains on placeholder (`91XXXXXXXXXX`).

### 🔐 Private Admin Dashboard (`/admin`)
- **Server-Side Authentication:** Single administrator authentication verified on the backend via bcrypt password comparison and signed JSON Web Tokens (JWT).
- **Protected API Endpoints:** All write operations (`POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`, `POST /api/upload`) require a valid Bearer token.
- **Zero Frontend Secrets:** Passwords and JWT secrets remain strictly server-side.
- **Product Management:**
  - Add New Product with image upload (supports JPEG, PNG, WebP up to 5MB).
  - Edit existing products with pre-filled details.
  - Delete products with confirmation modal.
  - "Price on Enquiry" toggle.
  - Variation tag management (colours, lengths, packaging).
  - Instant synchronization: Changes immediately reflect on the public catalogue for all visitors.
- **Catalogue Reset:** Quick one-click option to restore the initial 15 sample products.

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| **Frontend Framework** | React 18, Vite 5, TypeScript |
| **Styling & UI** | Tailwind CSS with custom festive palette & animations |
| **Icons** | Lucide React |
| **Backend API** | Node.js, Express 4 |
| **File Storage** | Multer persistent storage (`server/uploads/`) |
| **Database** | Persistent JSON store with atomic file writes (`server/data/products.json`) |
| **Authentication** | JWT (jsonwebtoken) & bcryptjs password hashing |
| **Alternative DB** | Supabase PostgreSQL schema with RLS (`supabase/schema.sql`) |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** LTS (v18, v20, or v24 installed)
- **npm** (comes with Node.js)

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Admin Authentication (Change these before deploying to production!)
ADMIN_USERNAME=nrusingha40690
ADMIN_PASSWORD=nrusingha
JWT_SECRET=festive_diwali_glow_super_secret_dev_key_2024_secure

# WhatsApp Business Configuration
# Set your WhatsApp number in international format without + sign, spaces, or dashes
WHATSAPP_NUMBER=917848080755

# Store Configuration
VITE_STORE_NAME="Festora"
VITE_STORE_TAGLINE="Decorative LED Lights & Festive Lighting"
VITE_STORE_EMAIL="miishnru@gmail.com"
VITE_CONTACT_PHONE="7848080755"
VITE_WHATSAPP_NUMBER=917848080755
VITE_ANNOUNCEMENT_TEXT="Light Up Your Celebrations ✨ | Discover Festora Festive Lighting Collection"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Application
You can run both backend and frontend concurrently:
```bash
npm run dev
```
Or start them individually in separate terminals:
- **Backend API Server:**
  ```bash
  npm run server
  ```
  *(Starts Express API on `http://localhost:5000`)*
- **Frontend Vite Server:**
  ```bash
  npm run vite
  ```
  *(Starts Vite Storefront on `http://localhost:5173`)*

---

## 🌐 URLs & Access

- **Public Storefront:** [http://localhost:5173/](http://localhost:5173/)
- **Admin Dashboard:** [http://localhost:5173/admin](http://localhost:5173/admin)
  - Username: `nrusingha40690`
  - Password: `nrusingha`
  - Contact Number: `7848080755`
  - Email: `miishnru@gmail.com`

---

## 📦 Project Structure

```
c:/Users/gupta/Desktop/light/
├── server/
│   ├── index.js          # Express server with protected CRUD & upload routes
│   ├── db.js             # Persistent Product database & 15 sample lighting items
│   ├── auth.js           # JWT authentication & bcrypt verification middleware
│   ├── data/             # Persistent JSON database (products.json)
│   └── uploads/          # Persistent uploaded images directory
├── src/
│   ├── components/
│   │   ├── AnnouncementBar.tsx    # Festive top announcement
│   │   ├── Navbar.tsx             # Sticky navbar with cart badge & mobile drawer
│   │   ├── Hero.tsx               # Festive Diwali hero section
│   │   ├── CategoryFilters.tsx    # 7 Category navigation cards
│   │   ├── ProductCard.tsx        # Product card with variations & quick stepper
│   │   ├── ProductGrid.tsx        # Search, filters, and responsive product grid
│   │   ├── ProductDetailsModal.tsx# Product zoom modal with direct enquiry
│   │   ├── CartDrawer.tsx         # Slide-over cart & WhatsApp generator
│   │   ├── BenefitsSection.tsx    # Store benefits
│   │   ├── AboutSection.tsx       # Festive story
│   │   ├── FAQSection.tsx         # 6-item accordion FAQ
│   │   ├── ContactSection.tsx     # Direct contact & enquiry hours
│   │   ├── Footer.tsx             # Brand footer with discrete admin entry
│   │   ├── Toast.tsx              # Dynamic feedback notifications
│   │   └── admin/
│   │       ├── AdminLogin.tsx         # Login form with show/hide password
│   │       ├── AdminDashboard.tsx     # Product table, counters, and controls
│   │       ├── ProductFormModal.tsx   # Add/Edit form with image uploader
│   │       └── DeleteConfirmModal.tsx # Safe deletion modal
│   ├── config/
│   │   └── siteConfig.ts          # Central site text & business settings
│   ├── context/
│   │   ├── CartContext.tsx        # Cart state, localStorage, and pricing
│   │   └── AuthContext.tsx        # Admin JWT session management
│   ├── data/
│   │   └── categories.ts          # Lighting categories configuration
│   ├── services/
│   │   └── productService.ts      # REST API client services
│   ├── types/
│   │   └── index.ts               # Shared TypeScript models
│   ├── utils/
│   │   ├── currency.ts            # Indian Rupee (INR) formatter
│   │   └── whatsapp.ts            # WhatsApp message formatter & URL builder
│   ├── App.tsx                    # Main app coordinator & route switcher
│   ├── main.tsx                   # React root entry
│   └── index.css                  # Global Tailwind CSS styles
├── public/
│   ├── favicon.svg                # Glowing Diwali diya SVG favicon
│   ├── placeholder.svg            # Fallback product graphic
│   └── images/hero.jpg            # High-resolution Diwali interior photo
├── supabase/
│   └── schema.sql                 # Optional Supabase DDL, RLS, and storage
├── .env.example                   # Template with placeholders
├── .env                           # Local development configuration
└── package.json                   # Scripts and dependencies
```

---

## 🔒 Security Summary

1. **Authentication:** Server-side verification using `bcryptjs` and `jsonwebtoken`. Passwords are never sent back to the frontend.
2. **Access Control:** All mutating endpoints (`POST`, `PUT`, `DELETE`, `/api/upload`) reject unauthenticated requests with `401 Unauthorized`.
3. **File Upload Protection:** Strict MIME type validation (JPEG, PNG, WebP) and 5MB size limit enforced server-side.
4. **Environment Isolation:** Secrets (`JWT_SECRET`, `ADMIN_PASSWORD`) are kept server-side and never bundled in client builds.
5. **Authoritative Cart Sync:** Cart prices and availability are checked against current server product data before enquiries are submitted.

---

## 🚢 Deployment Guide

### Option A: Unified Node.js Deployment (Render, Railway, Heroku, VPS)
1. Run `npm run build` to generate the frontend build in `dist/`.
2. Set environment variables on your host (`NODE_ENV=production`, `PORT`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, `WHATSAPP_NUMBER`).
3. Run `npm start` (or `node server/index.js`). The server will automatically serve the static `dist/` bundle and the `/api` routes on the single configured port.

### Option B: Frontend on Vercel/Netlify + Backend on Render/Railway
1. Deploy `server/` to Render or Railway. Set environment variables.
2. In `src/vite.config.ts`, set proxy target to your production backend URL, or configure `VITE_API_URL`.
3. Deploy frontend on Vercel with root directory set to `.`.

### Option C: Using Supabase
1. Run `supabase/schema.sql` in the Supabase SQL editor.
2. This creates the `products` table, enables Row Level Security (RLS) allowing public read and authenticated write, and configures the `product-images` storage bucket.

---

## 🧪 Verification & Automated Test Results

The application has been verified through an automated end-to-end test suite:

- [x] **Product Catalogue Loading:** `GET /api/products` returned 15 electronic/LED products with full details and photography.
- [x] **Security Rejection:** Unauthenticated write (`POST /api/products`) was correctly rejected with `401 Unauthorized`.
- [x] **Storage Protection:** Unauthenticated upload (`POST /api/upload`) was correctly rejected with `401 Unauthorized`.
- [x] **Credential Verification:** Bad credentials rejected with `401`; valid credentials issued signed JWT token.
- [x] **Session Verification:** `GET /api/admin/me` validated Bearer token.
- [x] **Admin CRUD Operations:** Successfully created a new product, updated its price/name, verified it appeared in the public catalogue, and cleanly deleted it.
- [x] **Frontend Production Build:** `tsc && vite build` completed with 0 errors (`dist/` generated).
- [x] **WhatsApp Message Generation:** Tested against Section 13 format with itemized product details, variations, quantities, line subtotals, pricing summary, optional customer details, and URL encoding.
