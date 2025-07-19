'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';

// POST /api/users/login/reset-password
export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
  }

  try {
    const { email, newPassword } = await req.json();

    // Validăm datele primite
    if (!email || !newPassword) {
      return NextResponse.json({ success: false, message: 'Email-ul și parola sunt obligatorii' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('florarie');
    const usersCollection = db.collection('users');

    // Verificăm dacă utilizatorul există
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Utilizatorul nu există' }, { status: 404 });
    }

    // Actualizăm parola utilizatorului și resetăm codul de verificare
    await usersCollection.updateOne(
      { email },
      { $set: { password: newPassword, resetCode: null, resetCodeExpires: null } }
    );

    return NextResponse.json({ success: true, message: 'Parola a fost resetată cu succes' });
  } catch (error) {
    console.log('Eroare la resetarea parolei:', error);
    return NextResponse.json({ success: false, message: 'Eroare internă a serverului' }, { status: 500 });
  }
}