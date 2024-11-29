import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import Image from "next/image";
import CreditCardIcon from "@mui/icons-material/Payment";
import CashIcon from "@mui/icons-material/AttachMoney";
import { MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from "@mui/material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import CustomDialog from "@/components/ui/costemdila";

interface Product {
  product_id: string;
  product_name: string;
  description: string;
  price: number;
  image1_url: string;
}

interface Order {
  order_id: string;
  customer_name: string;
  quantity: number;
  total_price: number;
  payment_method: string;
  status: string;
}

interface ProductOrderingProps {
  productId: string;
}

const ProductOrdering: React.FC<ProductOrderingProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    customerEmail: "",
    customerName: "",
    quantity: 1,
    phoneNumber: "",
    state: "",
    district: "",
    paymentMethod: "Credit Card"
  });
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderStatusUrl, setOrderStatusUrl] = useState("");

  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const productData = await response.json();
          setProduct(productData);
        } else {
          toast.error("Product not found");
        }
      } catch (err) {
        toast.error("Failed to fetch product details");
      } finally {
        setProductLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      product_id: productId,
      ...formData,
      total_price: (product?.price || 0) * formData.quantity,
      status: "Pending",
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Order placed successfully! Order ID: ${result.order_id}`);

        const orderResponse = await fetch(`/api/orders/${result.order_id}`);
        if (orderResponse.ok) {
          const orderDetails = await orderResponse.json();
          setOrder(orderDetails);
          setOrderStatusUrl(`/api/ordersstats/${result.order_id}`);
        } else {
          const result = await orderResponse.json();
          toast.error(result.message || "Failed to fetch order details");
        }
      } else {
        const result = await response.json();
        toast.error(result.message || "Error placing the order");
      }
    } catch (error) {
      toast.error("Failed to submit the order");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(orderStatusUrl);
      toast.success("Order status URL copied!");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
          Product not found
        </div>
      </div>
    );
  }

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative p-8 flex items-center bg-white justify-center bg-gray-50 dark:bg-gray-900">
            <div className="relative w-full max-w-lg bg-white aspect-square rounded-xl overflow-hidden cursor-pointer" onClick={() => window.open(`/uploads/${product.image1_url}`, '_blank')}>
              <Image
                src={`/uploads/${product.image1_url}`}
                alt={product.product_name}
                fill
                className="object-cover transform hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {product.product_name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {product.description}
              </p>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  ${product.price}
                </span>
                <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                  In Stock
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Quantity</InputLabel>
                  <Select
                    name="quantity"
                    value={formData.quantity}
                    onChange={(event: SelectChangeEvent<number>) => {
                      handleInputChange({
                        target: {
                          name: event.target.name,
                          value: event.target.value
                        }
                      } as React.ChangeEvent<HTMLInputElement>)
                    }}
                    label="Quantity"
                    className="bg-white dark:bg-gray-700"
                  >
                    {[...Array(10)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth variant="outlined">
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(event: SelectChangeEvent<string>) => {
                      handleInputChange({
                        target: {
                          name: event.target.name,
                          value: event.target.value
                        }
                      } as React.ChangeEvent<HTMLInputElement>)
                    }}
                    label="Payment Method"
                    className="bg-white dark:bg-gray-700"
                  >
                    <MenuItem value="Credit Card">
                      <div className="flex items-center gap-2">
                        <CreditCardIcon className="text-blue-500" />
                        <span>Credit Card</span>
                      </div>
                    </MenuItem>
                    <MenuItem value="Cash on Delivery">
                      <div className="flex items-center gap-2">
                        <CashIcon className="text-green-500" />
                        <span>Cash on Delivery</span>
                      </div>
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="space-y-4">
                {[
                  { name: "customerName", type: "text", placeholder: "Your Name" },
                  { name: "customerEmail", type: "email", placeholder: "Your Email" },
                  { name: "phoneNumber", type: "tel", placeholder: "Phone Number" },
                ].map((field) => (
                  <input
                    key={field.name}
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleInputChange(event)
                    }}
                    className={inputClasses}
                    required
                  />
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "state", placeholder: "State (Wilaya)" },
                    { name: "district", placeholder: "District (Baladeya)" }
                  ].map((field) => (
                    <input
                      key={field.name}
                      type="text"
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name as keyof typeof formData]}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        handleInputChange(event)
                      }}
                      className={inputClasses}
                      required
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-colors duration-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Place Order"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {order && product && <CustomDialog order={order} product={product} />}
    </div>
  );
};

export default ProductOrdering;
