'use server';
import { NextRequest, NextResponse } from 'next/server';
import { BlogPostProps } from '../types';
import clientPromise from '@/app/components/lib/mongodb'

// GET /api/post - returnează toate post-urile
export async function GET() {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const posts = await db.collection('blog_posts').find().toArray();
    return NextResponse.json(posts, { status: 200 });
}

// POST /api/post - adaugă un post nou
export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const data = await req.json();

    const post_data: BlogPostProps = {
        ...data,
        likes: data.likes || 0,
        dislikes: data.dislikes || 0,
        likedBy: data.likedBy || [],
        dislikedBy: data.dislikedBy || [],
    }
    const result = await db.collection('blog_posts').insertOne(post_data);
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to insert post' }, { status: 500 });
    }

    return NextResponse.json({ insertedId: result.insertedId }, { status: 200 });
}

// PUT /api/post - actualizează un post existent
export async function PUT(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const data = await req.json();

    const { id, ...updateData } = data;
    // Găsește postul după id-ul custom (nu după _id-ul Mongo)
    const post = await db.collection('blog_posts').findOne({ id: id });

    if (!post) {
        return NextResponse.json({ error: 'Postul nu a fost găsit' }, { status: 404 });
    }

    // Elimină câmpul _id din updateData dacă există (altfel MongoDB va încerca să-l modifice și va da eroare)
    if ('_id' in updateData) {
        delete updateData._id;
    }

    const result = await db.collection('blog_posts').updateOne(
        { _id: post._id },
        { $set: updateData }
    );
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }

    return NextResponse.json({ modifiedCount: result.modifiedCount }, { status: 200 });
}

// DELETE /api/post 
export async function DELETE(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const data = await req.json();

    const { id } = data;
    console.log('Deleting post with ID:', id);
    if (!id) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const result = await db.collection('blog_posts').deleteOne({ id: id });
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }

    return NextResponse.json({ deletedCount: result.deletedCount }, { status: 200 });
}