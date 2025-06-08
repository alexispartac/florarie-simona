'use server';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
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

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    // Validare simplă a datelor
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Toate câmpurile sunt obligatorii.' },
        { status: 400 }
      );
    }

    // Conectare la baza de date
    const db = await connectDB();
    const reviewsCollection = db.collection('reviews');

    // Inserare recenzie în baza de date
    const result = await reviewsCollection.insertOne({
      id: uuidv4(),
      name,
      email,
      message,
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

    const db = await connectDB();
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
