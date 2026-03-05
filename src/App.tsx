import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { ProductList } from '@/pages/ProductList';
import { ProductForm } from '@/pages/ProductForm';
import { StoreList } from '@/pages/StoreList';
import { StoreForm } from '@/pages/StoreForm';
import { Settings } from '@/pages/Settings';
import { LoginPage } from '@/pages/LoginPage';
import { OrderList } from '@/pages/OrderList';
import { OrderDetail } from '@/pages/OrderDetail';
import { AppointmentList } from '@/pages/AppointmentList';
import { AppointmentDetail } from '@/pages/AppointmentDetail';
import { CustomerList } from '@/pages/CustomerList';
import BannerList from '@/pages/BannerList';
import BannerForm from '@/pages/BannerForm';
import { OfferList } from '@/pages/OfferList';
import { OfferForm } from '@/pages/OfferForm';
import MasterData from '@/pages/MasterData';
import { useProductStore, useStoreStore } from '@/hooks/useStore';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('token') !== null;
  });

  const { products, addProduct, updateProduct, deleteProduct, isLoading: productsLoading, refreshProducts } = useProductStore();
  const { stores, addStore, updateStore, deleteStore, isLoading: storesLoading } = useStoreStore();

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    toast.success('Welcome to Claritone Admin Panel');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    toast.info('Signed out successfully');
  };

  const handleProductSave = async (data: FormData, id?: string) => {
    try {
      if (id) {
        await updateProduct(id, data);
        toast.success('Product updated successfully');
      } else {
        await addProduct(data);
        toast.success('Product added successfully');
      }
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleProductDelete = async (id: string) => {
    await deleteProduct(id);
    toast.success('Product deleted successfully');
  };

  const handleStoreSave = async (data: FormData, id?: string) => {
    try {
      if (id) {
        await updateStore(id, data);
        toast.success('Store updated successfully');
      } else {
        await addStore(data);
        toast.success('Store added successfully');
      }
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleStoreDelete = async (id: string) => {
    await deleteStore(id);
    toast.success('Store deleted successfully');
  };

  const handleStoreQuickUpdate = async (id: string, data: any) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      await updateStore(id, formData);
      toast.success('Store updated successfully');
    } catch (error) {
      toast.error('Failed to update store');
    }
  };

  if ((productsLoading && products.length === 0) || (storesLoading && stores.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
          } />

          <Route path="/*" element={
            isAuthenticated ? (
              <div className="flex w-full min-h-screen">
                <Sidebar onLogout={handleLogout} />
                <main className="flex-1 ml-64 min-h-screen relative">
                  <Routes>
                    <Route
                      path="/"
                      element={<Dashboard products={products} stores={stores} />}
                    />
                    <Route
                      path="/products"
                      element={<ProductList products={products} onDelete={handleProductDelete} onSearch={refreshProducts} />}
                    />
                    <Route
                      path="/products/add"
                      element={<ProductForm products={products} onSave={handleProductSave} />}
                    />
                    <Route
                      path="/products/edit/:id"
                      element={<ProductForm products={products} onSave={handleProductSave} />}
                    />
                    <Route
                      path="/offers"
                      element={<OfferList />}
                    />
                    <Route
                      path="/offers/add"
                      element={<OfferForm />}
                    />
                    <Route
                      path="/offers/edit/:id"
                      element={<OfferForm />}
                    />
                    <Route
                      path="/stores"
                      element={<StoreList stores={stores} onDelete={handleStoreDelete} onUpdate={handleStoreQuickUpdate} />}
                    />
                    <Route
                      path="/stores/add"
                      element={<StoreForm stores={stores} onSave={handleStoreSave} />}
                    />
                    <Route
                      path="/stores/edit/:id"
                      element={<StoreForm stores={stores} onSave={handleStoreSave} />}
                    />
                    <Route
                      path="/orders"
                      element={<OrderList />}
                    />
                    <Route
                      path="/orders/:id"
                      element={<OrderDetail />}
                    />
                    <Route
                      path="/appointments"
                      element={<AppointmentList />}
                    />
                    <Route
                      path="/appointments/:id"
                      element={<AppointmentDetail />}
                    />
                    <Route
                      path="/customers"
                      element={<CustomerList />}
                    />
                    <Route
                      path="/settings"
                      element={<Settings />}
                    />
                    <Route
                      path="/banners"
                      element={<BannerList />}
                    />
                    <Route
                      path="/banners/add"
                      element={<BannerForm />}
                    />
                    <Route
                      path="/banners/edit/:id"
                      element={<BannerForm />}
                    />
                    <Route
                      path="/master-data"
                      element={<MasterData />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
