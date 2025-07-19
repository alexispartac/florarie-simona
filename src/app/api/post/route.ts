'use server';
import { NextRequest, NextResponse } from 'next/server';
import { BlogPostProps } from '../types';
import clientPromise from '@/app/components/lib/mongodb'
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// GET /api/post - returnează toate post-urile
export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    if (!JWT_SECRET) {
        return NextResponse.json({ success: false, message: 'Secretul JWT nu este definit.' }, { status: 500 });
    }

    const cookie = req.cookies.get('login');
    const token = cookie ? cookie.value : null;

    if (!token) {
        return NextResponse.json({ success: false, message: 'Token lipsă' }, { status: 400 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || typeof decoded === 'string') {
        return NextResponse.json({ success: false, message: 'Token invalid sau expirat' }, { status: 401 });
    }
    const payload = decoded as jwt.JwtPayload;
    if (!payload.email || !payload.password) {
        return NextResponse.json({ success: false, message: 'Token invalid' }, { status: 401 });
    }

    if (payload.email !== 'matei.partac45@gmail.com' && payload.email !== 'emailsimona') {
        return NextResponse.json({ success: false, message: 'Nu aveți permisiunea de a accesa această resursă.' }, { status: 403 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const posts = await db.collection('blog_posts').find().toArray();
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error('Eroare la obținerea post-urilor:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la obținerea post-urilor.' }, { status: 500 });
    }
}

// POST /api/post - adaugă un post nou
export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    if (!JWT_SECRET) {
        return NextResponse.json({ success: false, message: 'Secretul JWT nu este definit.' }, { status: 500 });
    }

    const cookie = req.cookies.get('login');
    const token = cookie ? cookie.value : null;

    if (!token) {
        return NextResponse.json({ success: false, message: 'Token lipsă' }, { status: 400 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || typeof decoded === 'string') {
        return NextResponse.json({ success: false, message: 'Token invalid sau expirat' }, { status: 401 });
    }
    const payload = decoded as jwt.JwtPayload;
    if (!payload.email || !payload.password) {
        return NextResponse.json({ success: false, message: 'Token invalid' }, { status: 401 });
    }

    if (payload.email !== 'matei.partac45@gmail.com' && payload.email !== 'emailsimona') {
        return NextResponse.json({ success: false, message: 'Nu aveți permisiunea de a accesa această resursă.' }, { status: 403 });
    }

    try {
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
            return NextResponse.json({ success: false, message: 'Failed to insert post' }, { status: 500 });
        }

        return NextResponse.json({ insertedId: result.insertedId }, { status: 200 });
    } catch (error) {
        console.error('Eroare la inserarea post-ului:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la inserarea post-ului.' }, { status: 500 });
    }
}

// PUT /api/post - actualizează un post existent
export async function PUT(req: NextRequest) {
    if (req.method !== 'PUT') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    if (!JWT_SECRET) {
        return NextResponse.json({ success: false, message: 'Secretul JWT nu este definit.' }, { status: 500 });
    }

    const cookie = req.cookies.get('login');
    const token = cookie ? cookie.value : null;

    if (!token) {
        return NextResponse.json({ success: false, message: 'Token lipsă' }, { status: 400 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || typeof decoded === 'string') {
        return NextResponse.json({ success: false, message: 'Token invalid sau expirat' }, { status: 401 });
    }
    const payload = decoded as jwt.JwtPayload;
    if (!payload.email || !payload.password) {
        return NextResponse.json({ success: false, message: 'Token invalid' }, { status: 401 });
    }

    if (payload.email !== 'matei.partac45@gmail.com' && payload.email !== 'emailsimona') {
        return NextResponse.json({ success: false, message: 'Nu aveți permisiunea de a accesa această resursă.' }, { status: 403 });
    }

    try {

        const client = await clientPromise;
        const db = client.db('florarie');
        const data = await req.json();

        const { id, ...updateData } = data;
        // Găsește postul după id-ul custom (nu după _id-ul Mongo)
        const post = await db.collection('blog_posts').findOne({ id: id });

        if (!post) {
            return NextResponse.json({ success: false, message: 'Postul nu a fost găsit' }, { status: 404 });
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
            return NextResponse.json({ success: false, message: 'Failed to update post' }, { status: 500 });
        }

        return NextResponse.json({ modifiedCount: result.modifiedCount }, { status: 200 });
    } catch (error) {
        console.error('Eroare la actualizarea post-ului:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la actualizarea post-ului.' }, { status: 500 });
    }

}

// DELETE /api/post 
export async function DELETE(req: NextRequest) {
    if (req.method !== 'DELETE') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    if (!JWT_SECRET) {
        return NextResponse.json({ success: false, message: 'Secretul JWT nu este definit.' }, { status: 500 });
    }

    const cookie = req.cookies.get('login');
    const token = cookie ? cookie.value : null;

    if (!token) {
        return NextResponse.json({ success: false, message: 'Token lipsă' }, { status: 400 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || typeof decoded === 'string') {
        return NextResponse.json({ success: false, message: 'Token invalid sau expirat' }, { status: 401 });
    }
    const payload = decoded as jwt.JwtPayload;
    if (!payload.email || !payload.password) {
        return NextResponse.json({ success: false, message: 'Token invalid' }, { status: 401 });
    }

    if (payload.email !== 'matei.partac45@gmail.com' && payload.email !== 'emailsimona') {
        return NextResponse.json({ success: false, message: 'Nu aveți permisiunea de a accesa această resursă.' }, { status: 403 });
    }

    try {

        const client = await clientPromise;
        const db = client.db('florarie');
        const data = await req.json();

        const { id } = data;
        if (!id) {
            return NextResponse.json({ success: false, message: 'Post ID is required' }, { status: 400 });
        }

        const result = await db.collection('blog_posts').deleteOne({ id: id });
        if (!result.acknowledged) {
            return NextResponse.json({ success: false, message: 'Failed to delete post' }, { status: 500 });
        }

        return NextResponse.json({ deletedCount: result.deletedCount }, { status: 200 });
    } catch (error) {
        console.error('Eroare la ștergerea post-ului:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la ștergerea post-ului.' }, { status: 500 });
    }
}