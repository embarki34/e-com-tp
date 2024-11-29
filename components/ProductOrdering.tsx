import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner"; // Import Toaster and toast
import Image from "next/image"; // Use Next.js Image component for product images
import CreditCardIcon from "@mui/icons-material/Payment"; // Material UI icon for Credit Card
import CashIcon from "@mui/icons-material/AttachMoney"; // Material UI icon for Cash on Delivery
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material"; // Material UI components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material"; // Material UI for Dialog
import CustomDialog from "@/components/ui/costemdila";

interface Product {
  product_id: string;
  product_name: string;
  description: string;
  price: number;
  image1_url: string; // Ensure the image field is updated to match your data
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
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null); // State to hold order details
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
  const [orderStatusUrl, setOrderStatusUrl] = useState(""); // URL for checking order status

  // Fetch product details
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      product_id: productId,
      customer_email: customerEmail,
      customer_name: customerName,
      quantity,
      total_price: (product?.price || 0) * quantity,
      payment_method: paymentMethod,
      phone_number: phoneNumber,
      state,
      district,
      status: "Pending",
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(
          `Order placed successfully! Order ID: ${result.order_id}`
        );

        // Fetch the order details after successful placement
        const orderResponse = await fetch(
          `/api/orders/${result.order_id}`
        );
        if (orderResponse.ok) {
          const orderDetails = await orderResponse.json();
          setOrder(orderDetails);
          setOrderStatusUrl(
            `/api/ordersstats/${result.order_id}`
          );
          setDialogOpen(true); // Open the dialog to show order details
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

  // Function to copy the order status URL to clipboard
  const handleCopyUrl = () => {
    navigator.clipboard
      .writeText(orderStatusUrl)
      .then(() => {
        toast.success("Order status URL copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy URL");
      });
  };

  if (productLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen dark:bg-gray-800">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center mt-8">Product not found</div>;
  }

  return (
    <div className="p-6 max-w-9xl mx-auto bg-white dark:bg-gray-800 rounded-lg">
    {/* Toaster for notifications */}
    <Toaster />
    <div className="flex flex-col md:flex-row items-center">
      <div className="w-full md:w-full">
        <Image
          src={`/uploads/${product.image1_url}`}
          alt={product.product_name}
          width={500}
          height={500}
          className="rounded-lg shadow-lg"
        />
      </div>
  
      <div className="w-full md:w-full mt-9 md:mt-0 md:ml-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{product.product_name}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{product.description}</p>
        <p className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Price: ${product.price}</p>
  
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel htmlFor="quantity" className="text-gray-700 dark:text-gray-300">Quantity</InputLabel>
            <Select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              label="Quantity"
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {Array.from({ length: 10 }, (_, index) => (
                <MenuItem key={index + 1} value={index + 1} className="text-gray-900 dark:text-white">
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel htmlFor="payment-method" className="text-gray-700 dark:text-gray-300">Payment Method</InputLabel>
            <Select
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              label="Payment Method"
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <MenuItem value="Credit Card" className="text-gray-900 dark:text-white">
                <CreditCardIcon /> Credit Card
              </MenuItem>
              <MenuItem value="Cash on Delivery" className="text-gray-900 dark:text-white">
                <CashIcon /> Cash on Delivery
              </MenuItem>
            </Select>
          </FormControl>
  
          <div className="flex flex-col mt-4">
            <input
              placeholder="Your Name"
              type="text"
              id="customer-name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="border rounded-md p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
  
            <input
              placeholder="Your Email"
              type="email"
              id="customer-email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
              className="border rounded-md p-3 mt-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
  
            <input
              placeholder="Phone Number"
              type="tel"
              id="phone-number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="border rounded-md p-3 mt-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
  
            <input
              placeholder="State (Wilaya)"
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="border rounded-md p-3 mt-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
  
            <input
              placeholder="District (Baladeya)"
              type="text"
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
              className="border rounded-md p-3 mt-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
  
          <div className="mt-6">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  
    {order && product && <CustomDialog order={order} product={product} />}
  </div>
  );
};

export default ProductOrdering;
