import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { FaDollarSign, FaBox, FaShoppingCart, FaStar } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  stock_quantity: number;
}

interface Order {
  order_id: number;
  product_id: number;
  customer_email: string;
  customer_name: string;
  quantity: number;
  total_price: string;
  order_date: string;
  payment_method: string;
  state: string;
  district: string;
  phone_number: string;
  status: string;
}

const Stats = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, ordersResponse] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders')
        ]);
        const productsData = await productsResponse.json();
        const ordersData = await ordersResponse.json();
        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading stats...</div>;
  }

  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const salesData = {
    labels: ['Total Revenue', 'Average Order Value'],
    datasets: [
      {
        label: 'Sales',
        data: [totalRevenue, averageOrderValue],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
      },
    ],
  };

  const orderStatusData = {
    labels: ['Pending', 'Calling for Confirmation', 'Confirmed', 'Packing', 'Out for Delivery', 'Delivered'],
    datasets: [
      {
        data: [
          orders.filter(order => order.status === 'Pending').length,
          orders.filter(order => order.status === 'Calling for Confirmation').length,
          orders.filter(order => order.status === 'Confirmed').length,
          orders.filter(order => order.status === 'Packing').length,
          orders.filter(order => order.status === 'Out for Delivery').length,
          orders.filter(order => order.status === 'Delivered (Waiting for DC to Call You)').length,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const revenueData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Daily Revenue',
        data: last7Days.map(date => 
          orders
            .filter(order => order.order_date.startsWith(date))
            .reduce((sum, order) => sum + parseFloat(order.total_price), 0)
        ),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const topSellingProducts = products
    .sort((a, b) => b.stock_quantity - a.stock_quantity)
    .slice(0, 5);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaDollarSign className="mr-2 text-green-500" />
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">{totalRevenue.toFixed(2)} DA</div>
          <div className="h-64">
            <Bar data={salesData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaShoppingCart className="mr-2 text-blue-500" />
            Order Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Pie data={orderStatusData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaDollarSign className="mr-2 text-purple-500" />
            Revenue Trend (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaBox className="mr-2 text-orange-500" />
            Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {topSellingProducts.map(product => (
              <li key={product.product_id}>{product.product_name} - {product.stock_quantity} units</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaStar className="mr-2 text-yellow-500" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Products:</span>
              <span className="font-bold">{totalProducts}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Orders:</span>
              <span className="font-bold">{totalOrders}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Order Value:</span>
              <span className="font-bold">{averageOrderValue.toFixed(2)} DA</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaBox className="mr-2 text-red-500" />
            Inventory Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <span>In Stock:</span>
            <span className="font-bold">{products.filter(p => p.stock_quantity > 10).length} items</span>
          </div>
          <div className="flex justify-between">
            <span>Low Stock:</span>
            <span className="font-bold text-yellow-500">{products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length} items</span>
          </div>
          <div className="flex justify-between">
            <span>Out of Stock:</span>
            <span className="font-bold text-red-500">{products.filter(p => p.stock_quantity === 0).length} items</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;