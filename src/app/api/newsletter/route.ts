'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/newsletter
export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
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
    console.log('Eroare la adăugarea email-ului:', error);
    return NextResponse.json({ error: 'Eroare internă a serverului' }, { status: 500 });
  }
}

// DELETE /api/newsletter
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
    return NextResponse.json
    
    
    ({ success: false, message: 'Token lipsă' }, { status: 400 });
  }

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
    console.log('Eroare la ștergerea email-ului:', error);
    return NextResponse.json({ error: 'Eroare internă a serverului' }, { status: 500 });
  }
}