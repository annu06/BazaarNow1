
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Shield, Store, Truck, User as UserIcon, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MOCK_USERS } from '../data/mockData';
import { UserRole } from '../types';

interface Props {
  role: UserRole;
}

const LoginPage: React.FC<Props> = ({ role }) => {
  const { login, loginWithGoogle } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const config = {
    customer: { bg: 'bg-green-50', text: 'text-green-600', btn: 'bg-green-600', icon: <UserIcon />, title: 'Customer Login', accent: 'green' },
    admin: { bg: 'bg-blue-50', text: 'text-blue-600', btn: 'bg-blue-600', icon: <Shield />, title: 'Admin Control Center', accent: 'blue' },
    vendor: { bg: 'bg-orange-50', text: 'text-orange-600', btn: 'bg-orange-600', icon: <Store />, title: 'Vendor Dashboard', accent: 'orange' },
    delivery: { bg: 'bg-purple-50', text: 'text-purple-600', btn: 'bg-purple-600', icon: <Truck />, title: 'Delivery Partner Portal', accent: 'purple' }
  }[role];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const mockUser = MOCK_USERS.find(u => u.email === email && u.role === role);

    if (mockUser && password === `${role}123`) {
      login(mockUser);
      const destination = location.state?.from?.pathname || (role === 'customer' ? '/' : `/${role}`);
      navigate(destination);
    } else {
      setError(`Invalid ${role} credentials. Demo password is '${role}123'`);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      const destination = location.state?.from?.pathname || '/';
      navigate(destination);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${config.bg} p-6`}>
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className={`${config.bg} ${config.text} w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform -rotate-6`}>
            {React.cloneElement(config.icon as React.ReactElement<any>, { className: 'w-10 h-10' })}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{config.title}</h1>
          <p className="text-gray-500 text-sm">Access your BazaarNow account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        {/* Google Sign-In for Customers */}
        {role === 'customer' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-4 bg-white border-2 border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 font-medium">or use email</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-100 border rounded-2xl focus:ring-2 focus:ring-opacity-50 focus:ring-offset-0 focus:outline-none transition-all text-gray-800"
                placeholder={`${role}@bazaarnow.com`}
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
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-100 border rounded-2xl focus:ring-2 focus:ring-opacity-50 focus:ring-offset-0 focus:outline-none transition-all text-gray-800"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-4 ${config.btn} text-white font-bold rounded-2xl shadow-xl shadow-${config.accent}-100 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2`}
          >
            Sign In <LogIn className="w-5 h-5" />
          </button>
        </form>

        {role === 'customer' && (
          <div className="text-center pt-4">
            <p className="text-gray-500 text-sm">
              Don't have an account? <Link to="/signup" className="text-green-600 font-bold hover:underline">Create account</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
