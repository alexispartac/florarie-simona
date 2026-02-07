import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { withRateLimit } from '@/lib/rateLimit';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'extras';

export async function GET(request: NextRequest) {
  return withRateLimit(request, async (req) => {
    try {
      const searchParams = req.nextUrl.searchParams;
      const limit = parseInt(searchParams.get('limit') || '12');
      const offset = parseInt(searchParams.get('offset') || '0');
      const categories = searchParams.get('categories')?.split(',').filter(Boolean);
      const sortBy = searchParams.get('sortBy') || 'featured';

      const client = await clientPromise;
      const db = client.db(DB_NAME);

      // Build filter
      const filter: Record<string, unknown> = { available: true };

      if (categories && categories.length > 0) {
        filter.category = { $in: categories };
      }

      // Build sort
      let sort: Record<string, 1 | -1> = {};
      switch (sortBy) {
        case 'price-asc':
          sort = { price: 1 };
          break;
        case 'price-desc':
          sort = { price: -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'rating':
          sort = { rating: -1 };
          break;
        default: // featured
          sort = { isFeatured: -1, createdAt: -1 };
      }

      // Get total count for pagination
      const total = await db.collection(COLLECTION).countDocuments(filter);

      // Get extras with filters
      const extras = await db
        .collection(COLLECTION)
        .find(filter)
        .sort(sort)
        .skip(offset)
        .limit(limit)
        .toArray();

      return NextResponse.json({
        extras,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error) {
      console.error('Error fetching extras catalog:', error);
      return NextResponse.json(
        { error: 'Failed to fetch extras catalog' },
        { status: 500 }
      );
    }
  });
}
