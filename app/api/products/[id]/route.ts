import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/db';
import formidable from 'formidable';
import path from 'path';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { IncomingMessage } from 'http';
import { getImageUrl } from '../route'; // Adjust the path as needed

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

    const form = new formidable.IncomingForm({
        uploadDir: path.join(process.cwd(), 'public', 'uploads'),
        keepExtensions: true,
        multiples: true,
    });

    try {
        const nodeRequest = req as unknown as IncomingMessage;

        const { fields, files }: { fields: formidable.Fields; files: formidable.Files } = await new Promise((resolve, reject) => {
            form.parse(nodeRequest, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        const product_name = fields.product_name?.[0];
        const description = fields.description?.[0];
        const price = fields.price?.[0];
        const stock_quantity = fields.stock_quantity?.[0];

        const image1_url = getImageUrl(files.image1);
        const image2_url = getImageUrl(files.image2);
        const image3_url = getImageUrl(files.image3);

        const query = `
            UPDATE products 
            SET product_name = ?, description = ?, price = ?, stock_quantity = ?, 
                image1_url = ?, image2_url = ?, image3_url = ? 
            WHERE product_id = ?
        `;
        const values = [
            product_name || null,
            description || null,
            price || null,
            stock_quantity || null,
            image1_url,
            image2_url,
            image3_url,
            productId
        ];

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
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
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