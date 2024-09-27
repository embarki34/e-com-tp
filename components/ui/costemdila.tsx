import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Separator } from "@/components/ui/separator";

interface Order {
  order_id: string;
  customer_name: string;
  quantity: number;
  total_price: number;
  payment_method: string;
  status: string;
}

interface Product {
  product_id: string;
  product_name: string;
  price: number;
  image1_url: string; // Ensure the image field is updated to match your data
}

interface CustomDialogProps {
  order: Order;
  product: Product; // Add product prop
}

export default function CustomDialog({ order, product }: CustomDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(true); // Automatically open the dialog on load
  const orderStatusUrl = `/status/${order.order_id}`; // Construct the order status URL
  const router = useRouter();
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(orderStatusUrl)
      .then(() => {
        alert("Order URL copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  };

  // Optional: Close dialog after copying URL
  const handleNavigateToProduct = () => {
    router.push(`/status/${order.order_id}`); // Navigate to the product page
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="grid gap-6 p-6">
          <div className="flex items-start justify-between">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={`/uploads/${product.image1_url}`} // Use the product image URL
                  alt={product.product_name} // Use the product name for alt text
                  width={100}
                  height={100}
                  className="rounded-md"
                  style={{ aspectRatio: "64/64", objectFit: "cover" }}
                />
                <div>
                  <h3 className="font-semibold">{order.customer_name}</h3> {/* Display customer name */}
                  <p className="text-muted-foreground">Quantity: {order.quantity}</p>
                  <p className="text-muted-foreground">Product: {product.product_name}</p> {/* Display product name */}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PackageIcon className="h-5 w-5 text-muted-foreground" />
                <p>Order N: {order.order_id}</p> {/* Display order ID */}
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">${order.total_price}</p> {/* Display total price */}
              <Button variant="outline" size="icon" className="mt-2" onClick={handleCopyUrl}>
                <CopyIcon className="h-4 w-4" />
                <span className="sr-only">Copy Order URL</span>
              </Button>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Payment Method</p>
              <p>{order.payment_method}</p> {/* Display payment method */}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Status</p>
              <p>{order.status}</p> {/* Display order status */}
            </div>
          </div>
        </div>
        <DialogFooter>
          <div>
            <Button onClick={handleNavigateToProduct}>Order Status</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function PackageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
