
import React from 'react';
import { Package, ShoppingBag, Clock, Truck, TrendingUp, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const VendorDashboard: React.FC = () => {
  const { orders, updateOrderStatus, vendorAuth } = useAppContext();
  
  // Simulation: Filter orders for this vendor's store (assuming s1 for demo)
  const vendorOrders = orders.filter(o => o.items.some(item => item.store.id === 's1'));
  const pendingOrders = vendorOrders.filter(o => o.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Heritage Fresh Dashboard</h1>
            <p className="text-gray-500">Welcome back, {vendorAuth?.name}</p>
          </div>
          <div className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Store Online
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border shadow-sm text-center space-y-2">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Active Queue</p>
            <p className="text-5xl font-extrabold text-orange-600">{pendingOrders.length}</p>
            <p className="text-sm text-gray-500">Awaiting packaging</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border shadow-sm text-center space-y-2">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Today's Sales</p>
            <p className="text-5xl font-extrabold text-gray-900">₹{vendorOrders.reduce((s,o) => s + o.total, 0)}</p>
            <p className="text-sm text-gray-500">Across {vendorOrders.length} orders</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border shadow-sm text-center space-y-2">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Efficiency</p>
            <p className="text-5xl font-extrabold text-green-600">98%</p>
            <p className="text-sm text-gray-500">Orders on time</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6 text-orange-600" /> Incoming Orders
          </h2>
          {pendingOrders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-3xl border-2 border-orange-100 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-tighter">New Pack Request</span>
                  <span className="text-gray-400 font-bold text-xs">#{order.id.slice(-6)}</span>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-xs">{item.quantity}x</div>
                      <p className="text-sm font-bold text-gray-800">{item.product.name} ({item.product.unit})</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-between items-end gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold">Estimated Prep Time</p>
                  <p className="text-lg font-bold text-gray-900">12 Minutes</p>
                </div>
                <button
                  onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                  className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all flex items-center gap-2"
                >
                  Pack & Handover to Delivery <Truck className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {pendingOrders.length === 0 && (
            <div className="bg-white p-20 rounded-3xl border border-dashed text-center space-y-4">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">All caught up! No pending orders to pack.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
