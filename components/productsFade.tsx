"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";

interface Product {
  product_id: number;
  product_name: string;
  description: string;
  price: string;
  stock_quantity: number;
  image1_url: string;
}

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative flex flex-col items-start w-64 cursor-pointer overflow-hidden rounded-2xl border p-4",
        // Light mode styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // Dark mode styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <img
        className="w-full h-32 object-cover rounded-lg mb-2"
        alt=""
        src={`/uploads/${img}`}
      />
      <div className="flex flex-col">
        <figcaption className="text-sm font-medium dark:text-white">
          {name}
        </figcaption>
        <p className="text-xs font-medium dark:text-white/40">{username}</p>
      </div>
      <blockquote className="mt-2 text-sm dark:text-white/60">{body}</blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  const [products, setProducts] = useState<Product[]>([]);
  const firstRow: Product[] = [];
  const secondRow: Product[] = [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products", {
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
      }
    };

    fetchProducts();
  }, []);

  // Split products into two rows for the marquee
  if (products.length > 0) {
    const half = Math.ceil(products.length / 2);
    firstRow.push(...products.slice(0, half));
    secondRow.push(...products.slice(half));
  }

  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background dark:bg-gray-800/50">
      <div>
        <h1 className="text-center text-4xl font-bold my-4 text-black dark:text-white">
          Our Products
        </h1>
      </div>

      <Marquee pauseOnHover className="[--duration:60s]">
        {firstRow.map((product) => (
          <ReviewCard
            key={product.product_id}
            img={product.image1_url}
            name={product.product_name}
            username={`${product.price} DA`}
            body={product.description}
          />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:60s]">
        {secondRow.map((product) => (
          <ReviewCard
            key={product.product_id}
            img={product.image1_url}
            name={product.product_name}
            username={`$${product.price} DA`}
            body={product.description}
          />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-gray-800"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-gray-800"></div>
    </div>
  );
}
