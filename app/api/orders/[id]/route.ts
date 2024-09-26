import { NextResponse } from 'next/server';
import { db } from '@/utils/db'; // Adjust the path if necessary
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise'; // Import types for results

// GET /api/orders/[id] - Fetch a specific order by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const orderId = parseInt(params.id);

    try {
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM Orders WHERE order_id = ?', [orderId]);

        if (rows.length === 0) {
            return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        const message = (error as Error).message;
        return NextResponse.json({ message: 'Error fetching order', error: message }, { status: 500 });
    }
}

// DELETE /api/orders/[id] - Delete a specific order by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const orderId = parseInt(params.id);

    try {
        const [result] = await db.query<ResultSetHeader>('DELETE FROM Orders WHERE order_id = ?', [orderId]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Order deleted successfully.' }, { status: 200 });
    } catch (error) {
        const message = (error as Error).message;
        return NextResponse.json({ message: 'Error deleting order', error: message }, { status: 500 });
    }
}

// PUT /api/orders/[id] - Update the status of a specific order by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const orderId = parseInt(params.id);
    const { status } = await request.json();

    // Validate request data
    if (!status) {
        return NextResponse.json({ message: 'Status is required.' }, { status: 400 });
    }

    try {
        const [result] = await db.query<ResultSetHeader>(
            'UPDATE Orders SET status = ? WHERE order_id = ?',
            [status, orderId]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Order status updated successfully.' }, { status: 200 });
    } catch (error) {
        const message = (error as Error).message;
        return NextResponse.json({ message: 'Error updating order status', error: message }, { status: 500 });
    }
}
