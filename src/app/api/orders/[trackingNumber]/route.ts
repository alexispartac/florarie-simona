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