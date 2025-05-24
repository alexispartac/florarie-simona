'use server';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

import { OrderProps } from '../types';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'florarie';

// Singleton pattern pentru MongoClient
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

async function connectDB() {
    if (!clientPromise) {
        client = new MongoClient(uri);
        clientPromise = client.connect();
    }
    await clientPromise;
    return client!.db(dbName);
}


// GET /api/orders - returnează toate comenzile
export async function GET() {
    const db = await connectDB();
    const orders = await db.collection('orders').find().toArray();
    return NextResponse.json(orders, { status: 200 });
}

// POST /api/orders - adaugă o comandă nouă
export async function POST(req: NextRequest) {
    const db = await connectDB();
    const data: OrderProps = await req.json();

    const result = await db.collection('orders').insertOne(data);
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to insert order' }, { status: 500 });
    }

    return NextResponse.json({ insertedId: result.insertedId }, { status: 200 });
}

// PUT /api/orders - finalizeaza o comandă existentă
export async function PUT(req: NextRequest) {
    const db = await connectDB();
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
    const db = await connectDB();
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


