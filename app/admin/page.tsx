"use client"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Dashboard from "@/components/dashbeard"; // Corrected the path

const AdminProductPage = () => {
    return (
        <div className="flex flex-col min-h-screen w-full dark:bg-gray-800">
            <Dashboard /> {/* Ensure that the Dashboard component is correctly used */}
            <Footer />
        </div>
    );
};

export default AdminProductPage;
