'use server';
import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return NextResponse.json({ success: false, message: 'Email configuration is not set.' }, { status: 500 });
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

  try {
    const { clientEmail, clientName, orderDetails, totalPrice } = await req.json();

    // Verifică dacă toate câmpurile necesare sunt prezente
    if (!clientEmail || !clientName || !orderDetails || !totalPrice) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // Verifică dacă email-ul clientului este valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return NextResponse.json(
        { success: false, message: 'Email invalid.' },
        { status: 400 }
      );
    }
    // Verifică dacă detaliile comenzii sunt valide
    if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Detaliile comenzii sunt invalide.' },
        { status: 400 }
      );
    }

    // Verifică dacă prețul total este un număr valid
    if (typeof totalPrice !== 'number' || totalPrice <= 0) {
      return NextResponse.json(
        { success: false, message: 'Prețul total este invalid.' },
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
      to: clientEmail,
      subject: 'Confirmare Comandă - Buchetul Simonei',
      html: `
        <h1>Mulțumim pentru comandă, ${clientName}!</h1>
        <p>Detalii comandă:</p>
        <ul>
          ${orderDetails
            .map(
              (item: { title: string; quantity: number; price: number }) =>
                `<li>${item.title} - Cantitate: ${item.quantity} - Preț: ${item.price} RON</li>`
            )
            .join('')}
        </ul>
        <p><strong>Total: ${totalPrice} RON</strong></p>
        <p>Comanda dumneavoastră va fi procesată în cel mai scurt timp posibil.</p>
        <p>Vă rugăm să verificați detaliile comenzii și să ne contactați dacă aveți întrebări.</p>
        <p>Pentru orice întrebări sau nelămuriri, nu ezitați să ne contactați la <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.</p>

        <p>Vă mulțumim că ați ales Buchetul Simonei!</p>
        <p>Daca ai intrebari sau nelamuriri, nu ezita sa ne contactezi!</p>
        <p>Email: ${process.env.EMAIL_USER}</p>
        <p>Telefon: 0769 141 250</p>
        <p>Multumim pentru increderea acordata!</p>
        <p>Cu stima,<br/>Echipa Florarie Simona</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email trimis cu succes!' }, { status: 200 });
  } catch (error) {
    console.error('Eroare la trimiterea email-ului:', error);
    return NextResponse.json({ success: false, message: 'Eroare la trimiterea email-ului.' }, { status: 500 });
  }
}