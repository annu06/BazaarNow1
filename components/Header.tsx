
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User, LogOut, ChevronDown, Shield, Store, Truck, LayoutDashboard, Bell, Settings, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header: React.FC<{ onMenuOpen: () => void }> = ({ onMenuOpen }) => {
  const { customerAuth, adminAuth, vendorAuth, deliveryAuth, logout, getCartCount } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Determine current portal context based on URL
  const isAdminPortal = location.pathname.startsWith('/admin');
  const isVendorPortal = location.pathname.startsWith('/vendor');
  const isDeliveryPortal = location.pathname.startsWith('/delivery');
  const isCustomerPortal = !isAdminPortal && !isVendorPortal && !isDeliveryPortal;

  // Configuration for each portal
  const portalConfig = {
    admin: {
      title: 'Admin Console',
      color: 'text-blue-600',
      bgApp: 'bg-blue-600',
      user: adminAuth,
      homeLink: '/admin',
      logoutRole: 'admin' as const
    },
    vendor: {
      title: 'Vendor Hub',
      color: 'text-orange-600',
      bgApp: 'bg-orange-600',
      user: vendorAuth,
      homeLink: '/vendor',
      logoutRole: 'vendor' as const
    },
    delivery: {
      title: 'Delivery Partner',
      color: 'text-purple-600',
      bgApp: 'bg-purple-600',
      user: deliveryAuth,
      homeLink: '/delivery',
      logoutRole: 'delivery' as const
    },
    customer: {
      title: 'BazaarNow',
      color: 'text-green-600',
      bgApp: 'bg-green-600',
      user: customerAuth,
      homeLink: '/',
      logoutRole: 'customer' as const
    }
  };

  const currentConfig = isAdminPortal ? portalConfig.admin
    : isVendorPortal ? portalConfig.vendor
      : isDeliveryPortal ? portalConfig.delivery
        : portalConfig.customer;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (portalRef.current && !portalRef.current.contains(e.target as Node)) {
        setPortalMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Left: Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button onClick={onMenuOpen} className="p-2 -ml-2 hover:bg-gray-100 rounded-xl lg:hidden transition-colors">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <Link to={currentConfig.homeLink} className="flex items-center gap-2 group">
              <div className={`${currentConfig.bgApp} text-white p-2 rounded-xl shadow-lg shadow-${currentConfig.bgApp.split('-')[1]}-200 transition-transform group-hover:scale-105`}>
                {isAdminPortal ? <Shield className="w-5 h-5" /> :
                  isVendorPortal ? <Store className="w-5 h-5" /> :
                    isDeliveryPortal ? <Truck className="w-5 h-5" /> :
                      <ShoppingBag className="w-5 h-5" />}
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="text-xl font-extrabold text-gray-900 tracking-tight block">
                  Bazaar<span className="text-green-600">Now</span>
                </span>
                {!isCustomerPortal && (
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${currentConfig.color}`}>
                    {currentConfig.title}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Center: Search (Customer Portal Only) */}
          {isCustomerPortal && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative group">
              <input
                type="text"
                placeholder="Search products, stores, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-200 focus:ring-4 focus:ring-green-50/50 outline-none transition-all text-sm font-medium"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
            </form>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-3">

            {/* Portals Switcher */}
            <div className="relative hidden lg:block" ref={portalRef}>
              <button
                onClick={() => setPortalMenuOpen(!portalMenuOpen)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all ${portalMenuOpen ? 'bg-gray-50 text-gray-900' : ''}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden xl:inline">Switch Portal</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${portalMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {portalMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-xs font-bold text-gray-400 px-4 py-2 uppercase tracking-wider">Select Portal</div>

                  <Link to="/" onClick={() => setPortalMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isCustomerPortal ? 'bg-green-50 ring-1 ring-green-100' : 'hover:bg-gray-50'}`}>
                    <div className={`${isCustomerPortal ? 'bg-green-600 text-white shadow-md' : 'bg-green-100 text-green-600'} p-2 rounded-lg transition-all`}><ShoppingBag className="w-4 h-4" /></div>
                    <div><p className={`text-sm font-bold ${isCustomerPortal ? 'text-green-700' : 'text-gray-900'}`}>Customer Store</p><p className="text-xs text-gray-500">Shop for groceries</p></div>
                  </Link>

                  <Link to="/admin" onClick={() => setPortalMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group mt-1 ${isAdminPortal ? 'bg-blue-50 ring-1 ring-blue-100' : 'hover:bg-gray-50'}`}>
                    <div className={`${isAdminPortal ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-600'} p-2 rounded-lg transition-all`}><Shield className="w-4 h-4" /></div>
                    <div><p className={`text-sm font-bold ${isAdminPortal ? 'text-blue-700' : 'text-gray-900'}`}>Admin Console</p><p className="text-xs text-gray-500">Manage platform</p></div>
                  </Link>

                  <Link to="/vendor" onClick={() => setPortalMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group mt-1 ${isVendorPortal ? 'bg-orange-50 ring-1 ring-orange-100' : 'hover:bg-gray-50'}`}>
                    <div className={`${isVendorPortal ? 'bg-orange-600 text-white shadow-md' : 'bg-orange-100 text-orange-600'} p-2 rounded-lg transition-all`}><Store className="w-4 h-4" /></div>
                    <div><p className={`text-sm font-bold ${isVendorPortal ? 'text-orange-700' : 'text-gray-900'}`}>Vendor Hub</p><p className="text-xs text-gray-500">Manage your store</p></div>
                  </Link>

                  <Link to="/delivery" onClick={() => setPortalMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group mt-1 ${isDeliveryPortal ? 'bg-purple-50 ring-1 ring-purple-100' : 'hover:bg-gray-50'}`}>
                    <div className={`${isDeliveryPortal ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-100 text-purple-600'} p-2 rounded-lg transition-all`}><Truck className="w-4 h-4" /></div>
                    <div><p className={`text-sm font-bold ${isDeliveryPortal ? 'text-purple-700' : 'text-gray-900'}`}>Delivery Partner</p><p className="text-xs text-gray-500">Manage deliveries</p></div>
                  </Link>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200 hidden lg:block mx-1"></div>

            {/* Notifications */}
            <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* User Profile / Login */}
            {currentConfig.user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-gray-50 rounded-full border border-transparent hover:border-gray-200 transition-all"
                >
                  <div className={`w-8 h-8 ${currentConfig.bgApp} text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md`}>
                    {currentConfig.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left mr-1">
                    <p className="text-xs font-bold text-gray-900 leading-none">{currentConfig.user.name}</p>
                    <p className="text-[10px] text-gray-500 leading-none mt-1 capitalize">{currentConfig.user.role}</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400 hidden lg:block" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 mb-2">
                      <p className="text-sm font-bold text-gray-900">{currentConfig.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{currentConfig.user.email}</p>
                    </div>

                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      <User className="w-4 h-4" /> Your Profile
                    </Link>

                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>

                    {isCustomerPortal && (
                      <Link to="/my-orders" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                        <ShoppingBag className="w-4 h-4" /> My Orders
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-2"></div>

                    <button
                      onClick={() => {
                        logout(currentConfig.logoutRole);
                        setDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
                  Log In
                </Link>
                <Link to="/signup" className={`hidden sm:flex px-5 py-2.5 text-sm font-bold text-white ${currentConfig.bgApp} hover:opacity-90 rounded-xl shadow-lg shadow-${currentConfig.bgApp.split('-')[1]}-200 transition-all`}>
                  Sign Up
                </Link>
              </div>
            )}

            {/* Cart (Customer Portal Only) */}
            {isCustomerPortal && (
              <Link to="/cart" className="relative p-2.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl transition-colors ml-2 hidden sm:flex">
                <ShoppingCart className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
