
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, User, MapPin, Mail, Lock, ArrowRight, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { LOCATIONS } from '../data/mockData';

const VendorSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    category: 'Grocery',
    location: LOCATIONS[0],
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/vendor/login'), 2000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 p-6">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-12 text-center space-y-6">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Application Received!</h2>
          <p className="text-gray-500">Your store application for <span className="font-bold text-orange-600">{formData.storeName}</span> is being reviewed. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-6 py-12">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden flex flex-col md:flex-row">
        {/* Left Sidebar Info */}
        <div className="md:w-64 bg-orange-600 p-10 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <div className="bg-white/20 p-3 rounded-2xl w-fit">
              <Store className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold leading-tight">Grow Your Business with BazaarNow</h2>
            <p className="text-orange-100 text-sm">Join 500+ local stores serving customers across Hyderabad.</p>
          </div>
          <div className="mt-8 text-xs text-orange-200">
            © {new Date().getFullYear()} BazaarNow Vendor Partners
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 p-10 space-y-8">
          <div className="flex justify-between items-center">
            <Link to="/vendor/login" className="text-orange-600 font-bold text-sm flex items-center gap-1 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Store Registration</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900">Register Store</h1>
            <p className="text-gray-500 text-sm">Tell us about your business to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Store Name</label>
                <div className="relative">
                  <Store className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
                  <input
                    type="text"
                    required
                    value={formData.storeName}
                    onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    placeholder="e.g. Fresh Mart"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Owner Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    placeholder="Your Full Name"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Store Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm appearance-none"
                >
                  <option>Grocery</option>
                  <option>Supermarket</option>
                  <option>Organic Foods</option>
                  <option>Dairy & Sweets</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm appearance-none"
                  >
                    {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Business Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                  placeholder="contact@store.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Registration <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorSignupPage;
