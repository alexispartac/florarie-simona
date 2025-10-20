'use server';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import clientPromise from '@/app/components/lib/mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

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

  if (payload.email !== 'laurasimona97@yahoo.com' && payload.email !== 'emailsimona') {
    return NextResponse.json({ success: false, message: 'Nu aveți permisiunea de a accesa această resursă.' }, { status: 403 });
  }
  try {

    const client = await clientPromise;
    const db = client.db('florarie');
    const reviewsCollection = db.collection('reviews');
    const data = await req.json();

    const { reviewId } = data;
    if (!reviewId) {
      return NextResponse.json(
        { success: false, message: 'ID-ul recenziei este necesar.' },
        { status: 400 }
      );
    }

    // Încearcă să ștergi după câmpul `id` custom
    const result = await reviewsCollection.deleteOne({ id: reviewId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Recenzia nu a fost găsită.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Recenzia a fost ștearsă cu succes.' },
      { status: 200 }
    );
  } catch (error) {
    console.log('Eroare la ștergerea recenziei:', error);
    return NextResponse.json(
      { success: false, message: 'A apărut o eroare la ștergerea recenziei.' },
      { status: 500 }
    );
  }
}
