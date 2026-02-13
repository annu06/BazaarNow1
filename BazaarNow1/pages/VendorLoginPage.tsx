
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Store, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MOCK_USERS } from '../data/mockData';

const VendorLoginPage: React.FC = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Find mock user by email and role
    const mockUser = MOCK_USERS.find(u => u.email === email && u.role === 'vendor');
    
    if (mockUser && password === 'vendor123') {
      login(mockUser);
      const destination = location.state?.from?.pathname || '/vendor';
      navigate(destination);
    } else {
      setError("Invalid vendor credentials. Use vendor@bazaarnow.com / vendor123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden p-10 space-y-8 animate-in fade-in zoom-in duration-300">
        <Link to="/" className="inline-flex items-center gap-2 text-orange-600 font-bold text-sm hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="text-center space-y-2">
          <div className="bg-orange-100 text-orange-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform -rotate-6">
            <Store className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Vendor Login</h1>
          <p className="text-gray-500 text-sm">Manage your store and orders</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-2">Business Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-100 border rounded-2xl focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 outline-none transition-all text-gray-800"
                placeholder="vendor@bazaarnow.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-100 border rounded-2xl focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 outline-none transition-all text-gray-800"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Sign In <LogIn className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center pt-4 border-t">
          <p className="text-gray-500 text-sm">
            Want to sell on BazaarNow? <br />
            <Link to="/vendor/signup" className="text-orange-600 font-bold hover:underline">Register your store today</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorLoginPage;
