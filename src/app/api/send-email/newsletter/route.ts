'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// GET /api/send-email/newsletter
export async function GET() {
  const client = await clientPromise;
  const db = client.db('florarie');
  const newsletterCollection = db.collection('newsletter');
  
  const subscribers = await newsletterCollection.find().toArray();
  return NextResponse.json(subscribers);
}

// POST /api/send-email/newsletter
export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
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

    try {
      // Verifică dacă toate câmpurile necesare sunt prezente
      if (!email) {
        return NextResponse.json(
          { success: false, message: 'Missing required fields.' },
          { status: 400 }
        );
      }

      // Verifică dacă email-ul clientului este valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: 'Email invalid.' },
          { status: 400 }
        );
      }

      // Configurare Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Conținutul email-ului
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Multumim ca te-ai abonat la newsletter-ul - Buchetul Simonei',
        html: `
            <h1>Buna </h1>
            <p>Mulțumim că te-ai abonat la newsletter-ul nostru!</p>
            <p>Te vom ține la curent cu cele mai noi oferte și produse disponibile pe site-ul nostru.</p>
            <p>Dacă ai întrebări sau sugestii, nu ezita să ne contactezi.</p>
            <p>Cu drag,</p>
            <p>Buchetul Simonei</p>
          `,
      };

      await transporter.sendMail(mailOptions);

      return NextResponse.json({ success: true, message: 'Email trimis cu succes!' }, { status: 200 });
    } catch (error) {
      console.error('Eroare la trimiterea email-ului:', error);
      return NextResponse.json({ success: false, message: 'Eroare la trimiterea email-ului.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email-ul a fost adăugat cu succes la newsletter' });
  } catch (error) {
    console.log('Eroare la adăugarea email-ului:', error);
    return NextResponse.json({ error: 'Eroare internă a serverului' }, { status: 500 });
  }
}

// DELETE /api/send-email/newsletter
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