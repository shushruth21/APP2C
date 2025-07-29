import React, { useState } from 'react';
import { useOrders, useOrderItems } from '../hooks/useSupabase';
import { Package, Calendar, IndianRupee, Eye, Truck, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

export const OrderManager: React.FC = () => {
  const { orders, loading, error, createOrder } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { items: orderItems, loading: itemsLoading } = useOrderItems(selectedOrderId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'in_production': return 'text-purple-600 bg-purple-100';
      case 'ready': return 'text-green-600 bg-green-100';
      case 'delivered': return 'text-emerald-600 bg-emerald-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Calendar className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'in_production': return <Package className="w-4 h-4" />;
      case 'ready': return <Package className="w-4 h-4" />;
      case 'delivered': return <Truck className="w-4 h-4" />;
      case 'cancelled': return <Eye className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('₹', '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-forest-green">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <strong>Error loading orders:</strong> {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-forest-green">Your Orders</h2>
        <div className="text-sm text-forest-green/70">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-forest-green/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-forest-green mb-2">No orders yet</h3>
          <p className="text-forest-green/70">Your orders will appear here once you make a purchase.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gold-500/30 shadow-luxury p-6 hover:shadow-luxury-lg transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-1">
                    Order #{order.order_number}
                  </h3>
                  <p className="text-sm text-forest-green/70">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-end mt-2 text-forest-green">
                    <IndianRupee className="w-4 h-4" />
                    <span className="font-semibold">₹{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>

              {order.customer_notes && (
                <div className="mb-4 p-3 bg-gold-100 rounded-lg">
                  <p className="text-sm text-forest-green">
                    <strong>Notes:</strong> {order.customer_notes}
                  </p>
                </div>
              )}

              {order.delivery_address && (
                <div className="mb-4 text-sm text-forest-green/70">
                  <strong>Delivery Address:</strong> {order.delivery_address}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gold-500/20">
                <button
                  onClick={() => setSelectedOrderId(selectedOrderId === order.id ? null : order.id)}
                  className="text-gold-500 hover:text-gold-600 font-medium text-sm flex items-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>{selectedOrderId === order.id ? 'Hide Details' : 'View Details'}</span>
                </button>
                
                {order.delivery_date && (
                  <div className="text-sm text-forest-green/70">
                    <strong>Expected Delivery:</strong> {new Date(order.delivery_date).toLocaleDateString('en-IN')}
                  </div>
                )}
              </div>

              {/* Order Items */}
              {selectedOrderId === order.id && (
                <div className="mt-6 pt-6 border-t border-gold-500/20">
                  <h4 className="font-semibold text-forest-green mb-4">Order Items</h4>
                  {itemsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2 text-sm text-forest-green/70">Loading items...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orderItems.map((item) => (
                        <div key={item.id} className="bg-forest-50 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-forest-green mb-2">
                                Configured Furniture Item
                              </h5>
                              <div className="text-sm text-forest-green/70 space-y-1">
                                <div><strong>Quantity:</strong> {item.quantity}</div>
                                <div><strong>Base Price:</strong> ₹{formatPrice(item.item_price)}</div>
                                {item.fabric_cost > 0 && (
                                  <div><strong>Fabric Cost:</strong> ₹{formatPrice(item.fabric_cost)}</div>
                                )}
                                {item.upgrade_cost > 0 && (
                                  <div><strong>Upgrades:</strong> ₹{formatPrice(item.upgrade_cost)}</div>
                                )}
                              </div>
                              
                              {/* Configuration Details */}
                              <div className="mt-3 p-3 bg-white rounded border border-gold-500/20">
                                <h6 className="text-xs font-semibold text-forest-green mb-2 uppercase tracking-wide">
                                  Configuration
                                </h6>
                                <div className="grid grid-cols-2 gap-2 text-xs text-forest-green/70">
                                  {Object.entries(item.configuration_data).map(([key, value]) => (
                                    <div key={key}>
                                      <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong>{' '}
                                      {Array.isArray(value) ? value.join(', ') : String(value)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="font-semibold text-forest-green">
                                ₹{formatPrice(item.item_price + item.fabric_cost + item.upgrade_cost)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};