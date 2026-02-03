import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { withRateLimit } from '@/lib/rateLimit';

// POST - Increment share count
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRateLimit(request, async (req) => {
  try {
    const params = await context.params;
    const client = await clientPromise;
    const db = client.db('buchetul-simonei');
    
    const result = await db.collection('events').updateOne(
      { eventId: params.id },
      { $inc: { shares: 1 } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Get updated shares count
    const event = await db.collection('events').findOne({ eventId: params.id });

    return NextResponse.json({
      message: 'Share count incremented',
      shares: event?.shares || 0,
    });
  } catch (error) {
    console.error('Error incrementing share count:', error);
    return NextResponse.json(
      { error: 'Failed to increment share count' },
      { status: 500 }
    );
  }
  });
}
