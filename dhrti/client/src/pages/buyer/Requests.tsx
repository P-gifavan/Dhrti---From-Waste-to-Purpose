import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X as XIcon, CreditCard } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Requests: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['buyerOrders'],
    queryFn: orderService.getBuyerOrders,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => orderService.updateOrderStatus(id, 'cancelled'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyerOrders'] });
    },
  });

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      cancelMutation.mutate(id);
    }
  };

  const handlePayment = async (orderId: string) => {
    try {
      // Load Razorpay script if not already loaded
      const loadScript = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const res = await loadScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      // Create order on backend
      const data = await paymentService.createPaymentOrder(orderId);
      if (!data.success) {
        alert('Failed to create payment order');
        return;
      }

      const { razorpayOrderId, amount, currency } = data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: 'Dhrti Marketplace',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            await paymentService.verifyPayment({
              orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
            alert('Payment successful!');
            queryClient.invalidateQueries({ queryKey: ['buyerOrders'] });
          } catch (err) {
            console.error('Payment Verification Failed', err);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Buyer Name',
          email: 'buyer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#16a34a',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Something went wrong during payment setup.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your purchasing orders and view supplier details.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-accent/50 text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Listing Details</th>
                <th className="px-6 py-4">Supplier Info</th>
                <th className="px-6 py-4">Order Value</th>
                <th className="px-6 py-4">Order / Payment Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading orders...</td></tr>
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No orders placed yet. Browse the marketplace to start purchasing.</td></tr>
              ) : (
                data?.data?.map((req: any) => (
                  <tr key={req._id} className="hover:bg-accent/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{req.listingId?.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{req.listingId?.category?.replace('_', ' ')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{req.sellerId?.companyName || req.sellerId?.fullName}</p>
                      {(req.orderStatus !== 'pending' && req.orderStatus !== 'rejected' && req.orderStatus !== 'cancelled') ? (
                        <p className="text-xs text-primary mt-1 font-medium">{req.sellerId?.email || 'Contact available'}</p>
                      ) : (
                        <p className="text-[10px] text-muted-foreground mt-1 italic">Contact unlocked upon acceptance</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{req.quantityKg.toLocaleString()} kg</p>
                      <p className="text-xs text-muted-foreground">Total: ₹{req.totalAmount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.orderStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-600' :
                          req.orderStatus === 'accepted' ? 'bg-blue-500/10 text-blue-600' :
                          req.orderStatus === 'paid' ? 'bg-indigo-500/10 text-indigo-600' :
                          req.orderStatus === 'processing' ? 'bg-orange-500/10 text-orange-600' :
                          req.orderStatus === 'shipped' ? 'bg-purple-500/10 text-purple-600' :
                          req.orderStatus === 'completed' ? 'bg-green-500/10 text-green-600' :
                          'bg-red-500/10 text-red-600'
                        }`}>
                          {req.orderStatus}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-600' :
                          'bg-red-500/10 text-red-600'
                        }`}>
                          {req.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.orderStatus === 'pending' && (
                        <button 
                          onClick={() => handleCancel(req._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-md transition-colors ml-auto"
                        >
                          <XIcon className="w-3.5 h-3.5" /> Cancel Order
                        </button>
                      )}
                      {req.orderStatus === 'accepted' && req.paymentStatus === 'unpaid' && (
                        <button 
                          onClick={() => handlePayment(req._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-500/10 hover:bg-blue-500/20 rounded-md transition-colors ml-auto shadow-sm"
                        >
                          <CreditCard className="w-3.5 h-3.5" /> Pay Now
                        </button>
                      )}
                      {(req.orderStatus !== 'pending' && req.orderStatus !== 'accepted') && (
                        <span className="text-xs text-muted-foreground">No actions</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
