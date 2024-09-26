'use client';

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface Product {
  product_id: number;
  product_name: string;
  description: string;
  price: string; // Keeping this as string to match your API
  stock_quantity: number;
  image1_url: string; // Assuming this is the filename
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Search input */}
      <div className="flex justify-center my-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update the search query
          className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {loading ? (
          // Loading spinner
          <div className="flex items-center justify-center w-full col-span-full">
            <div className="flex items-center justify-center w-56 h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <div role="status">
                {/* Spinner code */}
              </div>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card
              key={product.product_id}
              className="shadow-lg transition-transform transform hover:scale-105"
            >
              <CardHeader>
                <CardTitle className="font-semibold">
                  {product.product_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={`http://localhost:3000/uploads/${product.image1_url}`}
                  alt={product.product_name}
                  className="mb-2 w-full h-40 object-cover rounded"
                />
                <CardDescription className="mb-1">
                  {product.description}
                </CardDescription>
                <p className="text-lg font-bold">
                  {parseFloat(product.price).toFixed(2)} DA
                </p>
              </CardContent>
              <CardFooter className="flex justify-between space-x-2">
                <button className="flex items-center justify-center bg-blue-500 text-white text-sm px-4 py-2 rounded-md shadow-sd hover:bg-blue-600 transition transform hover:scale-105">
                  <InfoIcon className="mr-1 text-base" />
                  Show
                </button>
                <button className="flex items-center justify-center bg-green-500 text-white text-sm px-4 py-2 rounded-md shadow-sd hover:bg-green-600 transition transform hover:scale-105">
                  <ShoppingCartIcon className="mr-1 text-base" />
                  Order
                </button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full">No products found.</p>
        )}
      </main>
    </div>
  );
};

export default ProductList;
