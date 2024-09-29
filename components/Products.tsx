import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import Skeleton from 'react-loading-skeleton';
import ConfirmDialog from "@/components/ConfirmDialog"; // A new confirm dialog component
import { Toaster } from "./ui/toaster";

interface Product {
  product_id: number;
  product_name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  image1_url: string | null;
  image2_url: string | null;
  image3_url: string | null;
}

const initialProductState: Product = {
  product_id: 0,
  product_name: "",
  description: "",
  price: 0,
  stock_quantity: 0,
  image1_url: null,
  image2_url: null,
  image3_url: null,
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] =
    useState<Product>(initialProductState);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError("Error fetching products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setCurrentProduct((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(currentProduct).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value);
      }
    });

    try {
      const url = currentProduct.product_id
        ? `/api/products/${currentProduct.product_id}`
        : "/api/products";
      const method = currentProduct.product_id ? "PUT" : "POST";
      const response = await fetch(url, { method, body: formData });
      if (!response.ok) {
        throw new Error("Failed to save product");
      }
      fetchProducts();
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setToastMessage(
        `Product ${
          currentProduct.product_id ? "updated" : "added"
        } successfully!`
      );
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Failed to save product. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (productToDelete === null) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${productToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsConfirmDialogOpen(false); // Close the confirm dialog
    }
  };

  const ProductForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="product_name"
            value={currentProduct.product_name}
            onChange={handleInputChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={currentProduct.description || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={currentProduct.price}
            onChange={handleInputChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="stock" className="text-right">
            Stock <span className="text-red-500">*</span>
          </Label>
          <Input
            id="stock"
            name="stock_quantity"
            type="number"
            value={currentProduct.stock_quantity}
            onChange={handleInputChange}
            className="col-span-3"
            required
          />
        </div>
        {["image1", "image2", "image3"].map((img, index) => (
          <div className="grid grid-cols-4 items-center gap-4" key={img}>
            <Label htmlFor={img} className="text-right">
              Image {index + 1}
            </Label>
            <Input
              id={img}
              name={img}
              type="file"
              onChange={handleFileChange}
              className="col-span-3"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="submit">Save Product</Button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="text-center">
        <Skeleton count={5} /> {/* Display skeleton for 5 loading items */}
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Products
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setCurrentProduct(initialProductState)}>
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell>{product.product_id}</TableCell>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock_quantity}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setCurrentProduct(product);
                      setIsEditDialogOpen(true);
                    }}
                    style={{ marginRight: "8px" }} // Adjust the value as needed
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => {
                      setProductToDelete(product.product_id);
                      setIsConfirmDialogOpen(true);
                    }}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete product ID ${productToDelete}?`}
        isLoading={isDeleting}
      />
    </Card>
  );
};

export default Products;
