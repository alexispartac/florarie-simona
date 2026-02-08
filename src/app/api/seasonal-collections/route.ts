import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { SeasonalCollection } from '@/types/seasonalCollections';
import { withRateLimit } from '@/lib/rateLimit';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'seasonal-collections';

export async function GET(request: NextRequest) {
  return withRateLimit(request, async (req) => {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      
      const url = new URL(req.url);
      const isActive = url.searchParams.get('isActive');
      const sortBy = url.searchParams.get('sortBy') || 'priority';
      
      const query: Record<string, unknown> = {};
      
      if (isActive !== null) {
        query.isActive = isActive === 'true';
      }
      
      let sortOption: Record<string, 1 | -1> = { priority: -1 };
      if (sortBy === 'startDate') sortOption = { startDate: -1 };
      if (sortBy === 'endDate') sortOption = { endDate: -1 };
      if (sortBy === 'newest') sortOption = { createdAt: -1 };
      
      const collections = await db
        .collection(COLLECTION)
        .find(query)
        .sort(sortOption)
        .toArray();

      return NextResponse.json(collections);
    } catch (error) {
      console.error('Error fetching seasonal collections:', error);
      return NextResponse.json(
        { error: 'Failed to fetch seasonal collections' },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async (req) => {
    try {
      const body = await req.json();
      const collection: SeasonalCollection = {
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const client = await clientPromise;
      const db = client.db(DB_NAME);
      
      const result = await db
        .collection(COLLECTION)
        .insertOne(collection);

      if (!result.acknowledged) {
        return NextResponse.json(
          { error: 'Failed to create seasonal collection' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { 
          message: 'Seasonal collection created successfully',
          data: collection 
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating seasonal collection:', error);
      return NextResponse.json(
        { error: 'Failed to create seasonal collection' },
        { status: 500 }
      );
    }
  });
}
