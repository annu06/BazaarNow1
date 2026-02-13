
import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, Store, Package, AlertCircle, ShoppingCart } from 'lucide-react';
import { STORES, ALL_PRODUCTS } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import ProductImage from '../components/ProductImage';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { addToCart, customerAuth } = useAppContext();

  const matchedStores = STORES.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase()) || 
    s.location.toLowerCase().includes(query.toLowerCase())
  );

  const matchedProducts = ALL_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleAddToCart = (product: any) => {
    if (!customerAuth) {
      navigate('/login');
      return;
    }
    const store = STORES.find(s => s.id === product.storeId);
    if (store) addToCart(product, store);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Search results for "<span className="text-green-600">{query}</span>"
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Found {matchedStores.length} stores and {matchedProducts.length} products
          </p>
        </div>

        {!customerAuth && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-center gap-3 mb-8 text-yellow-800">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">Customer Login Required to add items to cart. <Link to="/login" className="font-bold underline">Login now</Link></p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Stores */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2"><Store className="w-5 h-5 text-green-600" /> Matching Stores</h2>
            <div className="space-y-4">
              {matchedStores.map(store => (
                <Link key={store.id} to={`/store/${store.id}`} className="block bg-white p-4 rounded-2xl border hover:shadow-md transition-all">
                  <div className="flex gap-4">
                    <img src={store.image} alt={store.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900">{store.name}</h3>
                      <p className="text-xs text-gray-500">{store.location}</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded-full w-fit">
                        {store.rating} ★
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {matchedStores.length === 0 && (
                <p className="text-sm text-gray-400 italic">No stores matching "{query}"</p>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2"><Package className="w-5 h-5 text-green-600" /> Matching Products</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedProducts.map(product => {
                const store = STORES.find(s => s.id === product.storeId);
                return (
                  <div key={product.id} className="bg-white p-4 rounded-2xl border flex flex-col hover:shadow-md transition-all">
                    <div className="relative h-28 rounded-xl overflow-hidden mb-3">
                      <ProductImage src={product.image} alt={product.name} className="w-full h-full" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">{product.name}</h4>
                      <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-tight">{store?.name}</p>
                      <p className="text-xs text-gray-400">{product.unit}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-bold">₹{product.price}</span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {matchedProducts.length === 0 && (
                <div className="col-span-full py-10 text-center text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No products matching "{query}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
