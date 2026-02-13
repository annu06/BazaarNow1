
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, CheckCircle, Store, Search, ShoppingCart, Truck, MapPin } from 'lucide-react';
import { FEATURES, HOW_IT_WORKS, LOCATIONS } from '../data/mockData';

const HeroSection = () => (
  <section className="bg-green-50 py-16 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 text-center md:text-left space-y-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
          Your Local Kirana, <br /><span className="text-green-600">Delivered in 30 Mins</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
          Order from the best supermarkets and local stores in Hyderabad. 
          Freshness guaranteed, delivered to your doorstep.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link to="/shop" className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2 group">
            Browse Stores <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/signup" className="px-8 py-4 bg-white text-green-600 font-bold border-2 border-green-600 rounded-xl hover:bg-green-50 transition-all flex items-center justify-center">
            Become a Partner
          </Link>
        </div>
      </div>
      <div className="flex-1 relative">
        <img src="https://picsum.photos/seed/grocery-delivery/800/600" alt="Groceries" className="rounded-3xl shadow-2xl" />
        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border flex items-center gap-4 animate-bounce">
          <div className="bg-green-100 p-2 rounded-full"><Zap className="text-green-600 w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Fastest Delivery</p>
            <p className="text-sm font-bold text-gray-900">30 Min Guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Store': return <Store className="w-8 h-8 text-green-600" />;
      case 'Zap': return <Zap className="w-8 h-8 text-green-600" />;
      case 'CheckCircle': return <CheckCircle className="w-8 h-8 text-green-600" />;
      default: return null;
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose BazaarNow?</h2>
          <p className="text-gray-500">We bring the best of your neighborhood right to your phone.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-all border border-transparent hover:border-green-100">
              <div className="mb-4">{getIcon(f.icon)}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search': return <Search className="w-10 h-10 text-white" />;
      case 'ShoppingCart': return <ShoppingCart className="w-10 h-10 text-white" />;
      case 'Truck': return <Truck className="w-10 h-10 text-white" />;
      default: return null;
    }
  };

  return (
    <section className="py-20 bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-green-400 z-0"></div>
          {HOW_IT_WORKS.map((h, i) => (
            <div key={i} className="text-center space-y-6 relative z-10">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto border-4 border-green-400 shadow-xl">
                {getIcon(h.icon)}
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{h.title}</h3>
                <p className="text-green-50">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LocationsSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Popular Areas in Hyderabad</h2>
        <Link to="/shop" className="text-green-600 font-bold flex items-center gap-1 hover:underline">
          View all stores <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {LOCATIONS.map((loc, i) => (
          <Link
            key={i}
            to={`/shop?area=${loc}`}
            className="px-6 py-3 bg-white border border-gray-200 rounded-full hover:border-green-500 hover:bg-green-50 hover:text-green-600 transition-all font-medium flex items-center gap-2 shadow-sm"
          >
            <MapPin className="w-4 h-4" /> {loc}
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <LocationsSection />
    </div>
  );
};

export default HomePage;
