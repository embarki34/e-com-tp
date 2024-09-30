'use client';

import { useAuth, SignIn } from "@clerk/nextjs";
import ClientLayout from "../ClientLayout";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <SignIn routing="hash" />;
  }

  return <ClientLayout>{children}</ClientLayout>;
}