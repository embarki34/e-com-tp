// app/products/[id]/page.tsx
"use client";

import Header from "@/components/Header";
import ProductDetail from "@/components/ProductDetail";
import Footer from "@/components/Footer";

interface ProductPageProps {
    params: {
        id: string;
    };
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
    const { id } = params;

    return (
        <div className="flex flex-col min-h-screen dark:bg-gray-800">
            <Header title="Product Detail" />
            <ProductDetail productId={id} />
            <Footer />
        </div>
    );
};

export default ProductPage;
