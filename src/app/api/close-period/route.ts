'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// GET /api/close-period - obține perioada de închidere
export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const collection = db.collection('close-period');

        // Caută perioada de închidere
        const closePeriod = await collection.findOne({});

        if (!closePeriod) {
            return NextResponse.json({ success: false,  message: 'Nu există o perioadă de închidere setată.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, date: closePeriod.date }, { status: 200 });
    } catch (error) {
        console.error('Error fetching close period:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la obținerea perioadei de închidere.' }, { status: 500 });
    }
}


// PATCH /api/close-period - reseteaza perioada de închidere
export async function PATCH(req: NextRequest) {
    if (req.method !== 'PATCH') {
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
     
    if( payload.email !== 'matei.partac45@gmail.com' && payload.email !== 'emailsimona') {
        return NextResponse.json({ success: false, message: 'Nu aveți permisiunea de a accesa această resursă.' }, { status: 403 });
    }


    try {
        const { date } = await req.json();
        if (!date) {
            return NextResponse.json({ success: false, message: 'Data nu a fost furnizată' }, { status: 400 });
        }
        const client = await clientPromise;
        const db = client.db('florarie');
        const collection = db.collection('close-period');

        // Verifică dacă există deja o perioadă de închidere
        const existingPeriod = await collection.findOne({});
        if (existingPeriod) {
            // Actualizează perioada de închidere existentă
            await collection.updateOne({}, { $set: { date: date } });
        }

        return NextResponse.json({ success: true, message: 'Perioada de închidere a fost setată cu succes!' }, { status: 200 });
    } catch (error) {
        console.error('Error setting close period:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la setarea perioadei de închidere.' }, { status: 500 });
    }
}

