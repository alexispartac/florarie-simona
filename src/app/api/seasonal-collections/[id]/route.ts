import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { SeasonalCollection } from '@/types/seasonalCollections';
import { withRateLimit } from '@/lib/rateLimit';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'seasonal-collections';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  return withRateLimit(request, async () => {
    try {
      if (!id) {
        return NextResponse.json(
          { error: 'Collection ID is required' },
          { status: 400 }
        );
      }

      const client = await clientPromise;
      const db = client.db(DB_NAME);
      
      const collection = await db
        .collection(COLLECTION)
        .findOne({ collectionId: id });

      if (!collection) {
        return NextResponse.json(
          { error: 'Seasonal collection not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(collection);
    } catch (error) {
      console.error('Error fetching seasonal collection:', error);
      return NextResponse.json(
        { error: 'Failed to fetch seasonal collection' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  return withRateLimit(request, async (req) => {
    try {
      if (!id) {
        return NextResponse.json(
          { error: 'Collection ID is required' },
          { status: 400 }
        );
      }

      const body = await req.json();
      const updatedData: Partial<SeasonalCollection> = {
        ...body,
        updatedAt: new Date().toISOString(),
      };

      // Remove fields that shouldn't be updated
      delete (updatedData as { collectionId?: string }).collectionId;
      delete (updatedData as { createdAt?: string }).createdAt;

      const client = await clientPromise;
      const db = client.db(DB_NAME);
      
      const result = await db
        .collection(COLLECTION)
        .updateOne(
          { collectionId: id },
          { $set: updatedData }
        );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Seasonal collection not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        message: 'Seasonal collection updated successfully',
        data: { collectionId: id, ...updatedData }
      });
    } catch (error) {
      console.error('Error updating seasonal collection:', error);
      return NextResponse.json(
        { error: 'Failed to update seasonal collection' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  return withRateLimit(request, async () => {
    try {
      if (!id) {
        return NextResponse.json(
          { error: 'Collection ID is required' },
          { status: 400 }
        );
      }

      const client = await clientPromise;
      const db = client.db(DB_NAME);
      
      const result = await db
        .collection(COLLECTION)
        .deleteOne({ collectionId: id });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: 'Seasonal collection not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        message: 'Seasonal collection deleted successfully' 
      });
    } catch (error) {
      console.error('Error deleting seasonal collection:', error);
      return NextResponse.json(
        { error: 'Failed to delete seasonal collection' },
        { status: 500 }
      );
    }
  });
}
