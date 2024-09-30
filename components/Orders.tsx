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
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { FaCheckCircle, FaShippingFast, FaBoxOpen, FaClipboardCheck, FaExclamationTriangle, FaEye, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBox, FaDollarSign, FaCreditCard } from 'react-icons/fa';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
  order_id: number;
  customer_name: string;
  product_id: number;
  quantity: number;
  status: 'Pending' | 'Calling for Confirmation' | 'Confirmed' | 'Packing' | 'Out for Delivery' | 'Delivered (Waiting for DC to Call You)';
  customer_email: string;
  total_price: number;
  payment_method: string;
  phone_number: string;
  state: string;
  district: string;
}

interface Product {
  product_id: number;
  product_name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image1_url: string | null;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Order>('order_id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const orderResponse = await fetch(`/api/orders/${orderId}`);
      if (!orderResponse.ok) {
        throw new Error('Failed to fetch updated order details');
      }
      const updatedOrder = await orderResponse.json();
      setSelectedOrder(updatedOrder);

      const productResponse = await fetch(`/api/products/${updatedOrder.product_id}`);
      if (!productResponse.ok) {
        throw new Error('Failed to fetch product details');
      }
      const productData = await productResponse.json();
      setSelectedProduct(productData);
    } catch (err) {
      console.error('Error fetching updated order details:', err);
      toast.error('Failed to fetch latest order details. Please try again.');
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      // Fetch the updated order details
      await fetchOrderDetails(orderId);
      
      // Update the orders list
      setOrders(prevOrders => prevOrders.map(order => 
        order.order_id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success('Order status updated successfully');
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update order status. Please try again.');
    }
  };

  const handleDelete = async (orderId: number) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      setOrders(orders.filter(order => order.order_id !== orderId));
      toast.success('Order deleted successfully');
    } catch (err) {
      console.error('Error deleting order:', err);
      toast.error('Failed to delete order. Please try again.');
    }
  };

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    try {
      const response = await fetch(`/api/products/${order.product_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      const productData = await response.json();
      setSelectedProduct(productData);
    } catch (err) {
      console.error('Error fetching product details:', err);
      toast.error('Failed to fetch product details. Please try again.');
    }
    setIsViewDialogOpen(true);
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

  const filteredOrders = orders.filter(order =>
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.order_id.toString().includes(searchTerm)
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof Order) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const OrderDetailsPopup = ({ order, product, onStatusChange }: { order: Order, product: Product, onStatusChange: (orderId: number, newStatus: Order['status']) => void }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <h3 className="text-2xl font-bold mb-4">Order Information</h3>
            <div className="space-y-2">
              <p className="flex items-center"><FaBox className="mr-2" /> Order ID: {order.order_id}</p>
              <p className="flex items-center"><FaUser className="mr-2" /> Customer: {order.customer_name}</p>
              <p className="flex items-center"><FaEnvelope className="mr-2" /> Email: {order.customer_email}</p>
              <p className="flex items-center"><FaPhone className="mr-2" /> Phone: {order.phone_number}</p>
              <p className="flex items-center"><FaMapMarkerAlt className="mr-2" /> Location: {order.state}, {order.district}</p>
              <p className="flex items-center"><FaDollarSign className="mr-2" /> Total: ${order.total_price}</p>
              <p className="flex items-center"><FaCreditCard className="mr-2" /> Payment: {order.payment_method}</p>
              <div className="flex items-center mt-4">
                <span className="mr-2">Status:</span>
                <Select
                  value={order.status}
                  onValueChange={(value) => onStatusChange(order.order_id, value as Order['status'])}
                >
                  <SelectTrigger className={`w-full ${getStatusColor(order.status)}`}>
                    <SelectValue>{getStatusIcon(order.status)} {order.status}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Calling for Confirmation">Calling for Confirmation</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Packing">Packing</SelectItem>
                    <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                    <SelectItem value="Delivered (Waiting for DC to Call You)">Delivered (Waiting for DC to Call You)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 p-6">
            <h3 className="text-2xl font-bold mb-4">Product Details</h3>
            <div className="space-y-2">
              <p><strong>Product ID:</strong> {product.product_id}</p>
              <p><strong>Name:</strong> {product.product_name}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Description:</strong> {product.description}</p>
            </div>
            {product.image1_url && (
              <motion.img 
                src={`/uploads/${product.image1_url}`} 
                alt={product.product_name} 
                className="mt-4 rounded-lg shadow-md max-w-full h-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              />
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const ShimmerEffect = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-2xl font-bold">Orders</span>
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <ShimmerEffect />
              <ShimmerEffect />
              <ShimmerEffect />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('order_id')}>Order ID {sortColumn === 'order_id' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('customer_name')}>Customer Name {sortColumn === 'customer_name' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('product_id')}>Product ID {sortColumn === 'product_id' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('quantity')}>Quantity {sortColumn === 'quantity' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>Status {sortColumn === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOrders.map(order => (
                    <TableRow key={order.order_id}>
                      <TableCell>{order.order_id}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.product_id}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          <span className="mr-1">{getStatusIcon(order.status)}</span>
                          <span>{order.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => handleViewOrder(order)}>
                          <FaEye className="mr-2 h-4 w-4" /> View
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(order.order_id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && selectedProduct && (
            <OrderDetailsPopup 
              key={selectedOrder.order_id}
              order={selectedOrder} 
              product={selectedProduct}
              onStatusChange={handleStatusChange}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Orders;