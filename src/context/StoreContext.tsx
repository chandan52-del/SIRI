import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, Category, StoreSettings, FilterState, PageType, PolicyTab } from '../types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  loading: boolean;
  error: string | null;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: (partial: Partial<FilterState>) => void;
  resetFilters: () => void;
  // Navigation
  currentPage: PageType;
  currentProductId: string | null;
  currentCategorySlug: string | null;
  policyTab: PolicyTab;
  navigateTo: (
    page: PageType,
    params?: { productId?: string; categorySlug?: string; policyTab?: PolicyTab }
  ) => void;
  // Notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  // Admin Authentication
  isAdmin: boolean;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  changeAdminPassword: (newPassword: string) => Promise<boolean>;
  // CRUD Operations
  addProduct: (product: Partial<Product>) => Promise<Product | null>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  addCategory: (category: Partial<Category>) => Promise<Category | null>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<boolean>;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<boolean>;
  uploadImage: (base64Data: string, filename: string) => Promise<string | null>;
  refreshData: () => Promise<void>;
}

const defaultSettings: StoreSettings = {
  storeName: 'SIRI',
  tagline: 'Premium Quality Shopping, Direct WhatsApp Ordering',
  description: 'Explore exclusive collections by SIRI. Browse, choose your favorites, and place hassle-free orders directly via WhatsApp.',
  currencySymbol: '₹',
  currencyCode: 'INR',
  whatsappNumber: '917349095032',
  whatsappPrefillGreeting: 'Hello SIRI! I am interested in ordering the following product.',
  phone: '+91 73490 95032',
  email: 'bmc419490@gmail.com',
  address: 'Bangalore, Karnataka, India',
  announcementText: 'Welcome to SIRI — Direct WhatsApp Ordering Available | Fast & Personal Support',
  heroTitle: 'Welcome to SIRI — Elevate Your Shopping',
  heroSubtitle: 'Discover hand-picked collections curated for elegance, everyday style, and uncompromising quality. Direct WhatsApp assistance and instant order processing.',
  heroButtonText: 'Browse Collections',
  heroImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
  socialLinks: {
    instagram: 'https://www.instagram.com/cc__.creations?dlrf=MW90dnNmbThpeTg2aQ==',
    facebook: 'https://facebook.com/siri.store',
    twitter: 'https://twitter.com/siri_store',
    youtube: 'https://youtube.com/@siri_store',
  },
  aboutText: 'Welcome to SIRI. We bring curated high-quality products directly to you without complicated checkout procedures or payment gateway hurdles. Connect with us directly on WhatsApp to order, ask questions, and receive personalized assistance.',
};

