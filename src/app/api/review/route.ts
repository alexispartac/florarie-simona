'use server';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import clientPromise from '@/app/components/lib/mongodb';
import dotenv from 'dotenv';
dotenv.config();

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
  }

  try {
    const { name, email, message, avatar } = await req.json();
    // Validare simplă a datelor
    if (!name || !email || !message || !avatar) {
      return NextResponse.json(
        { success: false, message: 'Toate câmpurile sunt obligatorii.' },
        { status: 400 }
      );
    }

    // Conectare la baza de date
    const client = await clientPromise;
    const db = client.db('florarie');
    const reviewsCollection = db.collection('reviews');

    // Inserare recenzie în baza de date
    const result = await reviewsCollection.insertOne({
      id: uuidv4(),
      name,
      email,
      message,
      avatar,
      createdAt: new Date(),
    });

    // Răspuns de succes
    return NextResponse.json(
      { success: true, message: 'Recenzia a fost salvată cu succes.', id: result.insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.log('Eroare la salvarea recenziei:', error);
    return NextResponse.json(
      { success: false, message: 'A apărut o eroare la salvarea recenziei.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
  }

  try {

    const client = await clientPromise;
    const db = client.db('florarie');
    const reviewsCollection = db.collection('reviews');

    const reviews = await reviewsCollection.find().toArray();

    // Răspuns cu toate recenziile
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.log('Eroare la obținerea recenziilor:', error);
    return NextResponse.json(
      { success: false, message: 'A apărut o eroare la obținerea recenziilor.' },
      { status: 500 }
    );
  }
}
