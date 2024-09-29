import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToastProvider, Toast } from '@/components/ui/toast'; // Import ToastProvider
import { Skeleton } from '@/components/ui/skeleton'; 
import ConfirmDialog from '@/components/ConfirmDialog'; // Confirm dialog component
import { FaCheckCircle, FaShippingFast, FaBoxOpen, FaClipboardCheck, FaExclamationTriangle } from 'react-icons/fa';

interface Order {
  order_id: number;
  customer_name: string;
  product_id: number;
  quantity: number;
  status: 'Pending' | 'Calling for Confirmation' | 'Confirmed' | 'Packing' | 'Out for Delivery' | 'Delivered (Waiting for DC to Call You)';
}

const initialOrderState: Order = {
  order_id: 0,
  customer_name: '',
  product_id: 0,
  quantity: 1,
  status: 'Pending',
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order>(initialOrderState);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError('Error fetching orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const url = currentOrder.order_id ? `/api/orders/${currentOrder.order_id}` : '/api/orders';
      const method = currentOrder.order_id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentOrder),
      });
      if (!response.ok) {
        throw new Error('Failed to save order');
      }
      fetchOrders();
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setToastMessage(`Order ${currentOrder.order_id ? 'updated' : 'added'} successfully!`);
    } catch (err) {
      console.error('Error saving order:', err);
      setError('Failed to save order. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (orderToDelete === null) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/orders/${orderToDelete}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      fetchOrders();
      setToastMessage('Order deleted successfully!');
    } catch (err) {
      console.error('Error deleting order:', err);
      setError('Failed to delete order. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsConfirmDialogOpen(false); // Close the confirm dialog
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'Calling for Confirmation':
        return 'bg-blue-200 text-blue-800';
      case 'Confirmed':
        return 'bg-green-200 text-green-800';
      case 'Packing':
        return 'bg-orange-200 text-orange-800';
      case 'Out for Delivery':
        return 'bg-purple-200 text-purple-800';
      case 'Delivered (Waiting for DC to Call You)':
        return 'bg-gray-200 text-gray-800';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <FaExclamationTriangle />;
      case 'Calling for Confirmation':
        return <FaClipboardCheck />;
      case 'Confirmed':
        return <FaCheckCircle />;
      case 'Packing':
        return <FaBoxOpen />;
      case 'Out for Delivery':
        return <FaShippingFast />;
      case 'Delivered (Waiting for DC to Call You)':
        return <FaCheckCircle />;
      default:
        return null;
    }
  };

  const OrderForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="customer_name" className="text-right">Customer Name <span className="text-red-500">*</span></Label>
          <Input id="customer_name" name="customer_name" value={currentOrder.customer_name} onChange={handleInputChange} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="product_id" className="text-right">Product ID <span className="text-red-500">*</span></Label>
          <Input id="product_id" name="product_id" type="number" value={currentOrder.product_id} onChange={handleInputChange} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="quantity" className="text-right">Quantity <span className="text-red-500">*</span></Label>
          <Input id="quantity" name="quantity" type="number" value={currentOrder.quantity} onChange={handleInputChange} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">Status</Label>
          <Input id="status" name="status" value={currentOrder.status} onChange={handleInputChange} className="col-span-3" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Save Order</Button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="text-center">
        <Skeleton count={5} /> {/* Display skeleton for loading items */}
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <ToastProvider> {/* Wrap the content in ToastProvider */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Orders
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setCurrentOrder(initialOrderState)}>Add Order</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Order</DialogTitle>
                </DialogHeader>
                <OrderForm />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.order_id}>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.product_id}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell className={`flex items-center ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-2">{order.status}</span>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => {
                      setCurrentOrder(order);
                      setIsEditDialogOpen(true);
                    }}>Edit</Button>
                    <Button variant="destructive" onClick={() => {
                      setOrderToDelete(order.order_id);
                      setIsConfirmDialogOpen(true);
                    }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          <OrderForm />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete Order"
        message="Are you sure you want to delete this order?"
      />

    </ToastProvider>
  );
};

export default Orders;
