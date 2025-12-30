import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Product } from '@/types/products';

const DB_NAME = 'WearYouTheBest';
const COLLECTION = 'products';

export async function GET(
  request: Request,
) {
  try {
    const url = new URL(request.url);
    const productId = url.pathname.split('/').pop();

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const product = await db
      .collection(COLLECTION)
      .findOne({ productId: productId });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
) {
  try {
    const url = new URL(request.url);
    const productId = url.pathname.split('/').pop();
    const updates: Partial<Product> = await request.json();

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection(COLLECTION).updateOne(
      { productId: productId },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
) {
  try {
    const url = new URL(request.url);
    const productId = url.pathname.split('/').pop();

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const result = await db
      .collection(COLLECTION)
      .deleteOne({ productId: productId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
