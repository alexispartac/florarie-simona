import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'products';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Get all distinct categories from products
    const categories = await db
      .collection(COLLECTION)
      .distinct('category');

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
