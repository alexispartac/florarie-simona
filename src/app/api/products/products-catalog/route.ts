import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ProductInCatalog } from '@/types/products';
import { SortDirection } from 'mongodb';
import { withRateLimit } from '@/lib/rateLimit';

interface FilterQuery {
  available?: boolean;
  category?: { $in: string[] };
  'flowerDetails.colors'?: { $in: string[] };
  'flowerDetails.occasions'?: { $in: string[] };
  'flowerDetails.sameDayDelivery'?: boolean;
}

interface SortOrder {
  price?: 1 | -1;
  isNew?: 1 | -1;
  rating?: 1 | -1;
  isFeatured?: 1 | -1;
  createdAt?: 1 | -1;
}

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'products';

export async function GET(request: NextRequest) {
  return withRateLimit(request, async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Get filter parameters
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const colors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
    const occasions = searchParams.get('occasions')?.split(',').filter(Boolean) || [];
    const sameDayDelivery = searchParams.get('sameDayDelivery') === 'true';
    const sortBy = searchParams.get('sortBy') || 'featured';
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Build filter query
    const filterQuery: FilterQuery = { };
    
    // Category filter
    if (categories.length > 0) {
      filterQuery.category = { $in: categories };
    }
    
    // Flower-specific filters
    if (colors.length > 0) {
      filterQuery['flowerDetails.colors'] = { $in: colors };
    }
    
    if (occasions.length > 0) {
      filterQuery['flowerDetails.occasions'] = { $in: occasions };
    }
    
    if (sameDayDelivery) {
      filterQuery['flowerDetails.sameDayDelivery'] = true;
    }
    
    // Build sort object based on sortBy parameter
    let sortObject: SortOrder = {};
    switch (sortBy) {
      case 'price-asc':
        sortObject = { price: 1 };
        break;
      case 'price-desc':
        sortObject = { price: -1 };
        break;
      case 'newest':
        sortObject = { isNew: -1, createdAt: -1 };
        break;
      case 'rating':
        sortObject = { rating: -1 };
        break;
      case 'featured':
      default:
        sortObject = { isFeatured: -1, createdAt: -1 };
        break;
    }
    
    // Get total count with filters
    const totalCount = await db.collection(COLLECTION).countDocuments(filterQuery);
    const products: ProductInCatalog[] = await db
        .collection(COLLECTION)
        .find(filterQuery, 
            { projection: { 
                _id: 0,
                productId: 1,
                name: 1,
                slug: 1,
                price: 1,
                category: 1,
                tags: 1,
                isFeatured: 1,
                isNew: 1,
                rating: 1,
                reviewCount: 1,
                available: 1,
                stock: 1,
                images: 1,
                flowerDetails: 1
            }}
        )
        .sort(sortObject as unknown as { readonly [key: string]: SortDirection })
        .skip(offset)
        .limit(limit)
        .toArray() as unknown as ProductInCatalog[];

    return NextResponse.json({
      products,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + products.length < totalCount,
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
  });
}