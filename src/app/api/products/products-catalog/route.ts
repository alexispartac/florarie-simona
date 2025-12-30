import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ProductInCatalog } from '@/types/products';

const DB_NAME = 'WearYouTheBest';
const COLLECTION = 'products';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const products: ProductInCatalog[] = await db
        .collection(COLLECTION)
        .find({}, 
            { projection: { 
                _id: 0,
                productId: 1,
                variantId: 1,
                name: 1,
                slug: 1,
                category: 1,
                price: 1,
                isFeatured: 1,
                isNew: 1,
                rating: 1,
                reviewCount: 1,
                availableSizes: 1,
                availableColors: 1,
                images: 1
            }}
        )
        .sort({})
        .toArray() as unknown as ProductInCatalog[];

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}