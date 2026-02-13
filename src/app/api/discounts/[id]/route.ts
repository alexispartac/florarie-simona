import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Discount } from '@/types/discounts';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'discounts';

// GET - Get single discount by ID
export async function GET(
  request: NextRequest,
) {
  try {
    const url = new URL(request.url);
    const discountId = url.pathname.split('/').pop();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const discount = await db.collection(COLLECTION).findOne({
      discountId: discountId,
    });

    if (!discount) {
      return NextResponse.json(
        { error: 'Discount not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ discount });
  } catch (error) {
    console.error('Error fetching discount:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discount' },
      { status: 500 }
    );
  }
}

// PUT - Update discount
export async function PUT(
  request: NextRequest,
) {
  try {
    const url = new URL(request.url);
    const discountId = url.pathname.split('/').pop();
    const body = await request.json();
    const { code, amount, expiresAt, isActive } = body;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Check if discount exists
    const existingDiscount = await db.collection(COLLECTION).findOne({
      discountId: discountId,
    });

    if (!existingDiscount) {
      return NextResponse.json(
        { error: 'Discount not found' },
        { status: 404 }
      );
    }

    // Prepare update object
    const updateData: Partial<Discount> = {
      updatedAt: new Date(),
    };

    if (code !== undefined) {
      // Check if new code already exists (but not for this discount)
      const codeExists = await db.collection(COLLECTION).findOne({
        code: code.toUpperCase(),
        discountId: { $ne: discountId },
      });

      if (codeExists) {
        return NextResponse.json(
          { error: 'Discount code already exists' },
          { status: 409 }
        );
      }

      updateData.code = code.toUpperCase().trim();
    }

    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount <= 0) {
        return NextResponse.json(
          { error: 'Valid discount amount is required' },
          { status: 400 }
        );
      }
      updateData.amount = Math.round(amount);
    }

    if (expiresAt !== undefined) {
      updateData.expiresAt = new Date(expiresAt);
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    // Update discount
    const result = await db.collection(COLLECTION).updateOne(
      { discountId: discountId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Discount not found' },
        { status: 404 }
      );
    }

    // Fetch updated discount
    const updatedDiscount = await db.collection(COLLECTION).findOne({
      discountId: discountId,
    });

    return NextResponse.json({
      message: 'Discount updated successfully',
      discount: updatedDiscount,
    });
  } catch (error) {
    console.error('Error updating discount:', error);
    return NextResponse.json(
      { error: 'Failed to update discount' },
      { status: 500 }
    );
  }
}

// DELETE - Delete discount
export async function DELETE(
  request: NextRequest,
) {
  const url = new URL(request.url);
  const discountId = url.pathname.split('/').pop();
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection(COLLECTION).deleteOne({
      discountId: discountId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Discount not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Discount deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting discount:', error);
    return NextResponse.json(
      { error: 'Failed to delete discount' },
      { status: 500 }
    );
  }
}
