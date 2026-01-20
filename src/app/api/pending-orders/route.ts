'use server';
import { NextRequest, NextResponse } from 'next/server';
import { OrderPropsAdmin } from '@/app/types/order';
import clientPromise from '@/app/components/lib/mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * POST - Salvează comenzile temporare pentru plata cu cardul
 * Acestea NU sunt comenzi finale - doar date temporare pentru webhook
 */
export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ 
            success: false, 
            message: 'Metoda HTTP nu este permisă.' 
        }, { status: 405 });
    }

    if (!JWT_SECRET) {
        return NextResponse.json({ 
            success: false, 
            message: 'Secretul JWT nu este definit.' 
        }, { status: 500 });
    }

    try {
        // Verifică autentificarea
        const cookie = req.cookies.get('login');
        const token = cookie ? cookie.value : null;

        if (!token) {
            return NextResponse.json({ 
                success: false, 
                message: 'Token lipsă' 
            }, { status: 400 });
        }

        const payload = jwt.verify(token, JWT_SECRET);
        if (!payload) {
            return NextResponse.json({ 
                success: false, 
                message: 'Token invalid sau expirat' 
            }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db('florarie');
        const data: OrderPropsAdmin & { createdAt: string, expiresAt: string } = await req.json();

        // Validări de bază
        if (!data.id || !data.clientName || !data.clientEmail || !data.products) {
            return NextResponse.json({ 
                success: false, 
                message: 'Date incomplete' 
            }, { status: 400 });
        }

        // Verifică dacă există deja o comandă pending cu acest ID
        const existingPending = await db.collection('pending-orders').findOne({ id: data.id });
        
        if (existingPending) {
            // Actualizează comanda pending existentă
            await db.collection('pending-orders').updateOne(
                { id: data.id },
                { 
                    $set: { 
                        ...data,
                        updatedAt: new Date().toISOString()
                    } 
                }
            );
        } else {
            // Inserează comandă nouă pending
            const result = await db.collection('pending-orders').insertOne({
                ...data,
                createdAt: new Date().toISOString()
            });

            if (!result.acknowledged) {
                return NextResponse.json({ 
                    success: false, 
                    message: 'Eroare la salvarea comenzii temporare' 
                }, { status: 500 });
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Comandă temporară salvată cu succes' 
        }, { status: 200 });

    } catch (error) {
        console.error('Eroare la salvarea comenzii temporare:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Eroare internă a serverului' 
        }, { status: 500 });
    }
}

/**
 * DELETE - Curăță comenzile expirate
 */
export async function DELETE(req: NextRequest) {
    if (req.method !== 'DELETE') {
        return NextResponse.json({ 
            success: false, 
            message: 'Metoda HTTP nu este permisă.' 
        }, { status: 405 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie');

        // Șterge comenzile care au expirat (mai vechi de 20 minute)
        const result = await db.collection('pending-orders').deleteMany({
            expiresAt: { $lt: new Date().toISOString() }
        });

        return NextResponse.json({ 
            success: true, 
            deletedCount: result.deletedCount,
            message: `Șterse ${result.deletedCount} comenzi expirate` 
        }, { status: 200 });

    } catch (error) {
        console.error('Eroare la ștergerea comenzilor expirate:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Eroare internă a serverului' 
        }, { status: 500 });
    }
}
