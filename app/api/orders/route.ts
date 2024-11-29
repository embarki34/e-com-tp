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

    // Validate request data
    if (!product_id || !customer_email || !customer_name || typeof quantity !== 'number' || !total_price || !payment_method || !phone_number || !state || !district) {
        return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    try {
        // Use ResultSetHeader for the result type
        const [result] = await db.query<ResultSetHeader>(
            'INSERT INTO Orders (product_id, customer_email, customer_name, quantity, total_price, payment_method, phone_number, state, district, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [product_id, customer_email, customer_name, quantity, total_price, payment_method, phone_number, state, district, status || 'Pending']
        );

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
