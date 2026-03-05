import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Store, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product, Store as StoreType } from '@/types';

interface DashboardProps {
  products: Product[];
  stores: StoreType[];
}

export function Dashboard({ products, stores }: DashboardProps) {
  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      path: '/products'
    },
    {
      title: 'Open Stores',
      value: stores.filter(s => s.status === 'Open').length,
      change: 'Available now',
      trend: 'up',
      icon: Store,
      color: 'bg-green-50 text-green-600',
      path: '/stores?status=Open'
    },
    {
      title: 'Under Renovation',
      value: stores.filter(s => s.status === 'Renovation').length,
      change: 'Coming soon',
      trend: 'down',
      icon: Store,
      color: 'bg-yellow-50 text-yellow-600',
      path: '/stores?status=Renovation'
    },
    {
      title: 'Low Stock Items',
      value: products.filter(p => p.stock < 5).length,
      change: 'Needs attention',
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-red-50 text-red-600',
      path: '/products?filter=low-stock'
    }
  ];

  const recentProducts = products.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Dashboard"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link key={index} to={stat.path}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
                <Link to="/products" className="text-sm text-red-600 hover:text-red-700 font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <Link key={product._id} to={`/products/edit/${product._id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      {product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">₹{product.price.toLocaleString()}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.status === 'Active' ? 'bg-green-100 text-green-700' :
                        product.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {product.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Store Status */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Store Locations</h3>
                <Link to="/stores" className="text-sm text-red-600 hover:text-red-700 font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {stores.slice(0, 5).map((store) => (
                  <Link key={store._id} to={`/stores/edit/${store._id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      {store.images[0] ? (
                        <img src={store.images[0]} alt={store.name} className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{store.name}</p>
                      <p className="text-xs text-gray-500">{store.city}, {store.state}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${store.status === 'Open' ? 'bg-green-100 text-green-700' :
                        store.status === 'Closed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                        {store.status}
                      </span>
                      {store.statusMode === 'Auto' && (
                        <span className="flex items-center gap-1 text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded-md">
                          <RefreshCcw className="w-2.5 h-2.5 animate-spin-slow" />
                          AUTO
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
