import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/app/components/lib/mongodb';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const params = await context.params;
    const id = params?.id;


    if (!id) {
        return NextResponse.json({ error: 'ID-ul produsului lipsește' }, { status: 400 });
    }

    try {
        const product = await db.collection('products-composed').findOne({ id: id });
        if (!product) {
            console.error("Product not found");
            return NextResponse.json({ error: 'Produsul nu a fost găsit' }, { status: 404 });
        }
        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Eroare la preluarea produsului' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const { id } = await params;
    const data = await req.json();

    try {
        const result = await db.collection('products-composed').updateOne(
            { _id: new ObjectId(id) },
            { $set: data }
        );
        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Produsul nu a fost găsit' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Produs actualizat cu succes' }, { status: 200 });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Eroare la actualizarea produsului' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const { id } = await params;

    try {
        const result = await db.collection('products-composed').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Produsul nu a fost găsit' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Produs șters cu succes' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Eroare la ștergerea produsului' }, { status: 500 });
    }
}