const initialFilters: FilterState = {
  search: '',
  categoryId: '',
  minPrice: undefined,
  maxPrice: undefined,
  featuredOnly: false,
  trendingOnly: false,
  newArrivalsOnly: false,
  discountOnly: false,
  inStockOnly: false,
  sort: 'newest',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Navigation state
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [currentCategorySlug, setCurrentCategorySlug] = useState<string | null>(null);
  const [policyTab, setPolicyTab] = useState<PolicyTab>('privacy');

  // Filters state
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Admin auth
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('siri_admin_token');
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {};
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      // Fetch settings
      const settingsRes = await fetch('/api/settings', { headers });
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings({ ...defaultSettings, ...settingsData });
      }

      // Fetch categories
      const catRes = await fetch('/api/categories', { headers });
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }

      // Fetch products
      const prodUrl = adminToken ? '/api/products?includeHidden=true' : '/api/products';
      const prodRes = await fetch(prodUrl, { headers });
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
    } catch (err: any) {
      console.error('Failed to load store data:', err);
      setError('Failed to connect to backend server. Operating in offline mode.');
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  // Check admin session
  useEffect(() => {
    if (!adminToken) {
      setIsAdmin(false);
      return;
    }
    fetch('/api/admin/verify', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => {
        if (res.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          setAdminToken(null);
          localStorage.removeItem('siri_admin_token');
        }
      })
      .catch(() => {
        // Fallback
        setIsAdmin(true);
      });
  }, [adminToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Browser back/forward & URL query sync
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const page = (params.get('page') as PageType) || 'home';
      const prodId = params.get('product');
      const cat = params.get('category');
      const tab = (params.get('tab') as PolicyTab) || 'privacy';

      setCurrentPage(page);
      if (prodId) setCurrentProductId(prodId);
      if (cat) setCurrentCategorySlug(cat);
      if (tab) setPolicyTab(tab);
    };

    // Initial URL sync on mount
    const params = new URLSearchParams(window.location.search);
    const page = (params.get('page') as PageType) || 'home';
    const prodId = params.get('product');
    const cat = params.get('category');
    const tab = (params.get('tab') as PolicyTab) || 'privacy';

    if (page !== 'home' || prodId || cat) {
      setCurrentPage(page);
      if (prodId) setCurrentProductId(prodId);
      if (cat) {
        setCurrentCategorySlug(cat);
        setFilters((prev) => ({ ...prev, categoryId: cat }));
      }
      if (tab) setPolicyTab(tab);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (
    page: PageType,
    params?: { productId?: string; categorySlug?: string; policyTab?: PolicyTab }
  ) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const url = new URL(window.location.href);
    url.searchParams.set('page', page);

    if (params?.productId) {
      setCurrentProductId(params.productId);
      url.searchParams.set('product', params.productId);
    } else {
      url.searchParams.delete('product');
    }

    if (params?.categorySlug) {
      setCurrentCategorySlug(params.categorySlug);
      url.searchParams.set('category', params.categorySlug);
      setFilters((prev) => ({ ...prev, categoryId: params.categorySlug || '' }));
    } else if (page !== 'products') {
      url.searchParams.delete('category');
    }

    if (params?.policyTab) {
      setPolicyTab(params.policyTab);
      url.searchParams.set('tab', params.policyTab);
    } else {
      url.searchParams.delete('tab');
    }

    window.history.pushState({}, '', url.toString());
  };

  const updateFilter = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Admin Auth Login
  const loginAdmin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAdminToken(data.token);
        localStorage.setItem('siri_admin_token', data.token);
        setIsAdmin(true);
        showToast('Admin session unlocked successfully!', 'success');
        return true;
      } else {
        showToast(data.message || 'Invalid admin password', 'error');
        return false;
      }
    } catch (err: any) {
      showToast('Error connecting to authentication service: ' + err.message, 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setIsAdmin(false);
    localStorage.removeItem('siri_admin_token');
    showToast('Admin logged out successfully', 'info');
    navigateTo('home');
  };

  const changeAdminPassword = async (newPassword: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Admin password changed successfully!', 'success');
        return true;
      } else {
        showToast(data.error || 'Failed to change password', 'error');
        return false;
      }
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // CRUD Operations
  const addProduct = async (productData: Partial<Product>): Promise<Product | null> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts((prev) => [newProduct, ...prev]);
        showToast(`Product "${newProduct.name}" created successfully!`, 'success');
        return newProduct;
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to add product', 'error');
        return null;
      }
    } catch (err: any) {
      showToast('Error adding product: ' + err.message, 'error');
      return null;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | null> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        showToast(`Product "${updated.name}" updated!`, 'success');
        return updated;
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to update product', 'error');
        return null;
      }
    } catch (err: any) {
      showToast('Error updating product: ' + err.message, 'error');
      return null;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast('Product deleted successfully', 'success');
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to delete product', 'error');
        return false;
      }
    } catch (err: any) {
      showToast('Error deleting product: ' + err.message, 'error');
      return false;
    }
  };

  const addCategory = async (categoryData: Partial<Category>): Promise<Category | null> => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(categoryData),
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories((prev) => [...prev, newCat]);
        showToast(`Category "${newCat.name}" added!`, 'success');
        return newCat;
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to add category', 'error');
        return null;
      }
    } catch (err: any) {
      showToast('Error adding category: ' + err.message, 'error');
      return null;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category | null> => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(categoryData),
      });
      if (res.ok) {
        const updated = await res.json();
        setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
        // Also refresh products since categoryName may have changed
        fetchData();
        showToast(`Category "${updated.name}" updated!`, 'success');
        return updated;
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to update category', 'error');
        return null;
      }
    } catch (err: any) {
      showToast('Error updating category: ' + err.message, 'error');
      return null;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showToast('Category deleted successfully', 'success');
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to delete category', 'error');
        return false;
      }
    } catch (err: any) {
      showToast('Error deleting category: ' + err.message, 'error');
      return false;
    }
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings((prev) => ({ ...prev, ...data.settings }));
        showToast('Store settings saved successfully!', 'success');
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to save settings', 'error');
        return false;
      }
    } catch (err: any) {
      showToast('Error saving settings: ' + err.message, 'error');
      return false;
    }
  };

  const uploadImage = async (base64Data: string, filename: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ data: base64Data, filename }),
      });
      if (res.ok) {
        const data = await res.json();
        showToast('Image uploaded successfully!', 'success');
        return data.url;
      } else {
        const err = await res.json();
        showToast(err.error || 'Image upload failed', 'error');
        return null;
      }
    } catch (err: any) {
      showToast('Upload error: ' + err.message, 'error');
      return null;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        settings,
        loading,
        error,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        currentPage,
        currentProductId,
        currentCategorySlug,
        policyTab,
        navigateTo,
        toasts,
        showToast,
        removeToast,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
        uploadImage,
        refreshData: fetchData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
