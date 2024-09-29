// app/admin/layout.tsx
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignOutButton } from "@clerk/nextjs";
import { redirect } from 'next/navigation';
import { Toaster } from "sonner";
import ClientLayout from "../ClientLayout"; // Import ClientLayout if needed
import { ThemeProvider } from "@/providers/providers";

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
            {/* Protect admin routes */}
            <SignedIn>
              <ClientLayout>
                
                {children}
                <Toaster />
              </ClientLayout>
            </SignedIn>
            <SignedOut>
              {/* Redirect to sign-in page if not signed in */}
              <SignIn routing="hash"  />
              
            </SignedOut>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
