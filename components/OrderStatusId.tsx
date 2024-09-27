import React, { useState, useEffect } from "react";
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

interface OrderStatusIdProps {
  orderId: string;
}

const OrderStatusId: React.FC<OrderStatusIdProps> = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

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
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        <Skeleton className="h-6 w-1/2 mb-4" />
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2 mb-4">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-6">

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && renderSkeleton()}

          {!isLoading && order && product && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column: Product Details */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Information</h3>
                <div className="space-y-4">
                  <img
                    src={`/uploads/${product.image1_url}`}
                    alt={product.product_name}
                    className="w-full h-64 object-cover rounded-md shadow-sm"
                  />
                  <h4 className="font-semibold text-gray-700 text-xl">{product.product_name}</h4>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-blue-600">Price: ${product.price}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock_quantity}</span>
                  </div>
                </div>
              </div>

              {/* Right column: Order Information */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Package className="text-gray-400 w-5 h-5" />
                    <span className="text-sm text-gray-600">Order ID: <strong>{order.order_id}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="text-gray-400 w-5 h-5" />
                    <span className="text-sm text-gray-600">Customer: <strong>{order.customer_name}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="text-gray-400 w-5 h-5" />
                    <span className="text-sm text-gray-600">Email: <strong>{order.customer_email}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="text-gray-400 w-5 h-5" />
                    <span className="text-sm text-gray-600">Total: <strong>${order.total_price}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-gray-400 w-5 h-5" />
                    <span className="text-sm text-gray-600">Date: <strong>{new Date(order.order_date).toLocaleDateString()}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="text-gray-400 w-5 h-5" />
                    <span className="text-sm text-gray-600">Quantity: <strong>{order.quantity}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="text-gray-400 w-5 h-5" />
                    <span className="text-sm text-gray-600">Location: <strong>{order.state}, {order.district}</strong></span>
                  </div>
                </div>
                {renderStatusSteps(order.status)}
              </div>
            </div>
          )}

          {!isLoading && !order && !error && (
            <div className="bg-white rounded-lg p-6 shadow-sm h-96 flex items-center justify-center">
              <Loader2 className="animate-spin text-gray-400 w-12 h-12" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderStatusId;
