"use client"
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Package, Truck, CreditCard, Calendar, MapPin, User, Mail, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Order {
  order_id: number;
  product_id: number;
  customer_email: string;
  customer_name: string;
  quantity: number;
  total_price: string;
  order_date: string;
  payment_method: string;
  state: string;
  district: string;
  status:
    | "Pending"
    | "Calling for Confirmation"
    | "Confirmed"
    | "Packing"
    | "Out for Delivery"
    | "Delivered (Waiting for DC to Call You)";
}

interface Product {
  product_id: number;
  product_name: string;
  description: string;
  price: string;
  stock_quantity: number;
  image1_url: string;
}

const OrderStatus = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrderDetails = async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order details.");
      }
      const data: Order = await response.json();
      setOrder(data);
      await fetchProductDetails(data.product_id);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductDetails = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product details.");
      }
      const productData: Product = await response.json();
      setProduct(productData);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFetchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  };

  const renderStatusSteps = (status: Order["status"]) => {
    const statuses = [
      "Pending",
      "Calling for Confirmation",
      "Confirmed",
      "Packing",
      "Out for Delivery",
      "Delivered (Waiting for DC to Call You)",
    ];

    return (
      <div className="flex flex-col space-y-4 mt-6">
        {statuses.map((step, index) => {
          const isActive = index <= statuses.indexOf(status);
          return (
            <div key={step} className="flex items-center">
              {isActive ? (
                <CheckCircle className="text-green-500 w-5 h-5" />
              ) : (
                <Circle className="text-gray-300 w-5 h-5" />
              )}
              <span
                className={`ml-3 transition-all duration-300 ${
                  isActive ? "font-semibold text-gray-800" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <Skeleton className="h-6 w-1/2 mb-4 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-64 w-full mb-4 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-6 w-3/4 mb-2 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-4 w-full mb-4 bg-gray-200 dark:bg-gray-700" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 shadow-sm">
        <Skeleton className="h-6 w-1/2 mb-4 bg-gray-200 dark:bg-gray-700" />
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2 mb-4">
            <Skeleton className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2 mb-4">
            <Skeleton className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <form onSubmit={handleFetchOrder} className="space-y-4 mb-6">
            <div className="space-y-2">
              <label htmlFor="order-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter Order ID
              </label>
              <div className="flex space-x-2">
                <Input
                  id="order-id"
                  placeholder="e.g., 123456"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                  className="flex-grow bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <Button type="submit" variant="default" className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading
                    </>
                  ) : (
                    'Track Order'
                  )}
                </Button>
              </div>
            </div>
          </form>
  
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
  
          {isLoading && renderSkeleton()}
  
          {!isLoading && order && product && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column: Product Details */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Product Information</h3>
                <div className="space-y-4">
                  <img
                    src={`/uploads/${product.image1_url}`}
                    alt={product.product_name}
                    className="w-full h-64 object-cover rounded-md shadow-sm"
                  />
                  <h4 className="font-semibold text-gray-700 dark:text-gray-200 text-xl">{product.product_name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400">Price: ${product.price}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Stock: {product.stock_quantity}</span>
                  </div>
                </div>
              </div>
  
              {/* Right column: Order Information */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Package className="text-gray-400 dark:text-gray-500 w-5 h-5" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Order ID: <strong>{order.order_id}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="text-gray-400 dark:text-gray-500 w-5 h-5" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Customer: <strong>{order.customer_name}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="text-gray-400 dark:text-gray-500 w-5 h-5" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Email: <strong>{order.customer_email}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="text-gray-400 dark:text-gray-500 w-5 h-5" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total: <strong>${order.total_price}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-gray-400 dark:text-gray-500 w-5 h-5" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Date: <strong>{new Date(order.order_date).toLocaleDateString()}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="text-gray-400 dark:text-gray-500 w-5 h-5" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Quantity: <strong>{order.quantity}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="text-gray-400 dark:text-gray-500 w-5 h-5" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Location: <strong>{order.state}, {order.district}</strong></span>
                  </div>
                </div>
                {renderStatusSteps(order.status)}
              </div>
            </div>
          )}
  
          {!isLoading && !order && !error && (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm h-96 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">Enter an order ID to track your order.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderStatus;