// app/api/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';
import { db } from '@/utils/db'; // Adjust the import based on your db setup
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

// Handle POST request for creating a product
export async function POST(request: NextRequest) {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    try {
        const formData = await request.formData();
        console.log("Received form data:");

        const productData: any = {};
        const imageUrls: string[] = [];

        for (let [key, value] of formData.entries()) {
            console.log(key, typeof value, value);
            if (value instanceof File) {
                const buffer = await value.arrayBuffer();
                const filename = Date.now() + '-' + value.name.replace(/\s+/g, '-');
                const filepath = path.join(uploadDir, filename);
                await writeFile(filepath, Buffer.from(buffer));
                imageUrls.push(filename);
            } else {
                productData[key] = value;
            }
        }

        // Add image URLs to productData
        for (let i = 0; i < imageUrls.length; i++) {
            productData[`image${i + 1}_url`] = imageUrls[i];
        }

        // Insert product into database
        const query = `
            INSERT INTO products (product_name, description, price, stock_quantity, image1_url, image2_url, image3_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            productData.product_name,
            productData.description,
            parseFloat(productData.price),
            parseInt(productData.stock_quantity),
            productData.image1_url || null,
            productData.image2_url || null,
            productData.image3_url || null
        ];

        const [result] = await db.execute<ResultSetHeader>(query, values);

        return NextResponse.json({ 
            success: true, 
            message: 'Product created successfully', 
            productId: result.insertId 
        });
    } catch (error) {
        console.error('Error processing product data:', error);
        return NextResponse.json({ success: false, error: 'Failed to process product data' }, { status: 500 });
    }
};

// Handle GET request to retrieve all products
export async function GET() {
    try {
        const query = `
            SELECT product_id, product_name, description, price, stock_quantity,
                   image1_url, image2_url, image3_url
            FROM products
        `;
        const [products] = await db.execute<Product[]>(query);

        // Return products without modifying the image URLs
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
};
