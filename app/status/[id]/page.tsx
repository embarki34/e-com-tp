"use client"
import React from "react";
import Header from "@/components/Header";
import OrderStatusId from "@/components/OrderStatusId";
import Footer from "@/components/Footer";


interface StatusPageProps {
    params: {
        id: string;
    };
}

const StatusPageId = ({ params: { id } }: StatusPageProps) => {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <navbar/>
            <Header title="Order Status" />
            <OrderStatusId orderId={id} />
            <Footer />
        </div>
    );
};

export default StatusPageId;
