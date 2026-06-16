import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X as XIcon, Truck, Package } from 'lucide-react';
import { orderService } from '../../services/orderService';

export const Requests: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['sellerOrders'],
    queryFn: orderService.getSupplierOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerOrders'] });
    },
  });

  const handleStatusUpdate = (id: string, status: string) => {
    if (confirm(`Are you sure you want to mark this order as ${status}?`)) {
      updateStatusMutation.mutate({ id, status });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and manage incoming orders.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-accent/50 text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Listing Details</th>
                <th className="px-6 py-4">Buyer Info</th>
                <th className="px-6 py-4">Order Value</th>
                <th className="px-6 py-4">Order / Payment Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading orders...</td></tr>
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No orders received yet.</td></tr>
              ) : (
                data?.data?.map((req: any) => (
                  <tr key={req._id} className="hover:bg-accent/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{req.listingId?.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{req.listingId?.category?.replace('_', ' ')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{req.buyerId?.companyName || req.buyerId?.fullName}</p>
                      <p className="text-xs text-muted-foreground">{req.buyerId?.email}</p>
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
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(req._id, 'accepted')}
                            className="p-1.5 text-green-600 bg-green-500/10 hover:bg-green-500/20 rounded-md transition-colors"
                            title="Accept Request"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(req._id, 'rejected')}
                            className="p-1.5 text-red-600 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors"
                            title="Reject Request"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {req.orderStatus === 'paid' && (
                        <button 
                          onClick={() => handleStatusUpdate(req._id, 'processing')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-500/10 hover:bg-orange-500/20 rounded-md transition-colors ml-auto"
                        >
                          <Package className="w-3.5 h-3.5" /> Start Processing
                        </button>
                      )}
                      {req.orderStatus === 'processing' && (
                        <button 
                          onClick={() => handleStatusUpdate(req._id, 'shipped')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-500/10 hover:bg-purple-500/20 rounded-md transition-colors ml-auto"
                        >
                          <Truck className="w-3.5 h-3.5" /> Mark Shipped
                        </button>
                      )}
                      {req.orderStatus === 'shipped' && (
                        <button 
                          onClick={() => handleStatusUpdate(req._id, 'completed')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-500/10 hover:bg-green-500/20 rounded-md transition-colors ml-auto"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark Completed
                        </button>
                      )}
                      {(req.orderStatus === 'completed' || req.orderStatus === 'rejected' || req.orderStatus === 'cancelled' || req.orderStatus === 'accepted') && (
                        <span className="text-xs text-muted-foreground">{req.orderStatus === 'accepted' ? 'Waiting for payment' : 'No actions'}</span>
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
