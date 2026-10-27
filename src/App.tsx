import React, { useState, useEffect, useCallback } from 'react';
import { Product } from './types';
import { productService } from './services/productService';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

// Storefront Components
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilters } from './components/CategoryFilters';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { BenefitsSection } from './components/BenefitsSection';
import { AboutSection } from './components/AboutSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

export const App: React.FC = () => {
  // Navigation / Routing State
  const [currentPage, setCurrentPage] = useState<'home' | 'admin'>(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'home';
  });

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname === '/admin' ? 'admin' : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPage = (page: 'home' | 'admin') => {
    setCurrentPage(page);
    const newPath = page === 'admin' ? '/admin' : '/';
    window.history.pushState({}, '', newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Catalogue Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Selected Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Contexts
  const { syncCartWithCatalogue } = useCart();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Load products from persistent database
  const loadProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      setLoadError(null);
      const data = await productService.getProducts();
      setProducts(data);
      syncCartWithCatalogue(data);
    } catch (err: any) {
      console.error('Error loading products:', err);
      setLoadError(err.message || 'Unable to connect to product server');
    } finally {
      setIsLoadingProducts(false);
    }
  }, [syncCartWithCatalogue]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Section navigation helper
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render Admin View
  if (currentPage === 'admin') {
    if (isAuthLoading) {
      return (
        <div className="min-h-screen bg-festive-dark flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <AdminLogin
          onBackToStore={() => navigateToPage('home')}
        />
      );
    }

    return (
      <>
        <AdminDashboard
          products={products}
          onProductsUpdated={(updated) => {
            setProducts(updated);
            syncCartWithCatalogue(updated);
          }}
          onNavigateHome={() => navigateToPage('home')}
          onToast={(msg) => setToastMessage(msg)}
        />
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      </>
    );
  }

  // Render Public Storefront View
  return (
    <div className="min-h-screen flex flex-col bg-festive-warmWhite selection:bg-amber-500/20 selection:text-festive-midnight">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigatePage={navigateToPage}
        onNavigateSection={scrollToSection}
      />

      {/* 3. Hero Section */}
      <Hero
        onExploreClick={() => scrollToSection('catalogue')}
      />

      {/* 4. Category Navigation */}
      <CategoryFilters
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToSection('catalogue');
        }}
      />

      {/* 5. Product Catalogue */}
      <ProductGrid
        products={products}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onQuickView={(p) => setQuickViewProduct(p)}
        onToast={(msg) => setToastMessage(msg)}
        isLoading={isLoadingProducts}
        error={loadError}
        onRetry={loadProducts}
      />

      {/* 6. Benefits Section */}
      <BenefitsSection />

      {/* 7. About Section */}
      <AboutSection />

      {/* 8. FAQ Section */}
      <FAQSection />

      {/* 9. Contact Section */}
      <ContactSection />

      {/* 10. Footer */}
      <Footer
        onNavigateSection={scrollToSection}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onNavigatePage={navigateToPage}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onToast={(msg) => setToastMessage(msg)}
      />

      {/* Enquiry Cart Drawer */}
      <CartDrawer />

      {/* Toast Notifications */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};
export default App;
