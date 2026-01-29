import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Event } from '@/types/events';

// GET - Fetch single event by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const client = await clientPromise;
    const db = client.db('buchetul-simonei');
    
    const event = await db
      .collection('events')
      .findOne({ eventId: params.id });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT - Update event
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const client = await clientPromise;
    const db = client.db('buchetul-simonei');
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.eventDate) {
      return NextResponse.json(
        { error: 'Title, description, and event date are required' },
        { status: 400 }
      );
    }

    // Determine event type based on date
    const eventDate = new Date(body.eventDate);
    const now = new Date();
    const eventType = eventDate > now ? 'upcoming' : 'past';

    const updateData: Omit<Event, 'eventId' | 'likes' | 'shares'> & { updatedAt: Date } = {
      title: body.title,
      description: body.description,
      media: body.media || [],
      eventDate: eventDate,
      eventType: eventType,
      location: body.location || '',
      featured: body.featured || false,
      published: body.published !== undefined ? body.published : true,
      updatedAt: new Date(),
    };

    const result = await db
      .collection('events')
      .updateOne(
        { eventId: params.id },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Event updated successfully',
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete event
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const client = await clientPromise;
    const db = client.db('buchetul-simonei');
    
    const result = await db
      .collection('events')
      .deleteOne({ eventId: params.id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
