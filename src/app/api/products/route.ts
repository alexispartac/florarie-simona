import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Product } from '@/types/products';
import { withRateLimit } from '@/lib/rateLimit';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'products';

export async function GET(request: NextRequest) {
  return withRateLimit(request, async (req) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const products = await db
      .collection(COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
  });
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async (req) => {
  try {
    const product: Product = await req.json();
    
    if (!product.name || !product.price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const result = await db.collection(COLLECTION).insertOne({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      _id: result.insertedId,
      ...product,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
  });
}