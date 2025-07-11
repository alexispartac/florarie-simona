'use server';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { clientEmail, clientName, orderDetails, totalPrice } = await req.json();

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
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email trimis cu succes!' });
  } catch (error) {
    console.error('Eroare la trimiterea email-ului:', error);
    return NextResponse.json({ message: 'Eroare la trimiterea email-ului.' }, { status: 500 });
  }
}