import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { withRateLimit } from '@/lib/rateLimit';

const PRODUCTS_COLLECTION = 'products';
const EXTRAS_COLLECTION = 'extras';

export async function GET(request: NextRequest) {
  return withRateLimit(request, async (req) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (!query.trim()) {
      return NextResponse.json({ products: [], extras: [] });
    }

    const client = await clientPromise;
    const db = client.db('buchetul-simonei');

    // Create a text search query for products
    const productsSearchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ],
      available: true
    };

    // Create a text search query for extras
    const extrasSearchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ],
      available: true
    };

    // Search products
    const products = await db
      .collection(PRODUCTS_COLLECTION)
      .find(productsSearchQuery)
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

    // Search extras
    const extras = await db
      .collection(EXTRAS_COLLECTION)
      .find(extrasSearchQuery)
      .limit(limit)
      .project({
        extraId: 1,
        name: 1,
        slug: 1,
        price: 1,
        images: 1,
        category: 1,
        _id: 0
      })
      .toArray();

    return NextResponse.json({ products, extras });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
  });
}
