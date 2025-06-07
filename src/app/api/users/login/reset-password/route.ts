'use server';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'florarie';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

async function connectDB() {
  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  await clientPromise;
  return client!.db(dbName);
}

// POST /api/users/login/reset-password
export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();

    // Validăm datele primite
    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email-ul și parola sunt obligatorii' }, { status: 400 });
    }

    const db = await connectDB();
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