'use server';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import clientPromise from '@/app/components/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, avatar } = await req.json();
    console.log('Received data:', { name, email, message, avatar });
    // Validare simplă a datelor
    if (!name || !email || !message || !avatar) {
      return NextResponse.json(
        { error: 'Toate câmpurile sunt obligatorii.' },
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
      { message: 'Recenzia a fost salvată cu succes.', id: result.insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Eroare la salvarea recenziei:', error);
    return NextResponse.json(
      { error: 'A apărut o eroare la salvarea recenziei.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {

    const client = await clientPromise;
    const db = client.db('florarie'); 
    const reviewsCollection = db.collection('reviews');

    const reviews = await reviewsCollection.find().toArray();

    // Răspuns cu toate recenziile
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error('Eroare la obținerea recenziilor:', error);
    return NextResponse.json(
      { error: 'A apărut o eroare la obținerea recenziilor.' },
      { status: 500 }
    );
  }
}
