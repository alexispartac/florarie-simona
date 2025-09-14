import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/app/components/lib/mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    if (req.method !== 'GET') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const params = await context.params;
        const id = params?.id;
    
    
        if (!id) {
            return NextResponse.json({ success: false, message: 'ID-ul produsului lipsește' }, { status: 400 });
        }
        const product = await db.collection('products-composed').findOne({ id: id });
        if (!product) {
            console.log("Product not found");
            return NextResponse.json({ success: false, message: 'Produsul nu a fost găsit' }, { status: 404 });
        }
        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.log('Error fetching product:', error);
        return NextResponse.json({ success: false, message: 'Eroare la preluarea produsului' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    if (payload.email !== 'laurasimona97@yahoo.com' && payload.email !== 'emailsimona') {
        return NextResponse.json({ success: false, message: 'Nu aveți permisiunea de a accesa această resursă.' }, { status: 403 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const { id } = await params;
        const data = await req.json();
        const result = await db.collection('products-composed').updateOne(
            { _id: new ObjectId(id) },
            { $set: data }
        );
        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false, message: 'Produsul nu a fost găsit' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Produs actualizat cu succes' }, { status: 200 });
    } catch (error) {
        console.log('Error updating product:', error);
        return NextResponse.json({ success: false, message: 'Eroare la actualizarea produsului' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    if (payload.email !== 'laurasimona97@yahoo.com' && payload.email !== 'emailsimona') {
        return NextResponse.json({ success: false, message: 'Nu aveți permisiunea de a accesa această resursă.' }, { status: 403 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const { id } = await params;
        const result = await db.collection('products-composed').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return NextResponse.json({ success: false, message: 'Produsul nu a fost găsit' }, { status: 404 });
        }
        return NextResponse.json({ success: false, message: 'Produs șters cu succes' }, { status: 200 });
    } catch (error) {
        console.log('Error deleting product:', error);
        return NextResponse.json({ success: false, message: 'Eroare la ștergerea produsului' }, { status: 500 });
    }
}