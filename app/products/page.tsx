
import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import Footer from "@/components/Footer";

const ProductPage = () => {
    return (
        <div className="flex flex-col min-h-screen dark:bg-gray-800">
            <Header title="Our Products" />
            <ProductList />
            <Footer />
        </div>
    );
};

export default ProductPage;
