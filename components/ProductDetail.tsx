"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface Product {
  product_id: number;
  product_name: string;
  description: string;
  price: string;
  stock_quantity: number;
  image1_url: string;
}

const ProductDetail = ({ productId }: { productId: string | undefined }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[500px] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-red-600">Error Loading Product</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-xl font-semibold">Product Not Found</h3>
          <p className="text-gray-600">The requested product could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Card className="border-none shadow-none">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-0">
          <div className="relative h-[500px] w-[500px] rounded-xl overflow-hidden">
            <Image
              src={`/uploads/${product.image1_url}`}
              alt={product.product_name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{product.product_name}</h1>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-3xl font-bold">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                <Badge variant="secondary" className="px-3 py-1">
                  {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Stock Quantity:</span>
                <span className="text-sm">{product.stock_quantity} units</span>
              </div>

              <div className="flex gap-4">
                <Link href={`/order/${product.product_id}`} className="flex-1">
                  <Button className="w-full" size="lg">
                    <ShoppingCartIcon className="mr-2 h-5 w-5" />
                    Order Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;
