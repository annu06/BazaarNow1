
import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, MapPin, Phone, ArrowLeft, Store } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { OrderStatus } from '../types';

const StatusPill: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const styles = {
    placed: 'bg-blue-50 text-blue-600 border-blue-100',
    approved: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    out_for_delivery: 'bg-purple-50 text-purple-600 border-purple-100',
    delivered: 'bg-green-50 text-green-600 border-green-100'
  };
  
  const labels = {
    placed: 'Order Placed',
    approved: 'Store Approved',
    out_for_delivery: 'On the Way',
    delivered: 'Delivered'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const MyOrdersPage: React.FC = () => {
  const { orders } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <Link to="/shop" className="text-sm font-bold text-green-600 flex items-center gap-1 hover:underline">
            New Order <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 flex flex-col md:flex-row justify-between gap-4 border-b bg-gray-50/30">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID: {order.id}</p>
                  <p className="text-sm font-medium flex items-center gap-1 text-gray-500">
                    <Clock className="w-3.5 h-3.5" /> {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Total Amount</p>
                    <p className="text-xl font-bold text-green-600">₹{order.total}</p>
                  </div>
                  <StatusPill status={order.status} />
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 pr-4 rounded-xl border border-gray-100">
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.product.name}</p>
                        <p className="text-[10px] text-gray-500">{item.quantity} x {item.product.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-4 border-t">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Details</h4>
                    <div className="space-y-2">
                      <p className="text-sm font-bold flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-medium leading-relaxed">{order.address}</span>
                      </p>
                      <p className="text-sm font-bold flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{order.customerPhone}</span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Info</h4>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">{order.paymentMethod}</span>
                      <span className="text-sm font-bold text-green-600">PAID</span>
                    </div>
                    {order.status === 'out_for_delivery' && (
                      <div className="bg-green-600 p-3 rounded-xl flex items-center justify-center gap-2 text-white text-xs font-bold shadow-lg animate-pulse">
                        <Package className="w-4 h-4" /> Live Tracking Active
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <Package className="w-16 h-16 text-gray-200 mx-auto" />
              <p className="text-gray-500 font-medium">You haven't placed any orders yet.</p>
              <Link to="/shop" className="inline-block px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg">Start Shopping</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
