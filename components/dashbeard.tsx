import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  User,
  BarChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/providers";
import { cn } from "@/lib/utils";
import Products from "@/components/Products";
import Orders from "@/components/Orders";
import Stats from "@/components/Stats";
import CustomSignOutButton from "@/components/CustomSignOutButton";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const navItems = [
    { value: "stats", icon: BarChart, label: "Stats" },
    { value: "products", icon: Package, label: "Products" },
    { value: "orders", icon: ShoppingCart, label: "Orders" },
  ];

  const renderSidebar = () => (
    <aside
      className={cn(
        "transition-all duration-300 ease-in-out flex flex-col",
        theme === "dark" ? "bg-gray-800" : "bg-white",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn(
        "flex items-center p-4",
        isSidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isSidebarCollapsed && (
          <h2 className={cn(
            "text-xl font-bold flex items-center",
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          )}>
            <LayoutDashboard className="mr-2" />
            Dashboard
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isSidebarCollapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
        </Button>
      </div>

      <nav className="flex-1 mt-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} orientation="vertical" className="h-full">
          <TabsList className="flex flex-col h-full bg-transparent">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className={cn(
                  "flex items-center w-full py-3 mb-2",
                  isSidebarCollapsed ? "justify-center" : "justify-start px-4",
                  "hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                )}
              >
                <item.icon className={cn("transition-all", isSidebarCollapsed ? "h-6 w-6" : "h-5 w-5 mr-3")} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </nav>

      <div className={cn(
        "p-4 mt-auto",
        isSidebarCollapsed ? "flex flex-col items-center space-y-4" : "flex justify-between items-center"
      )}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {theme === "dark" ? (
            <Sun className={cn(isSidebarCollapsed ? "h-6 w-6" : "h-5 w-5")} />
          ) : (
            <Moon className={cn(isSidebarCollapsed ? "h-6 w-6" : "h-5 w-5")} />
          )}
        </Button>

        {!isSidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <CustomSignOutButton />
          </div>
        )}
      </div>
    </aside>
  );

  const renderContent = () => (
    <main className="flex-1 p-6 overflow-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {activeTab === "stats" && "Dashboard Overview"}
          {activeTab === "products" && "Products Management"}
          {activeTab === "orders" && "Orders Overview"}
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm hidden md:inline">{user?.fullName}</span>
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <Tabs value={activeTab} className="space-y-4">
        <TabsContent value="stats">
          <Stats />
        </TabsContent>
        <TabsContent value="products">
          <Card className={cn("shadow-lg", 
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white")}>
            <CardHeader className={cn(
              theme === "dark" ? "bg-gray-700" : "bg-gray-50"
            )}>
              <CardTitle className="text-2xl flex items-center">
                <Package className="mr-2 h-6 w-6 text-blue-500" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Products />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 dark:bg-gray-800">
              <CardTitle className="text-2xl flex items-center">
                <ShoppingCart className="mr-2 h-6 w-6 text-green-500" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Orders />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );

  const renderMobileLayout = () => (
    <div className="flex flex-col h-screen">
      <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 pb-16">
        {renderContent()}
      </main>
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 flex justify-around items-center py-2",
        theme === "dark" ? "bg-gray-800" : "bg-white",
        "border-t border-gray-200 dark:border-gray-700"
      )}>
        {navItems.map((item) => (
          <Button
            key={item.value}
            variant="ghost"
            size="sm"
            onClick={() => handleTabChange(item.value)}
            className={cn(
              "flex flex-col items-center",
              activeTab === item.value ? "text-blue-500" : "text-gray-500"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className={cn("transition-colors duration-200", 
      theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900")}>
      {isMobile ? renderMobileLayout() : (
        <div className="flex h-screen">
          {renderSidebar()}
          <div className="flex-1 flex flex-col">
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;