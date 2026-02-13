
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, ShieldCheck, ShoppingBag, CreditCard, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createOrder, getCartTotal } = useAppContext();
  const [status, setStatus] = useState<'processing' | 'success'>('processing');

  const orderPayload = location.state?.orderData;

  useEffect(() => {
    if (!orderPayload) {
      navigate('/cart');
      return;
    }

    const timer = setTimeout(() => {
      createOrder(orderPayload);
      setStatus('success');
      setTimeout(() => navigate('/my-orders'), 3000);
    }, 4500); // Slightly longer for dramatic effect

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-green-50 to-transparent z-0"></div>

      <div className="relative z-10 w-full max-w-md">

        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white/50 backdrop-blur-sm space-y-8 animate-in fade-in zoom-in duration-500">

          {status === 'processing' ? (
            <div className="text-center space-y-8">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-8 border-green-50 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-green-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CreditCard className="w-10 h-10 text-green-600 animate-pulse" />
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl font-bold text-gray-900">Processing Payment</h1>
                <p className="text-gray-500 text-sm">Securely connecting to <span className="font-bold text-gray-700">{orderPayload?.paymentMethod}</span> gateway...</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100/50 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Merchant</span>
                  <span className="font-bold text-gray-900">BazaarNow Inc.</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium text-sm">Amount</span>
                  <span className="text-2xl font-extrabold text-gray-900">₹{getCartTotal() + 30}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 bg-green-50/50 py-2 rounded-lg">
                <ShieldCheck className="w-3 h-3 text-green-600" />
                <span className="font-semibold text-green-700">256-bit SSL Encryption</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-8">
              <div className="relative w-32 h-32 mx-auto">
                <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                  <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payment Success!</h1>
                <p className="text-gray-500 text-sm px-4">Your order has been confirmed and sent to the store.</p>
              </div>

              <div className="bg-green-50 p-6 rounded-3xl border border-green-100 space-y-2">
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Transaction ID</p>
                <p className="text-lg font-mono font-bold text-gray-800">BN-{Math.floor(Math.random() * 900000 + 100000)}</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/my-orders')}
                  className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
                >
                  View Order Status <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-400">Redirecting automatically in 3s...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
