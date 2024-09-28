"use client"; // This makes the component a Client Component

import Navbar from "@/components/navbar";
import { usePathname } from 'next/navigation'; // Import usePathname
import { Toaster } from 'sonner';


const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // Access the current pathname

  // Check if the current path is the admin route
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />} {/* Render Navbar only if not on admin routes */}
      {children}
      <Toaster/>
    </>
  );
};

export default ClientLayout;
