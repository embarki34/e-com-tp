import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/db';
import formidable from 'formidable';
import path from 'path';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { IncomingMessage } from 'http';

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

export const config = {
    api: {
        bodyParser: false,
    },
};

// Export the getImageUrl function
export const getImageUrl = (file: formidable.File | formidable.File[] | undefined): string | null => {
    if (Array.isArray(file)) {
        return file[0] ? `/uploads/${path.basename(file[0].filepath)}` : null;
    }
    return file ? `/uploads/${path.basename(file.filepath)}` : null;
};

export async function POST(req: NextRequest) {
    try {
        const form = new formidable.IncomingForm({
            uploadDir: path.join(process.cwd(), 'public', 'uploads'),
            keepExtensions: true,
            multiples: true,
        });

        // Convert Next.js Request into Node.js IncomingMessage
        const nodeRequest = req as unknown as IncomingMessage;

        const { fields, files }: { fields: formidable.Fields; files: formidable.Files } = await new Promise((resolve, reject) => {
            form.parse(nodeRequest, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        const name = fields.name?.[0] ?? '';
        const description = fields.description?.[0] ?? null;
        const price = parseFloat(fields.price?.[0] ?? '0');
        const stock_quantity = parseInt(fields.stock_quantity?.[0] ?? '0', 10);

        if (!name || isNaN(price) || isNaN(stock_quantity)) {
            return NextResponse.json({ error: 'Name, price, and stock quantity are required fields.' }, { status: 400 });
        }

        const image1_url = getImageUrl(files.image1);
        const image2_url = getImageUrl(files.image2);
        const image3_url = getImageUrl(files.image3);

        const query = `
            INSERT INTO products (product_name, description, price, stock_quantity, image1_url, image2_url, image3_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [name, description, price, stock_quantity, image1_url, image2_url, image3_url];

        const [result] = await db.execute<ResultSetHeader>(query, values);

        return NextResponse.json({ message: 'Product created successfully', insertId: result.insertId });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

// Get all products with updated image URLs
export async function GET() {
    try {
        const query = `
            SELECT product_id, product_name, description, price, stock_quantity,
                   image1_url, image2_url, image3_url
            FROM products
        `;
        const [products] = await db.execute<Product[]>(query);

        const updatedProducts = products.map((product) => ({
            ...product,
            image1_url: product.image1_url || null,
            image2_url: product.image2_url || null,
            image3_url: product.image3_url || null,
        }));

        return NextResponse.json(updatedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
