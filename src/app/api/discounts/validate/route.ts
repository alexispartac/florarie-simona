import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { DiscountValidationResponse } from '@/types/discounts';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'discounts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json<DiscountValidationResponse>(
        {
          valid: false,
          error: 'Discount code is required',
        },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Find discount code (case-insensitive)
    const discount = await db.collection(COLLECTION).findOne({
      code: code.toUpperCase(),
    });

    if (!discount) {
      return NextResponse.json<DiscountValidationResponse>({
        valid: false,
        error: 'Invalid discount code',
      });
    }

    // Check if discount is active
    if (!discount.isActive) {
      return NextResponse.json<DiscountValidationResponse>({
        valid: false,
        error: 'This discount code is no longer active',
      });
    }

    // Check if discount is expired
    const now = new Date();
    const expiresAt = new Date(discount.expiresAt);
    
    if (expiresAt < now) {
      return NextResponse.json<DiscountValidationResponse>({
        valid: false,
        error: 'This discount code has expired',
      });
    }

    // Valid discount - increment usage count
    await db.collection(COLLECTION).updateOne(
      { _id: discount._id },
      { 
        $inc: { usageCount: 1 },
        $set: { updatedAt: new Date() }
      }
    );

    // Return valid discount
    return NextResponse.json<DiscountValidationResponse>({
      valid: true,
      discount: {
        code: discount.code,
        amount: discount.amount,
      },
    });

  } catch (error) {
    console.error('Error validating discount:', error);
    return NextResponse.json<DiscountValidationResponse>(
      {
        valid: false,
        error: 'Failed to validate discount code',
      },
      { status: 500 }
    );
  }
}
