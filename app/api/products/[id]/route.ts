import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/db';
import path from 'path';
import { writeFile } from 'fs/promises';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import fs from 'fs';

// Define the Product interface
interface Product extends RowDataPacket {
    product_id: number;
    product_name: string;
    description: string | null;
    price: number;
    stock_quantity: number;
    image1_url: string | null;
    image2_url: string | null;
    image3_url: string | null;
}

// Get a product by ID
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const productId = params.id;

    try {
        const query = `SELECT * FROM products WHERE product_id = ?`;
        const [products] = await db.execute<Product[]>(query, [productId]);

        if (products.length === 0) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(products[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

// Update a product by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const productId = params.id;
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    try {
        const formData = await req.formData();

        const updates: string[] = [];
        const values: any[] = [];

        // Process text fields
        ['product_name', 'description', 'price', 'stock_quantity'].forEach(field => {
            const value = formData.get(field);
            if (value !== null && value !== undefined && value !== '') {
                updates.push(`${field} = ?`);
                values.push(field === 'price' ? parseFloat(value as string) : 
                            field === 'stock_quantity' ? parseInt(value as string, 10) : 
                            value);
            }
        });

        // Process image uploads
        for (let i = 1; i <= 3; i++) {
            const file = formData.get(`image${i}`) as File | null;
            if (file instanceof File) {
                const buffer = await file.arrayBuffer();
                const filename = Date.now() + '-' + file.name.replace(/\s+/g, '-');
                const filepath = path.join(uploadDir, filename);
                await writeFile(filepath, Buffer.from(buffer));
                updates.push(`image${i}_url = ?`);
                values.push(filename);
            }
        }

        // If no fields were provided for update, return early
        if (updates.length === 0) {
            return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
        }

        // Construct the final SQL query
        const query = `
            UPDATE products 
            SET ${updates.join(', ')} 
            WHERE product_id = ?
        `;
        values.push(productId);

        const [result] = await db.execute<ResultSetHeader>(query, values);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

// Delete a product by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const productId = params.id;

    try {
        const query = `DELETE FROM products WHERE product_id = ?`;
        const [result] = await db.execute<ResultSetHeader>(query, [productId]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
