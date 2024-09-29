import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/providers"; // Update this import path
import { cn } from "@/lib/utils";
import Products from "@/components/Products";
import Orders from "@/components/Orders";
import CustomSignOutButton from "@/components/CustomSignOutButton";
import { SignOutButton } from "@clerk/nextjs";
import { dark } from "@mui/material/styles/createPalette";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const navItems = [
    { value: "products", icon: Package, label: "Products" },
    { value: "orders", icon: ShoppingCart, label: "Orders" },
  ];

  return (
    <div
      className={cn(
        "flex h-screen",
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      )}
    >
      <aside
        className={cn(
          "transition-all duration-300 ease-in-out flex flex-col",
          theme === "dark" ? "bg-gray-800" : "bg-white",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex items-center p-4  ",
            isSidebarCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!isSidebarCollapsed && (
            <h2
              className={cn(
                "text-xl font-bold flex items-center",
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              )}
            >
              <LayoutDashboard className="mr-2" />
              Dashboard
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="rounded-full"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-6 w-6" />
            ) : (
              <ChevronLeft className="h-6 w-6" />
            )}
          </Button>
        </div>
        <nav className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            orientation="vertical"
            className="h-full"
          >
            <TabsList className="flex flex-col h-full bg-white dark:bg-gray-800">
              {navItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className={cn(
                    "flex items-center w-full py-4",
                    isSidebarCollapsed ? "justify-center" : "justify-start px-4"
                  )}
                >
                  <item.icon
                    className={cn(
                      "transition-all",
                      isSidebarCollapsed ? "h-8 w-8" : "h-5 w-5 mr-2"
                    )}
                  />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </nav>
        <div
          className={cn(
            "p-4",
            isSidebarCollapsed
              ? "flex justify-center"
              : "flex justify-between items-center"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full "
          >
            {theme === "dark" ? (
              <Sun
                className={cn(
                  isSidebarCollapsed
                    ? "h-8 w-8 text-white"
                    : "h-5 w-5 text-white"
                )}
              />
            ) : (
              <Moon
                className={cn(isSidebarCollapsed ? "h-8 w-8" : "h-5 w-5")}
              />
            )}
          </Button>

          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-2">
              {" "}
              {/* Added flex and spacing */}
              <CustomSignOutButton />
              
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <Tabs value={activeTab} className="space-y-4">
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Package className="mr-2 h-6 w-6" />
                  Products Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Products />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <ShoppingCart className="mr-2 h-6 w-6" />
                  Orders Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Orders />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
