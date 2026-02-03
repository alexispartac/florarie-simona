import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Order, OrderStatus } from '@/types/orders';
import { withRateLimit } from '@/lib/rateLimit';

interface OrderQuery {
  status?: OrderStatus;
  userId?: string;
  [key: string]: unknown;
}

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'orders';

// Helper function to generate tracking number
function generateTrackingNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 4 === 0 && i < 11) result += '-';
  }
  return result;
}

// Update the GET handler in /src/app/api/orders/route.ts
export async function GET(request: NextRequest) {
  return withRateLimit(request, async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as OrderStatus | 'all' | null;

    // Input validation
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: 'Invalid limit parameter' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    // Build the query
    const query: OrderQuery = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get total count for pagination
    const total = await collection.countDocuments(query);

    // Fetch orders with pagination and sorting (newest first)
    const orders = await collection
      .find(query)
      .sort({ date: -1 }) // Sort by date descending (newest first)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      data: orders,
      pagination: {
        total,
        limit,
        page: 1, // You can implement page-based pagination if needed
        hasMore: total > limit,
      },
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
  });
}

export async function POST(request: NextRequest) {
  // Strict rate limit for order creation: 3 requests per minute
  return withRateLimit(request, async (req) => {
  try {
    const orderData: Order = await req.json();
    
    // Basic validation
    if (!orderData.items?.length) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!orderData.shipping || !orderData.payment) {
      return NextResponse.json(
        { success: false, error: 'Shipping and payment information are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Create the order object without orderId first
    const newOrder = {
      ...orderData,
      trackingNumber: generateTrackingNumber(),
      date: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the order
    await db.collection<Omit<Order, 'orderId'>>(COLLECTION).insertOne(newOrder);
    
    return NextResponse.json(
      { 
        success: true, 
        data: newOrder,
        message: 'Order created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
  }, { limit: 3, windowMs: 60000 }); // 3 requests per minute
}