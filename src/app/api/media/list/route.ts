// File: src/app/api/media/list/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';
import { Post } from '@/app/models/Posts';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('florarie');
    
    const posts = await db.collection<Post>('posts')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}