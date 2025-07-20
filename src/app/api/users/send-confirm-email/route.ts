'use server';
import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import dotenv from 'dotenv';
dotenv.config();


export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return NextResponse.json({ success: false, message: 'Email configuration is not set.' }, { status: 500 });
  }

  try {
    const { clientEmail, clientName} = await req.json();

    // Verifică dacă toate câmpurile necesare sunt prezente
    if (!clientEmail || !clientName ) {
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
      subject: 'Confirmare Creare const pe site-ul - Buchetul Simonei',
      html: `
        <h1>Salut ${clientName},</h1>
        <p>Mulțumim că te-ai înregistrat pe site-ul nostru!</p>
        <p>Poti incepe cuparaturile accesând următorul link:</p>
        <p><a href="https://buchetul-simonei.com">Buchetul Simonei</a></p>
        <p>Te rugăm să reții că acest email este doar o confirmare a înregistrării tale</p>
        <p>Dacă ai întrebări sau ai nevoie de ajutor, nu ezita să ne contactezi.</p>
        <p>De asemenea, dacă nu ai solicitat această înregistrare, te rug să ignori acest email.</p>
        <br />
        <p>Cu drag,</p>
        <p>Echipa Buchetul Simonei</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email trimis cu succes!' }, { status: 200 });
  } catch (error) {
    console.error('Eroare la trimiterea email-ului:', error);
    return NextResponse.json({ success: false, message: 'Eroare la trimiterea email-ului.' }, { status: 500 });
  }
}