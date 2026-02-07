import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Extra } from '@/types/extras';
import { withRateLimit } from '@/lib/rateLimit';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'extras';

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      
      const extras = await db
        .collection(COLLECTION)
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return NextResponse.json(extras);
    } catch (error) {
      console.error('Error fetching extras:', error);
      return NextResponse.json(
        { error: 'Failed to fetch extras' },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async (req) => {
    try {
      const extra: Extra = await req.json();
      
      if (!extra.name || !extra.price) {
        return NextResponse.json(
          { error: 'Name and price are required' },
          { status: 400 }
        );
      }

      const client = await clientPromise;
      const db = client.db(DB_NAME);
      
      const result = await db.collection(COLLECTION).insertOne({
        ...extra,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return NextResponse.json({
        _id: result.insertedId,
        ...extra,
      }, { status: 201 });
    } catch (error) {
      console.error('Error creating extra:', error);
      return NextResponse.json(
        { error: 'Failed to create extra' },
        { status: 500 }
      );
    }
  });
}
