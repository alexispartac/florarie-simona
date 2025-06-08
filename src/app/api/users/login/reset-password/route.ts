'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';

// POST /api/users/login/reset-password
export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();

    // Validăm datele primite
    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email-ul și parola sunt obligatorii' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('florarie'); 
    const usersCollection = db.collection('users');

    // Verificăm dacă utilizatorul există
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Utilizatorul nu există' }, { status: 404 });
    }


    // Actualizăm parola utilizatorului și resetăm codul de verificare
    await usersCollection.updateOne(
      { email },
      { $set: { password: newPassword, resetCode: null, resetCodeExpires: null } }
    );

    return NextResponse.json({ message: 'Parola a fost resetată cu succes' });
  } catch (error) {
    console.error('Eroare la resetarea parolei:', error);
    return NextResponse.json({ error: 'Eroare internă a serverului' }, { status: 500 });
  }
}