import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { withRateLimit } from '@/lib/rateLimit';

// POST - Toggle like on an event
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withRateLimit(request, async (req) => {
  try {
    const params = await context.params;
    const client = await clientPromise;
    const db = client.db('buchetul-simonei');
    
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find the event
    const event = await db.collection('events').findOne({ eventId: params.id });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const likedBy = event.likedBy || [];
    const hasLiked = likedBy.includes(userId);

    let updateOperation;
    if (hasLiked) {
      // Unlike: remove user from likedBy and decrease likes count
      updateOperation = {
        $pull: { likedBy: userId },
        $inc: { likes: -1 },
      };
    } else {
      // Like: add user to likedBy and increase likes count
      updateOperation = {
        $addToSet: { likedBy: userId },
        $inc: { likes: 1 },
      };
    }

    await db.collection('events').updateOne(
      { eventId: params.id },
      updateOperation
    );

    return NextResponse.json({
      message: hasLiked ? 'Event unliked' : 'Event liked',
      liked: !hasLiked,
      likes: hasLiked ? event.likes - 1 : event.likes + 1,
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
  });
}
