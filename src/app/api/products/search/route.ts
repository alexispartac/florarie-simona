import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const COLLECTION = 'products';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (!query.trim()) {
      return NextResponse.json({ products: [] });
    }

    const client = await clientPromise;
    const db = client.db('buchetul-simonei');

    // Create a text search query
    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ],
      available: true
    };

    const products = await db
      .collection(COLLECTION)
      .find(searchQuery)
      .limit(limit)
      .project({
        productId: 1,
        name: 1,
        slug: 1,
        price: 1,
        images: 1,
        category: 1,
        rating: 1,
        _id: 0
      })
      .toArray();

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
