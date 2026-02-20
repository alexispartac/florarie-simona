import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'pending_orders';

// Store pending order data before payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { tempTrackingNumber, orderData } = body;
    
    if (!tempTrackingNumber || !orderData) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Store pending order data with 1 hour expiration
    await db.collection(COLLECTION).insertOne({
      tempTrackingNumber,
      orderData,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    });

    // Create TTL index if it doesn't exist
    await db.collection(COLLECTION).createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing pending order:', error);
    return NextResponse.json(
      { error: 'Failed to store pending order data' },
      { status: 500 }
    );
  }
}

// Retrieve pending order data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tempTrackingNumber = searchParams.get('tempTrackingNumber');

    if (!tempTrackingNumber) {
      return NextResponse.json(
        { error: 'Missing tracking number' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const pendingOrder = await db.collection(COLLECTION).findOne({
      tempTrackingNumber,
    });

    if (!pendingOrder) {
      return NextResponse.json(
        { error: 'Pending order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ orderData: pendingOrder.orderData });
  } catch (error) {
    console.error('Error retrieving pending order:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve pending order data' },
      { status: 500 }
    );
  }
}

// Delete pending order data after processing
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tempTrackingNumber = searchParams.get('tempTrackingNumber');

    if (!tempTrackingNumber) {
      return NextResponse.json(
        { error: 'Missing tracking number' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection(COLLECTION).deleteOne({
      tempTrackingNumber,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pending order:', error);
    return NextResponse.json(
      { error: 'Failed to delete pending order data' },
      { status: 500 }
      );
  }
}
