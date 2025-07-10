'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';


// GET /api/close-period - obține perioada de închidere
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const collection = db.collection('close-period');

        // Caută perioada de închidere
        const closePeriod = await collection.findOne({});

        if (!closePeriod) {
            return NextResponse.json({ message: 'Nu există o perioadă de închidere setată.' }, { status: 404 });
        }

        return NextResponse.json({ date: closePeriod.date }, { status: 200 });
    } catch (error) {
        console.error('Error fetching close period:', error);
        return NextResponse.json({ error: 'A apărut o eroare la obținerea perioadei de închidere.' }, { status: 500 });
    }
}


// PATCH /api/close-period - reseteaza perioada de închidere
export async function PATCH(request: NextRequest) {
    try {
        const { date } = await request.json();
        if (!date) {
            return NextResponse.json({ error: 'Data nu a fost furnizată' }, { status: 400 });
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

        return NextResponse.json({ message: 'Perioada de închidere a fost setată cu succes!' }, { status: 200 });
    } catch (error) {
        console.error('Error setting close period:', error);
        return NextResponse.json({ error: 'A apărut o eroare la setarea perioadei de închidere.' }, { status: 500 });
    }
}

