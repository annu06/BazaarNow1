
import React, { useState } from 'react';
import { Package, ShoppingBag, Users, TrendingUp, CheckCircle, Clock, Truck, MoreVertical } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ALL_PRODUCTS } from '../data/mockData';

const AdminDashboard: React.FC = () => {
  const { orders, updateOrderStatus } = useAppContext();
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Revenue', value: `₹${orders.reduce((s, o) => s + o.total, 0)}`, icon: <TrendingUp />, color: 'bg-green-50 text-green-600' },
    { label: 'Products', value: ALL_PRODUCTS.length, icon: <Package />, color: 'bg-purple-50 text-purple-600' },
    { label: 'Customers', value: 124, icon: <Users />, color: 'bg-orange-50 text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
            <p className="text-gray-500">Monitor BazaarNow operations across Hyderabad.</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl border shadow-sm">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              All Orders
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Inventory
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4">
              {/* Fix: Casting to React.ReactElement<any> to resolve TypeScript overload matching error for className property */}
              <div className={`p-3 rounded-2xl ${s.color}`}>{React.cloneElement(s.icon as React.ReactElement<any>, { className: 'w-6 h-6' })}</div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'orders' ? (
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold">Recent Orders</h2>
              <span className="text-xs text-gray-400 font-medium">Real-time Sync Active</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-xs text-gray-400">#{order.id.slice(-6)}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerPhone}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-green-600">₹{order.total}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                          order.status === 'placed' ? 'bg-blue-50 text-blue-600' :
                          order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.status === 'placed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'approved')}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_PRODUCTS.slice(0, 12).map(p => (
                <div key={p.id} className="flex gap-4 p-4 rounded-2xl border bg-gray-50/50 items-center">
                  <img src={p.image} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold truncate">{p.name}</h3>
                    <p className="text-[10px] text-gray-400">Category: {p.category}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-bold">₹{p.price}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.inStock ? 'In Stock' : 'Low Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
