
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ChevronRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ProductImage from '../components/ProductImage';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, getCartCount } = useAppContext();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const deliveryFee = 30;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-sm border space-y-6 max-w-md">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-gray-500">Looks like you haven't added anything to your cart yet. Go ahead and explore our stores!</p>
          <Link to="/shop" className="block w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all">
            Browse Stores
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-green-600 mb-6 font-medium">
          <ArrowLeft className="w-5 h-5" /> Back to Store
        </button>

        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          My Cart <span className="text-sm font-normal text-gray-400">({getCartCount()} items)</span>
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="bg-white p-4 rounded-2xl border flex gap-4 hover:shadow-sm transition-all">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <ProductImage src={item.product.image} alt={item.product.name} className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 truncate">{item.product.name}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1">{item.store.name} • {item.product.unit}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold">₹{item.product.price}</span>
                    <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-xl border">
                      <button onClick={() => updateCartQuantity(item.product.id, -1)} className="text-gray-600 hover:text-green-600">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.product.id, 1)} className="text-gray-600 hover:text-green-600">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-gray-300 hover:text-red-500 self-start transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border shadow-sm sticky top-24">
              <h2 className="font-bold text-lg mb-6">Order Summary</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">₹{deliveryFee}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-green-600">₹{total}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link to="/checkout" className="block w-full py-4 bg-green-600 text-white font-bold rounded-xl text-center hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2">
                  Proceed to Checkout <ChevronRight className="w-5 h-5" />
                </Link>
                <Link to="/shop" className="block w-full py-4 text-gray-500 font-bold text-center hover:text-gray-900 transition-all text-sm">
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-xl flex gap-3 items-center">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ArrowLeft className="w-4 h-4 text-blue-600 rotate-180" />
                </div>
                <p className="text-[10px] text-blue-700 font-medium">Express delivery active for your area! Items arriving in 30 mins.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
