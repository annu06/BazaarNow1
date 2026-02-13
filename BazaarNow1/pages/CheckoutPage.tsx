
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, User, CreditCard, Banknote, ShieldCheck, Zap, ShoppingBag, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { customerAuth, getCartTotal, cart } = useAppContext();

  const [formData, setFormData] = useState({
    name: customerAuth?.name || '',
    phone: '',
    address: '',
    city: 'Hyderabad',
    landmark: '',
    paymentMethod: 'UPI'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.phone || formData.phone.length < 10) newErrors.phone = 'Invalid phone';
    if (!formData.address) newErrors.address = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate network delay
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/payment', { state: { orderData: formData } });
      }, 1000);
    }
  };

  const totalAmount = getCartTotal() + 30; // Including delivery fee

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Forms */}
          <div className="lg:col-span-8 space-y-6">

            {/* Delivery Details Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-gray-800">
                <MapPin className="w-5 h-5 text-green-600" /> Delivery Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all`}
                      placeholder="Rahul Kumar"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 font-medium ml-1">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all`}
                      placeholder="9876543210"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 font-medium ml-1">{errors.phone}</p>}
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full p-4 bg-gray-50 border ${errors.address ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all h-24 resize-none`}
                    placeholder="House No, Apartment, Street name"
                  ></textarea>
                  {errors.address && <p className="text-xs text-red-500 font-medium ml-1">{errors.address}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all"
                    placeholder="Near Metro Station"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-gray-800">
                <CreditCard className="w-5 h-5 text-green-600" /> Payment Method
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'UPI', label: 'UPI / GPay', icon: <Zap className="w-5 h-5" /> },
                  { id: 'Card', label: 'Card', icon: <CreditCard className="w-5 h-5" /> },
                  { id: 'COD', label: 'Cash', icon: <Banknote className="w-5 h-5" /> }
                ].map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 h-24 ${formData.paymentMethod === method.id
                      ? 'border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-green-200 hover:bg-green-50/50'
                      }`}
                  >
                    {method.icon}
                    <span className="text-xs font-bold">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">

              <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-green-600" /> Order Summary
                </h2>

                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-bold text-gray-600">{item.quantity}x</span>
                        <span className="text-gray-700 truncate max-w-[120px]">{item.product.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery Fee</span>
                    <span>₹30</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-green-600">₹{totalAmount}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 active:scale-[0.98] shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>Place Order <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium bg-gray-50 py-2 rounded-lg">
                  <ShieldCheck className="w-3 h-3" /> Secure SSL Encrypted Payment
                </div>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
