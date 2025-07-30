'use server';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '../types';
import clientPromise from '@/app/components/lib/mongodb'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// GET /api/users - returnează toți userii
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
        const users = await db.collection('users').find().toArray();
        if (!users) {
            return NextResponse.json({ success: false, message: 'Nu s-au găsit useri.' }, { status: 404 });
        }

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error('Eroare la obținerea userilor:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la obținerea userilor.' }, { status: 500 });
    }
}

// POST /api/users - adaugă un user nou 
export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const data = await req.json();

        // Verifică dacă există deja un user cu același email
        const existingUser = await db.collection('users').findOne({ email: data.email });
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'Există deja un cont cu acest email.' }, { status: 409 });
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
            return NextResponse.json({ success: false, message: 'Failed to insert user' }, { status: 500 });
        }

        return NextResponse.json({ insertedId: result.insertedId }, { status: 200 });
    } catch (error) {
        console.error('Eroare la adăugarea userului:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la adăugarea userului.' }, { status: 500 });
    }
}

// PUT /api/users - actualizează un user existent
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

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload) {
        return NextResponse.json({ success: false, message: 'Token invalid sau expirat' }, { status: 401 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const data: User = await req.json();
        const { id, ...updateData } = data;
        
        if (!id) {
            return NextResponse.json({ success: false, message: 'ID-ul userului este necesar pentru actualizare.' }, { status: 400 });
        }

        const updateDataWithoutPassword: Partial<User> = {
            name: updateData.name,
            surname: updateData.surname,
            email: updateData.email,
            phone: updateData.phone || '',
            address: updateData.address || '',
            orders: updateData.orders || 0,
            avatar: updateData.avatar || '',
        };

        const result = await db.collection('users').updateOne({ id: id }, { $set: updateDataWithoutPassword });

        if (!result.acknowledged) {
            return NextResponse.json({ success: false, message: 'Failed to update user' }, { status: 500 });
        }

        return NextResponse.json({ modifiedCount: result.modifiedCount }, { status: 200 });
    } catch (error) {
        console.error('Eroare la actualizarea userului:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la actualizarea userului.' }, { status: 500 });
    }
}

// DELETE /api/users - șterge un user
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

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload) {
        return NextResponse.json({ success: false, message: 'Token invalid sau expirat' }, { status: 401 });
    }

    try {

        const client = await clientPromise;
        const db = client.db('florarie');
        const data = await req.json();

        const { id } = data;

        const result = await db.collection('users').deleteOne({ _id: id });
        if (!result.acknowledged) {
            return NextResponse.json({ success: false, message: 'Failed to delete user' }, { status: 500 });
        }

        return NextResponse.json({ deletedCount: result.deletedCount }, { status: 200 });
    } catch (error) {
        console.error('Eroare la ștergerea userului:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la ștergerea userului.' }, { status: 500 });
    }
}




