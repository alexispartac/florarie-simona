'use server';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '../types';
import clientPromise from '@/app/components/lib/mongodb'


// GET /api/users - returnează toți userii
export async function GET() {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const users = await db.collection('users').find().toArray();

    return NextResponse.json(users);
}

// POST /api/users - adaugă un user nou și returnează un JWT
export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const data = await req.json();

    // Verifică dacă există deja un user cu același email
    const existingUser = await db.collection('users').findOne({ email: data.email });
    if (existingUser) {
        return NextResponse.json({ error: 'Există deja un cont cu acest email.' }, { status: 409 });
    }

    const post_data: User = {
        ...data,
        phone: data.phone || '',
        address: data.address || '',
        order: data.order || 0,
        createdAt: new Date(),

    }
    const result = await db.collection('users').insertOne(post_data);
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to insert user' }, { status: 500 });
    }

    return NextResponse.json({ insertedId: result.insertedId }, { status: 200 });
}

// PUT /api/users - actualizează un user existent
export async function PUT(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const data: User = await req.json();

    const { id, ...updateData } = data;
    const updateDataWithoutPassword: Partial<User> = {
        name: updateData.name,
        surname: updateData.surname,
        email: updateData.email,
        phone: updateData.phone || '',
        address: updateData.address || '',
        orders: updateData.orders || 0,
        
    };

    const result = await db.collection('users').updateOne({ id: id }, { $set: updateDataWithoutPassword });

    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({ modifiedCount: result.modifiedCount }, { status: 200 });
}

// DELETE /api/users - șterge un user
export async function DELETE(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const data = await req.json();

    const { id } = data;

    const result = await db.collection('users').deleteOne({ _id: id });
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }

    return NextResponse.json({ deletedCount: result.deletedCount }, { status: 200 });
}




