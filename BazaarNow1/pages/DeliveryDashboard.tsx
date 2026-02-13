
import React from 'react';
import { Truck, MapPin, Phone, CheckCircle, Navigation, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const DeliveryDashboard: React.FC = () => {
  const { orders, updateOrderStatus, deliveryAuth } = useAppContext();
  
  const activeDelivery = orders.find(o => o.status === 'out_for_delivery');
  const completedCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 sm:p-10">
      <div className="max-w-2xl mx-auto space-y-10">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Hello, {deliveryAuth?.name}</h1>
            <p className="text-gray-400">Ready for your next trip?</p>
          </div>
          <div className="bg-purple-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 border border-purple-400">
            <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"></div>
            On Duty
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-6 rounded-[2rem] border border-gray-700 text-center">
            <p className="text-purple-400 text-[10px] font-bold uppercase mb-1">Today's Trips</p>
            <p className="text-4xl font-black">{completedCount}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-[2rem] border border-gray-700 text-center">
            <p className="text-green-400 text-[10px] font-bold uppercase mb-1">Earnings</p>
            <p className="text-4xl font-black">₹{completedCount * 40}</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Navigation className="w-6 h-6 text-purple-500" /> Active Assignment
          </h2>
          
          {activeDelivery ? (
            <div className="bg-white text-gray-900 p-8 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-600 text-white px-6 py-2 rounded-bl-3xl text-xs font-black uppercase">
                High Priority
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID: {activeDelivery.id}</p>
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-xl">
                      <Truck className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-black">{activeDelivery.items.length} Items for Delivery</h3>
                  </div>
                </div>
              </div>

              <div className="space-y-6 relative">
                {/* Timeline visual */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100 border-l-2 border-dashed border-gray-200"></div>
                
                <div className="flex gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-purple-600 ring-4 ring-purple-50 shrink-0 z-10"></div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Pickup Location</p>
                    <p className="text-sm font-bold text-gray-700">{activeDelivery.items[0].store.name}</p>
                    <p className="text-xs text-gray-400">{activeDelivery.items[0].store.location}</p>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-green-500 ring-4 ring-green-50 shrink-0 z-10"></div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Delivery Location</p>
                    <p className="text-sm font-bold text-gray-700">{activeDelivery.customerName}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{activeDelivery.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <a href={`tel:${activeDelivery.customerPhone}`} className="flex-1 bg-gray-100 py-5 rounded-2xl flex items-center justify-center gap-2 font-black text-gray-600 hover:bg-gray-200 transition-all">
                  <Phone className="w-5 h-5" /> Call Customer
                </a>
                <button
                  onClick={() => updateOrderStatus(activeDelivery.id, 'delivered')}
                  className="flex-[2] bg-purple-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> Mark Delivered
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1 font-bold">
                <ShieldCheck className="w-3 h-3" /> Secure drop-off verified via Geo-fencing
              </p>
            </div>
          ) : (
            <div className="bg-gray-800 p-12 rounded-[2.5rem] border border-gray-700 text-center space-y-6">
              <div className="bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-12 h-12 text-gray-500" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold">Waiting for orders...</p>
                <p className="text-sm text-gray-500">Relax! We'll notify you as soon as a new delivery request pops up in your area.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
