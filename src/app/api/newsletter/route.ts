'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';

// POST /api/newsletter
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email-ul este obligatoriu' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('florarie'); 
    const newsletterCollection = db.collection('newsletter');

    // Verificăm dacă email-ul există deja
    const existingEmail = await newsletterCollection.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ error: 'Email-ul este deja abonat' }, { status: 409 });
    }

    // Adăugăm email-ul în baza de date
    await newsletterCollection.insertOne({ email, subscribedAt: new Date() });

    return NextResponse.json({ message: 'Email-ul a fost adăugat cu succes la newsletter' });
  } catch (error) {
    console.error('Eroare la adăugarea email-ului:', error);
    return NextResponse.json({ error: 'Eroare internă a serverului' }, { status: 500 });
  }
}

// DELETE /api/newsletter
export async function DELETE(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email-ul este obligatoriu' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('florarie'); 
    const newsletterCollection = db.collection('newsletter');

    // Ștergem email-ul din baza de date
    const result = await newsletterCollection.deleteOne({ email });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Email-ul nu a fost găsit' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Email-ul a fost șters cu succes din newsletter' });
  } catch (error) {
    console.error('Eroare la ștergerea email-ului:', error);
    return NextResponse.json({ error: 'Eroare internă a serverului' }, { status: 500 });
  }
}