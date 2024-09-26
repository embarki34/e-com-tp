
import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
        <Header />
        <ProductList />
        <Footer />
    </div>
    );
}
