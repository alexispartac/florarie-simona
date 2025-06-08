'use server';
import { NextRequest, NextResponse } from 'next/server';
import { OrderProps } from '../types';
import clientPromise from '@/app/components/lib/mongodb';

// GET /api/orders - returnează toate comenzile
export async function GET() {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const orders = await db.collection('orders').find().toArray();
    return NextResponse.json(orders, { status: 200 });
}

// POST /api/orders - adaugă o comandă nouă
export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const data: OrderProps = await req.json();

    const result = await db.collection('orders').insertOne(data);
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to insert order' }, { status: 500 });
    }

    return NextResponse.json({ insertedId: result.insertedId }, { status: 200 });
}

// PUT /api/orders - finalizeaza o comandă existentă
export async function PUT(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const { id, status } = await req.json();

    // Găsește comanda după id-ul custom (nu după _id-ul Mongo)
    const order = await db.collection('orders').findOne({ id: id });

    if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const result = await db.collection('orders').updateOne(
        { _id: order._id },
        { $set: { status: status, deliveryDate: new Date().toISOString() } }
    );

    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({ modifiedCount: result.modifiedCount }, { status: 200 });
}


// DELETE /api/orders - șterge o comandă existentă
export async function DELETE(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const { id } = await req.json();

    // Găsește comanda după id-ul custom (nu după _id-ul Mongo)
    const order = await db.collection('orders').findOne({ id: id });

    if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const result = await db.collection('orders').deleteOne({ _id: order._id });
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }

    return NextResponse.json({ deletedCount: result.deletedCount }, { status: 200 });
}


