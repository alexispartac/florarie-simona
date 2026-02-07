import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { withRateLimit } from '@/lib/rateLimit';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'extras';

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);

      // Get all unique categories
      const categories = await db
        .collection(COLLECTION)
        .distinct('category');

      return NextResponse.json(categories);
    } catch (error) {
      console.error('Error fetching extra categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }
  });
}
