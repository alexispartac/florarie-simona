import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Event } from '@/types/events';

interface EventQuery {
  page: number;
  limit: number;
  search: string;
  eventType: 'upcoming' | 'past';
  featured: boolean;
  published: boolean;
}
// GET - Fetch all events
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('buchetul-simonei');
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const eventType = searchParams.get('eventType'); // 'upcoming' or 'past'
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');

    const skip = (page - 1) * limit;

    // Build query
    const query: EventQuery | Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (eventType) {
      query.eventType = eventType;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (published === 'true') {
      query.published = true;
    } else if (published === 'false') {
      query.published = false;
    }

    // Fetch events with pagination
    const events = await db
      .collection('events')
      .find(query)
      .sort({ eventDate: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count
    const total = await db.collection('events').countDocuments(query);

    return NextResponse.json({
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
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

    // Generate event ID
    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Determine event type based on date
    const eventDate = new Date(body.eventDate);
    const now = new Date();
    const eventType = eventDate > now ? 'upcoming' : 'past';

    const newEvent: Partial<Event> & { createdAt: Date; updatedAt: Date } = {
      eventId,
      title: body.title,
      description: body.description,
      media: body.media || [],
      eventDate: eventDate,
      eventType: eventType,
      location: body.location || '',
      likes: 0,
      likedBy: [],
      shares: 0,
      featured: body.featured || false,
      published: body.published !== undefined ? body.published : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('events').insertOne(newEvent);

    if (!result.acknowledged) {
      throw new Error('Failed to create event');
    }

    return NextResponse.json({
      message: 'Event created successfully',
      eventId,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
