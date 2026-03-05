import { useState, useCallback, useEffect } from 'react';
import type { Product, Store, User } from '@/types';
import { productService } from '@/services/productService';
import { storeService } from '@/services/storeService';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

// Product Store Hook
export function useProductStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = useCallback(async (keyword: string = "", category: string = "") => {
    setIsLoading(true);
    try {
      const data = await productService.getProducts(keyword, category);
      // Map backend _id to frontend id
      const mappedData = data.map((p: any) => ({
        ...p,
        id: p._id
      }));
      setProducts(mappedData);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (productData: FormData) => {
    try {
      const newProduct = await productService.addProduct(productData);
      setProducts(prev => [...prev, { ...newProduct, id: newProduct._id }]);
      return newProduct;
    } catch (error) {
      toast.error('Failed to add product');
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, productData: FormData) => {
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      setProducts(prev =>
        prev.map(p => p.id === id ? { ...updatedProduct, id: updatedProduct._id } : p)
      );
      return updatedProduct;
    } catch (error) {
      toast.error('Failed to update product');
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      toast.error('Failed to delete product');
      throw error;
    }
  }, []);

  const getProductById = useCallback((id: string) => {
    return products.find(product => product.id === id);
  }, [products]);

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    refreshProducts: fetchProducts
  };
}

// Store Store Hook
export function useStoreStore() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const transformHours = (backendHours: any[]) => {
    const defaultHours = {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '14:00', closed: false },
      sunday: { open: '', close: '', closed: true }
    };

    if (!backendHours || backendHours.length === 0) return defaultHours;

    const operatingHours: any = { ...defaultHours };
    backendHours.forEach(h => {
      const day = h.day.toLowerCase();
      if (operatingHours[day]) {
        if (h.time.toLowerCase() === 'closed') {
          operatingHours[day].closed = true;
        } else {
          const [open, close] = h.time.split(' - ');
          operatingHours[day].open = open || '';
          operatingHours[day].close = close || '';
          operatingHours[day].closed = false;
        }
      }
    });

    return operatingHours;
  };

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await storeService.getStores();
      const mappedData = data.map((s: any) => ({
        ...s,
        id: s._id,
        contactNumber: s.contact,
        mapUrl: s.mapLocation,
        statusMode: s.statusMode || 'Auto',
        operatingHours: transformHours(s.hours)
      }));
      setStores(mappedData);
    } catch (error) {
      toast.error('Failed to fetch stores');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const addStore = useCallback(async (storeData: FormData) => {
    try {
      const newStore = await storeService.addStore(storeData);
      setStores(prev => [...prev, {
        ...newStore,
        id: newStore._id,
        contactNumber: newStore.contact,
        mapUrl: newStore.mapLocation,
        statusMode: newStore.statusMode || 'Auto',
        operatingHours: transformHours(newStore.hours)
      }]);
      return newStore;
    } catch (error) {
      toast.error('Failed to add store');
      throw error;
    }
  }, []);

  const updateStore = useCallback(async (id: string, storeData: FormData) => {
    try {
      const updatedStore = await storeService.updateStore(id, storeData);
      setStores(prev =>
        prev.map(s => s.id === id ? {
          ...updatedStore,
          id: updatedStore._id,
          contactNumber: updatedStore.contact,
          mapUrl: updatedStore.mapLocation,
          statusMode: updatedStore.statusMode || 'Auto',
          operatingHours: transformHours(updatedStore.hours)
        } : s)
      );
      return updatedStore;
    } catch (error) {
      toast.error('Failed to update store');
      throw error;
    }
  }, []);

  const deleteStore = useCallback(async (id: string) => {
    try {
      await storeService.deleteStore(id);
      setStores(prev => prev.filter(store => store.id !== id));
    } catch (error) {
      toast.error('Failed to delete store');
      throw error;
    }
  }, []);

  const getStoreById = useCallback((id: string) => {
    return stores.find(store => store.id === id);
  }, [stores]);

  return {
    stores,
    isLoading,
    addStore,
    updateStore,
    deleteStore,
    getStoreById,
    refreshStores: fetchStores
  };
}

// User Profile Hook
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!localStorage.getItem('token')) return;
    setIsLoading(true);
    try {
      const response = await userService.getProfile();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      // Don't toast on profile fetch error unless authenticated
      if (localStorage.getItem('token')) {
        toast.error('Failed to fetch user profile');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    user,
    isLoading,
    refreshProfile: fetchProfile
  };
}
