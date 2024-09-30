// app/admin/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/providers";
import dynamic from 'next/dynamic';

const AuthCheck = dynamic(() => import('./AuthCheck'), { ssr: false });

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin section for managing the application",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <ThemeProvider>
            <AuthCheck>{children}</AuthCheck>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
