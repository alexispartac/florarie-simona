import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Collection } from '@/types/collections';

// GET - Fetch single collection by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const client = await clientPromise;
    const db = client.db('buchetul-simonei');

    const collection = await db
      .collection('collections')
      .findOne({ collectionId: params.id });

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Fetch products in this collection
    if (collection.products && collection.products.length > 0) {
      const products = await db
        .collection('products')
        .find({ productId: { $in: collection.products } })
        .toArray();
      
      collection.productsDetails = products;
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collection' },
      { status: 500 }
    );
  }
}

// PUT - Update collection
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
    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const updateData: Omit<Collection, 'collectionId'> = {
      name: body.name,
      description: body.description,
      image: body.image || '',
      products: body.products || [],
      featured: body.featured || false,
      updatedAt: new Date(),
    };

    const result = await db
      .collection('collections')
      .updateOne(
        { collectionId: params.id },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Collection updated successfully',
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json(
      { error: 'Failed to update collection' },
      { status: 500 }
    );
  }
}

// DELETE - Delete collection
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const client = await clientPromise;
    const db = client.db('buchetul-simonei');
    
    const result = await db
      .collection('collections')
      .deleteOne({ collectionId: params.id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Collection deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json(
      { error: 'Failed to delete collection' },
      { status: 500 }
    );
  }
}
