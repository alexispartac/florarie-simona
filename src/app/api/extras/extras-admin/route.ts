import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { withRateLimit } from '@/lib/rateLimit';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'extras';

export async function GET(request: NextRequest) {
  return withRateLimit(request, async (req) => {
    try {
      const searchParams = req.nextUrl.searchParams;
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const search = searchParams.get('search') || '';

      const client = await clientPromise;
      const db = client.db(DB_NAME);

      // Build search filter
      const filter: Record<string, unknown> = {};
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ];
      }

      // Get total count for pagination
      const total = await db.collection(COLLECTION).countDocuments(filter);

      // Calculate pagination
      const skip = (page - 1) * limit;
      const totalPages = Math.ceil(total / limit);

      // Get extras
      const extras = await db
        .collection(COLLECTION)
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      return NextResponse.json({
        data: extras,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasMore: page < totalPages,
        },
      });
    } catch (error) {
      console.error('Error fetching extras (admin):', error);
      return NextResponse.json(
        { error: 'Failed to fetch extras' },
        { status: 500 }
      );
    }
  });
}
