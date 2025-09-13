'use server';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import clientPromise from '@/app/components/lib/mongodb';

interface ReviewData {
  id: string;
  createdAt: Date;
  name: string;
  email: string;
  message: string;
  avatar?: string;
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
  }

  try {
    const { name, email, message, avatar } = await req.json();
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Toate câmpurile sunt obligatorii.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('florarie');
    const reviewsCollection = db.collection('reviews');

    const reviewData: ReviewData = {
      id: uuidv4(),
      name,
      email,
      message,
      createdAt: new Date(),
    };

    if (avatar && avatar.trim() !== '') {
      reviewData.avatar = avatar;
    }

    const result = await reviewsCollection.insertOne(reviewData);

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
