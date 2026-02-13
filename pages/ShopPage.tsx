
import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, MapPin, Search, Filter } from 'lucide-react';
import { STORES, LOCATIONS } from '../data/mockData';
import { Store } from '../types';

const ShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialArea = searchParams.get('area') || 'All';
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStores = STORES.filter(store => {
    const matchesArea = selectedArea === 'All' || store.location === selectedArea;
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesArea && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Explore Stores</h1>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a specific store..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
              <button
                onClick={() => setSelectedArea('All')}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  selectedArea === 'All' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Areas
              </button>
              {LOCATIONS.map(loc => (
                <button
                  key={loc}
                  onClick={() => setSelectedArea(loc)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                    selectedArea === loc ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStores.map(store => (
            <Link
              key={store.id}
              to={`/store/${store.id}`}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all relative"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {!store.isOpen && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-full font-bold text-sm">Closed Now</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/95 px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold">{store.rating}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{store.name}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <MapPin className="w-4 h-4 text-green-600" />
                  {store.location}, {store.city}
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Fast Delivery</span>
                  <span className="text-xs text-gray-400">Min. order ₹99</span>
                </div>
              </div>
            </Link>
          ))}
          {filteredStores.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No stores found in this area.</p>
              <button onClick={() => { setSelectedArea('All'); setSearchTerm(''); }} className="text-green-600 font-bold hover:underline">Reset Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
