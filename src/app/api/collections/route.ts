import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Collection as CollectionType } from '@/types/collections';
import { withRateLimit } from '@/lib/rateLimit';

interface CollectionQuery {
  page: number;
  limit: number;
  search: string;
  featured: boolean;
}

// GET - Fetch all collections
export async function GET(request: NextRequest) {
  return withRateLimit(request, async (req) => {
  try {
    const client = await clientPromise;
    const db = client.db('buchetul-simonei');
    
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const featured = searchParams.get('featured');

    const skip = (page - 1) * limit;

    // Build query
    const query: CollectionQuery | Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // Fetch collections with pagination
    const collections = await db
      .collection('collections')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count
    const total = await db.collection('collections').countDocuments(query);

    return NextResponse.json({
      data: collections,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
  });
}

// POST - Create new collection
export async function POST(request: NextRequest) {
  return withRateLimit(request, async (req) => {
  try {
    const client = await clientPromise;
    const db = client.db('buchetul-simonei');
    
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Generate collection ID
    const collectionId = `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newCollection: Partial<CollectionType> & { createdAt: Date; updatedAt: Date } = {
      collectionId,
      name: body.name,
      description: body.description,
      image: body.image || '',
      products: body.products || [],
      featured: body.featured || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('collections').insertOne(newCollection);

    if (!result.acknowledged) {
      throw new Error('Failed to create collection');
    }

    return NextResponse.json({
      message: 'Collection created successfully',
      collectionId,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
  });
}
