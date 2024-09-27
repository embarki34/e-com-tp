// app/products/[id]/page.tsx
"use client";

import Header from "@/components/Header";
import ProductOrdering from "@/components/ProductOrdering";
import Footer from "@/components/Footer";

interface OrderOageProps {
  params: {
    id: string;
  };
}

const OrderOage: React.FC<OrderOageProps> = ({ params }) => {
  const { id } = params;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Product Ordering" />
      <ProductOrdering productId={id} />

      <Footer />
    </div>
  );
};

export default OrderOage;
