'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * GET - Verifică dacă o comandă există în baza de date
 * Endpoint: /api/orders/check/:orderId
 * Note: No-cache headers sunt setate în NextResponse
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    if (req.method !== 'GET') {
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

        // Await params (Next.js 16+)
        const { orderId } = await params;

        if (!orderId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Order ID lipsă' 
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('florarie');

        // Verifică în colecția orders
        const order = await db.collection('orders').findOne({ id: orderId });

        return NextResponse.json({ 
            exists: !!order,
            orderId: orderId 
        }, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Surrogate-Control': 'no-store'
            }
        });

    } catch (error) {
        console.error('Eroare la verificarea comenzii:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Eroare internă a serverului' 
        }, { status: 500 });
    }
}
