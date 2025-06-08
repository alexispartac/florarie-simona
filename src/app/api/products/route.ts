'use server';
import { NextRequest, NextResponse } from 'next/server';
import { SimpleProductProps } from '../types';
import clientPromise from '@/app/components/lib/mongodb';

// GET /api/products - returnează toți produsele
export async function GET() {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const products = await db.collection('products').find().toArray();
    return NextResponse.json(products, { status: 200 });
}

// POST /api/products - adaugă un produs nou
export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const data = await req.json();

    const post_data: SimpleProductProps = {
        ...data,
        quantity: data.quantity || 0,
        price: data.price || 0,
    }
    const result = await db.collection('products').insertOne(post_data);
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to insert product' }, { status: 500 });
    }

    return NextResponse.json({ insertedId: result.insertedId }, { status: 200 });
}

// PUT /api/products - actualizează un produs existent
export async function PUT(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const data = await req.json();

    const { id, ...updateData } = data;
    // Găsește produsul după id-ul custom (nu după _id-ul Mongo)
    const product = await db.collection('products').findOne({ id: id });

    if (!product) {
        return NextResponse.json({ error: 'Produsul nu a fost găsit' }, { status: 404 });
    }

    // Elimină câmpul _id din updateData dacă există (altfel MongoDB va încerca să-l modifice și va da eroare)
    if ('_id' in updateData) {
        delete updateData._id;
    }

    const result = await db.collection('products').updateOne(
        { _id: product._id },
        { $set: updateData }
    );
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }

    return NextResponse.json({ modifiedCount: result.modifiedCount }, { status: 200 });
}

// DELETE /api/products - șterge un produs existent dupa id din cerere
export async function DELETE(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const data = await req.json();

    const { id } = data;
    console.log('Deleting product with ID:', id);
    if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const result = await db.collection('products').deleteOne({ id: id });
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }

    return NextResponse.json({ deletedCount: result.deletedCount }, { status: 200 });
}
