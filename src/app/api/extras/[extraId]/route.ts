import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { withRateLimit } from '@/lib/rateLimit';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'extras';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ extraId: string }> }
) {
  const { extraId } = await params;
  
  return withRateLimit(request, async () => {
    try {
      if (!extraId) {
        return NextResponse.json(
          { error: 'Extra ID is required' },
          { status: 400 }
        );
      }

      const client = await clientPromise;
      const db = client.db(DB_NAME);
      
      const extra = await db
        .collection(COLLECTION)
        .findOne({ extraId });

      if (!extra) {
        return NextResponse.json(
          { error: 'Extra not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(extra);
    } catch (error) {
      console.error('Error fetching extra:', error);
      return NextResponse.json(
        { error: 'Failed to fetch extra' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ extraId: string }> }
) {
  const { extraId } = await params;
  
  return withRateLimit(request, async (req) => {
    try {
      const updates = await req.json();

      if (!extraId) {
        return NextResponse.json(
          { error: 'Extra ID is required' },
          { status: 400 }
        );
      }

      const client = await clientPromise;
      const db = client.db(DB_NAME);
      
      const result = await db
        .collection(COLLECTION)
        .updateOne(
          { extraId },
          { 
            $set: {
              ...updates,
              updatedAt: new Date(),
            }
          }
        );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Extra not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error updating extra:', error);
      return NextResponse.json(
        { error: 'Failed to update extra' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ extraId: string }> }
) {
  const { extraId } = await params;
  
  return withRateLimit(request, async (req) => {
    try {
      if (!extraId) {
        return NextResponse.json(
          { error: 'Extra ID is required' },
          { status: 400 }
        );
      }

      const client = await clientPromise;
      const db = client.db(DB_NAME);
      
      const result = await db
        .collection(COLLECTION)
        .deleteOne({ extraId });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: 'Extra not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting extra:', error);
      return NextResponse.json(
        { error: 'Failed to delete extra' },
        { status: 500 }
      );
    }
  });
}
