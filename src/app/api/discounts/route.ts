import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { DiscountListResponse, Discount } from '@/types/discounts';
import { v4 as uuidv4 } from 'uuid';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'discounts';

// GET - List all discounts
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Get discounts with pagination
    const discounts = await db
      .collection(COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection(COLLECTION).countDocuments({});

    return NextResponse.json<DiscountListResponse>({
      discounts: discounts as unknown as Discount[],
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discounts' },
      { status: 500 }
    );
  }
}

// POST - Create new discount
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, amount, expiresAt, isActive = true } = body;

    // Validation
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Discount code is required' },
        { status: 400 }
      );
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid discount amount is required' },
        { status: 400 }
      );
    }

    if (!expiresAt) {
      return NextResponse.json(
        { error: 'Expiration date is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Check if code already exists
    const existingDiscount = await db.collection(COLLECTION).findOne({
      code: code.toUpperCase(),
    });

    if (existingDiscount) {
      return NextResponse.json(
        { error: 'Discount code already exists' },
        { status: 409 }
      );
    }

    // Create new discount
    const newDiscount: Discount = {
      discountId: uuidv4(),
      code: code.toUpperCase().trim(),
      amount: Math.round(amount), // Ensure it's an integer (cents)
      expiresAt: new Date(expiresAt),
      isActive: Boolean(isActive),
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
    };

    await db.collection(COLLECTION).insertOne(newDiscount);

    return NextResponse.json(
      { 
        message: 'Discount created successfully',
        discount: newDiscount 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating discount:', error);
    return NextResponse.json(
      { error: 'Failed to create discount' },
      { status: 500 }
    );
  }
}
