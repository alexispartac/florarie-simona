import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'products';

// PUT endpoint to add stock to all products
export async function PUT() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Update all products to add stock: 1 if they don't have it
    const result = await db.collection(COLLECTION).updateMany(
      { }, // Match all products
      { 
        $set: { 
          stock: 1,
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} products with stock`,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
  } catch (error) {
    console.error('Error updating products stock:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update products stock' 
      },
      { status: 500 }
    );
  }
}
