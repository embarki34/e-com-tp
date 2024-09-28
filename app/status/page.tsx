import Header from "@/components/Header";
import OrderStatus from "@/components/OrderStatus";
import Footer from "@/components/Footer";

const StatusPage = () => {
    return (
        <div className="flex flex-col min-h-screen w-full dark:bg-gray-800">
            <Header title="Order Status" />
            <OrderStatus />
            <Footer />
        </div>
    );
};

export default StatusPage;