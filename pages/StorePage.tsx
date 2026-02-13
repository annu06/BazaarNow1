
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Star, Clock, MapPin, Plus, Minus, ShoppingBag, Search } from 'lucide-react';
import { STORES, ALL_PRODUCTS } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import ProductImage from '../components/ProductImage';

const StorePage: React.FC = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, updateCartQuantity, getCartCount, getCartTotal, customerAuth } = useAppContext();

  const store = STORES.find(s => s.id === storeId);
  const products = ALL_PRODUCTS.filter(p => p.storeId === storeId);
  const categories = Array.from(new Set(products.map(p => p.category)));

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Store not found</h2>
          <button onClick={() => navigate('/shop')} className="text-green-600 font-bold">Return to Shop</button>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getProductQuantity = (productId: string) => {
    return cart.find(item => item.product.id === productId)?.quantity || 0;
  };

  const handleCartAction = (product: any) => {
    if (!customerAuth) {
      navigate('/login');
      return;
    }
    addToCart(product, store);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Sticky Header */}
      <div className="bg-white/90 backdrop-blur-md border-b sticky top-16 z-30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate tracking-tight">{store.name}</h1>
              <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-green-600" /> {store.location}</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {store.rating} Rating</span>
              </div>
            </div>
            {getCartCount() > 0 && (
              <Link to="/cart" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-green-700 transition-all active:scale-95">
                <ShoppingBag className="w-4 h-4" />
                <span className="font-bold hidden sm:inline text-sm">₹{getCartTotal()}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Hero - More Compact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center shadow-sm">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 shadow-inner">
            <img src={store.image} alt={store.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{store.name}</h2>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md text-green-700 border border-green-100"><Clock className="w-3 h-3" /> 30-45 mins</span>
              <span className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md text-yellow-700 border border-yellow-100"><Star className="w-3 h-3 fill-yellow-500" /> {store.rating} Ratings</span>
              <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md text-blue-700 border border-blue-100"><MapPin className="w-3 h-3" /> {store.location}</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xl">Best known for fresh dairy, local grains, and everyday essentials.</p>
          </div>
        </div>

        {/* Search & Category Filter - Tighter spacing */}
        <div className="mt-6 flex flex-col md:flex-row gap-6">
          <div className="md:w-56 space-y-4">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              <input
                type="text"
                placeholder="Filter items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-50 focus:border-green-400 outline-none text-sm transition-all shadow-sm"
              />
            </div>
            <div className="bg-white p-3 rounded-2xl border border-gray-100 hidden md:block shadow-sm">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Categories</h3>
              <div className="space-y-0.5">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${selectedCategory === 'All' ? 'bg-green-600 text-white font-bold shadow-md shadow-green-100' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  All Items
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${selectedCategory === cat ? 'bg-green-600 text-white font-bold shadow-md shadow-green-100' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => {
                const qty = getProductQuantity(product.id);
                return (
                  <div key={product.id} className="bg-white p-3 rounded-2xl border hover:shadow-md transition-shadow relative flex flex-col">
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center p-2 text-center">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase">Out of Stock</span>
                      </div>
                    )}
                    <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                      <ProductImage src={product.image} alt={product.name} className="w-full h-full" />
                    </div>
                    <div className="flex-1 mb-3">
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
                      <p className="text-xs text-gray-500">{product.unit}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">₹{product.price}</span>
                      {qty === 0 ? (
                        <button
                          onClick={() => handleCartAction(product)}
                          disabled={!product.inStock}
                          className={`px-4 py-1.5 rounded-lg text-sm font-bold border-2 transition-all ${product.inStock
                              ? 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                              : 'border-gray-200 text-gray-300 cursor-not-allowed'
                            }`}
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-green-600 rounded-lg p-0.5 shadow-sm">
                          <button onClick={() => updateCartQuantity(product.id, -1)} className="p-1 hover:bg-green-700 text-white rounded-md">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-white text-xs font-bold w-4 text-center">{qty}</span>
                          <button onClick={() => updateCartQuantity(product.id, 1)} className="p-1 hover:bg-green-700 text-white rounded-md">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Cart */}
      {getCartCount() > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-50">
          <Link to="/cart" className="flex items-center justify-between bg-green-600 p-4 rounded-2xl text-white shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              <div>
                <p className="text-sm font-bold">{getCartCount()} Items Added</p>
                <p className="text-xs text-green-100">From {store.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 font-bold">
              View Cart <ChevronLeft className="w-5 h-5 rotate-180" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default StorePage;
