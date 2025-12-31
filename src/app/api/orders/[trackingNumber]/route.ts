import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'WearYouTheBest';
const COLLECTION = 'orders';

export async function GET(
  request: Request,
) {
  try {
    const url = new URL(request.url);
    const trackingNumber = url.pathname.split('/').pop();

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    console.log('Looking up order with tracking number:', trackingNumber);

    try {
        const order = await db
        .collection(COLLECTION)
        .findOne({ trackingNumber: trackingNumber });
        
        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 201 }
            );
        }

        return NextResponse.json({ message: 'Order found', order, success: true }, { status: 200});
    } catch (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
            { error: 'Failed to fetch order' },
            { status: 300 }
        );
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// Add this to /src/app/api/orders/[trackingNumber]/route.ts
export async function PATCH(
  request: Request,
) {
  try {
    const url = new URL(request.url);
    const trackingNumber = url.pathname.split('/').pop();
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const urlSearchParams = new URLSearchParams(url.search);
    const scope = urlSearchParams.get('scope') || 'payment-status' || 'status';

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updateField = scope === 'payment-status' ? 'payment.status' : 'status';

    const result = await db.collection(COLLECTION).updateOne(
      { trackingNumber },
      { 
        $set: { 
          [updateField]: status,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Order status updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}