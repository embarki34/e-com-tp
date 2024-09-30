import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Skeleton from 'react-loading-skeleton';
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useTheme } from "@/providers/providers";
import { FileUpload } from 'primereact/fileupload';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { theme } = useTheme();
  const formRef = useRef<HTMLFormElement>(null);
  const [files, setFiles] = useState<File[]>([]);

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
    
    // Store the current selection start and end
    const selectionStart = e.target.selectionStart;
    const selectionEnd = e.target.selectionEnd;

    // Use requestAnimationFrame to ensure the DOM has updated
    requestAnimationFrame(() => {
      const input = formRef.current?.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement;
      if (input) {
        input.focus();
        // Only set the selection range if it's an input element (not a textarea)
        if (input instanceof HTMLInputElement) {
          try {
            input.setSelectionRange(selectionStart, selectionEnd);
          } catch (error) {
            console.error("Error setting selection range:", error);
          }
        }
      }
    });
  };

  const ProductForm = ({ onSubmit, onCancel }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, onCancel: () => void }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
      onDrop, 
      accept: {'image/*': []}, 
      maxFiles: 3 
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData();

      // Append all product data to formData
      Object.entries(currentProduct).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Append files to formData
      files.forEach((file, index) => {
        formData.append(`image${index + 1}`, file);
      });

      onSubmit(e);
    };

    return (
      <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
        <div className="grid grid-cols-2 gap-8">
          {/* Left column for text inputs */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="product_name"
                value={currentProduct.product_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={currentProduct.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock <span className="text-red-500">*</span></Label>
              <Input
                id="stock"
                name="stock_quantity"
                type="number"
                value={currentProduct.stock_quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={currentProduct.description || ""}
                onChange={handleInputChange}
                rows={5}
              />
            </div>
          </div>

          {/* Right column for image uploads */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="images">Product Images</Label>
              <div {...getRootProps()} style={dropzoneStyles}>
                <input {...getInputProps()} />
                {
                  isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
                }
              </div>
              {files.length > 0 && (
                <div>
                  <h4>Selected Files:</h4>
                  <ul>
                    {files.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Product</Button>
        </DialogFooter>
      </form>
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Only append changed fields
    Object.entries(currentProduct).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });

    // Append files to formData only if they exist
    files.forEach((file, index) => {
      formData.append(`image${index + 1}`, file);
    });

    try {
      const url = currentProduct.product_id
        ? `/api/products/${currentProduct.product_id}`
        : "/api/products";
      const method = currentProduct.product_id ? "PUT" : "POST";
      const response = await fetch(url, { 
        method, 
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to save product");
      }
      const result = await response.json();
      console.log("Server response:", result);
      fetchProducts();
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setFiles([]);
      toast.success(`Product ${currentProduct.product_id ? "updated" : "added"} successfully`);
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error("Failed to save product. Please try again.");
    }
  };

  const handleDelete = async (productId: number) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      await fetchProducts(); // Refresh the product list
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading) return <Skeleton count={5} />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Product List</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => setCurrentProduct(initialProductState)}>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className={`sm:max-w-[800px] ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
              <DialogHeader>
                <DialogTitle className={theme === 'dark' ? 'text-white' : 'text-black'}>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm onSubmit={handleSubmit} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Image</TableHead>
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
                  {product.image1_url && (
                    <img 
                      src={`/uploads/${product.image1_url}`} 
                      alt={product.product_name} 
                      className="w-16 h-16 object-cover"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => setCurrentProduct(product)} // Set the current product when editing
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                      </DialogHeader>
                      <ProductForm onSubmit={handleSubmit} onCancel={() => setIsEditDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setProductToDelete(product.product_id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                      </DialogHeader>
                      <p>This action cannot be undone. This will permanently delete the product.</p>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleDelete(productToDelete!)} 
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Products;

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center' as const,
  cursor: 'pointer'
};