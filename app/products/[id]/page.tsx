import Header from "@/components/Header";
import ProductDetail from "@/components/ProductDetail";
import Footer from "@/components/Footer";

const ProductPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Products Detail" />
            <ProductDetail />
            <Footer />
        </div>
    );
};

export default ProductPage;
