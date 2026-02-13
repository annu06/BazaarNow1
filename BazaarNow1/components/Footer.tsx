import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-green-600 p-1.5 rounded-lg">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">Bazaar<span className="text-green-500">Now</span></span>
          </div>
          <p className="text-sm">Connecting you with your favorite local Kirana stores. Fresh groceries delivered to your door in Hyderabad.</p>
          <div className="flex gap-4">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-green-500 transition-colors" />
            <Twitter className="w-5 h-5 cursor-pointer hover:text-green-500 transition-colors" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-green-500 transition-colors" />
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-500">About Us</a></li>
            <li><a href="#" className="hover:text-green-500">How it Works</a></li>
            <li><a href="#" className="hover:text-green-500">Partner with Us</a></li>
            <li><Link to="/privacy" className="hover:text-green-500">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-green-500">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Portals</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#/admin/login" className="hover:text-green-500">Admin Login</a></li>
            <li><a href="#/vendor/login" className="hover:text-green-500">Vendor Login</a></li>
            <li><a href="#/delivery/login" className="hover:text-green-500">Delivery Partner</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> support@bazaarnow.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> +91 40-12345678
            </li>
            <li>Cyber Towers, Madhapur, Hyderabad</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-xs">
        &copy; {new Date().getFullYear()} BazaarNow Technologies Pvt Ltd. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
