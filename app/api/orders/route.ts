import { NextResponse } from 'next/server';
import { db } from '@/utils/db'; // Import your database connection
import { ResultSetHeader } from 'mysql2/promise'; // Import the ResultSetHeader type

// GET /api/orders - Fetch all orders
export async function GET() {
    try {
        const [rows] = await db.query('SELECT * FROM Orders');
        return NextResponse.json(rows);
    } catch (error) {
        // Type assertion for error
        const message = (error as Error).message;
        return NextResponse.json({ message: 'Error fetching orders', error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { product_id, customer_email, customer_name, quantity, total_price, payment_method, phone_number, state, district, status } = await request.json();

    // Add logging to debug the incoming data
    console.log('Received order data:', { 
        product_id, 
        customer_email, 
        customer_name, 
        quantity, 
        total_price 
    });

    // Validate request data with more specific checks
    if (!product_id || isNaN(Number(product_id))) {
        return NextResponse.json({ message: 'Invalid product_id' }, { status: 400 });
    }
    
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
        return NextResponse.json({ message: 'Invalid quantity' }, { status: 400 });
    }

    // Check if product exists and has stock
    const [qteCheck] = await db.query('SELECT stock_quantity FROM Products WHERE product_id = ?', [product_id]);
    
    // Log the query result
    console.log('Stock check result:', qteCheck);

    // Check if product exists
    if (!qteCheck || !Array.isArray(qteCheck) || qteCheck.length === 0) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const stockQuantity = (qteCheck[0] as { stock_quantity: number }).stock_quantity;
    
    if (stockQuantity < quantity) {
        return NextResponse.json({ 
            message: 'Insufficient stock quantity',
            available: stockQuantity,
            requested: quantity 
        }, { status: 400 });
    }

    try {
        // Use ResultSetHeader for the result type
        const [result] = await db.query<ResultSetHeader>(
            'INSERT INTO Orders (product_id, customer_email, customer_name, quantity, total_price, payment_method, phone_number, state, district, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [product_id, customer_email, customer_name, quantity, total_price, payment_method, phone_number, state, district, status || 'Pending']
        );
        const reduceProductQuantity = await db.query('UPDATE Products SET stock_quantity = stock_quantity - ? WHERE product_id = ?', [quantity, product_id]);
        console.log(reduceProductQuantity);
        

        // Access insertId safely
        return NextResponse.json({
            order_id: result.insertId,
            product_id,
            customer_email,
            customer_name,
            quantity,
            total_price,
            payment_method,
            phone_number,
            state,
            district,
            status
        }, { status: 201 });
    } catch (error) {
        // Type assertion for error
        const message = (error as Error).message;
        console.error('Error creating order:', message);
        return NextResponse.json({ message: 'Error creating order', error: message }, { status: 500 });
    }
}
