import { Product, ProductReview } from "@/types/products";
import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import { Document, UpdateFilter } from "mongodb";

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'products';

export async function POST(request: NextRequest) {
    try {
      const review: ProductReview = await request.json();

      if (!review.productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
      }

      if (!review) {
        return NextResponse.json({ error: 'Review is required' }, { status: 400 });
      }

      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection<Product>(COLLECTION);
      
      // Add review to the product
      const result = await collection.updateOne(
        { productId: review.productId }, 
        { 
          $push: { reviews: review },
          $inc: { reviewCount: 1 }
        } as unknown as UpdateFilter<Document>
      );

      if (!result.acknowledged || result.matchedCount === 0) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
      }

      // Calculate new average rating
      const product = await collection.findOne({ productId: review.productId });
      if (product && product.reviews) {
        const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / product.reviews.length;
        
        await collection.updateOne(
          { productId: review.productId },
          { $set: { rating: Math.round(averageRating * 10) / 10 } }
        );
      }

      return NextResponse.json({ success: true, message: 'Review submitted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error submitting review:', error);
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }
  }