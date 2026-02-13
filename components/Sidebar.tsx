
import React from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, Shield, Store, Truck, ShoppingBag, LogIn, UserPlus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { adminAuth, vendorAuth, deliveryAuth, logout } = useAppContext();

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div className={`fixed top-0 left-0 h-full w-80 bg-white z-[60] shadow-2xl transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b flex justify-between items-center bg-green-600 text-white">
                    <span className="text-xl font-bold flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" /> BazaarNow
                    </span>
                    <button onClick={onClose} className="p-2 hover:bg-green-700 rounded-full"><X className="w-6 h-6" /></button>
                </div>

                <div className="p-6 space-y-8 overflow-y-auto h-[calc(100%-80px)]">
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Main Experience</h3>
                        <Link to="/" onClick={onClose} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 group transition-all">
                            <span className="text-sm font-bold text-gray-700 group-hover:text-green-600">Home Page</span>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                        </Link>
                        <Link to="/shop" onClick={onClose} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 group transition-all">
                            <span className="text-sm font-bold text-gray-700 group-hover:text-green-600">Browse Stores</span>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Portals</h3>

                        {/* Admin */}
                        <div className="bg-blue-50/50 p-2 rounded-2xl border border-blue-50">
                            <Link to={adminAuth ? "/admin" : "/admin/login"} onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-100 transition-all group">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-bold text-blue-900">{adminAuth ? 'Admin Dashboard' : 'Admin Login'}</span>
                            </Link>
                        </div>

                        {/* Vendor Section */}
                        <div className="bg-orange-50/50 p-2 rounded-2xl border border-orange-50 space-y-1">
                            <Link to={vendorAuth ? "/vendor" : "/vendor/login"} onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-100 transition-all group">
                                <Store className="w-5 h-5 text-orange-600" />
                                <span className="text-sm font-bold text-orange-900">{vendorAuth ? 'Vendor Dashboard' : 'Vendor Login'}</span>
                            </Link>
                            {!vendorAuth && (
                                <Link to="/vendor/signup" onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-100 transition-all group border-t border-orange-100 mt-1">
                                    <UserPlus className="w-5 h-5 text-orange-400" />
                                    <span className="text-xs font-bold text-orange-700">Register as Vendor</span>
                                </Link>
                            )}
                        </div>

                        {/* Delivery */}
                        <div className="bg-purple-50/50 p-2 rounded-2xl border border-purple-50">
                            <Link to={deliveryAuth ? "/delivery" : "/delivery/login"} onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-100 transition-all group">
                                <Truck className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-bold text-purple-900">{deliveryAuth ? 'Delivery Partner' : 'Delivery Login'}</span>
                            </Link>
                        </div>
                    </div>

                    {(adminAuth || vendorAuth || deliveryAuth) && (
                        <div className="pt-8 mt-8 border-t">
                            <button
                                onClick={() => {
                                    if (adminAuth) logout('admin');
                                    if (vendorAuth) logout('vendor');
                                    if (deliveryAuth) logout('delivery');
                                    onClose();
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-all"
                            >
                                <LogIn className="w-5 h-5 rotate-180" /> Sign out Portals
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
