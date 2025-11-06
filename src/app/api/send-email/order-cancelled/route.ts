'use server';
import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import type { OrderPropsAdmin } from '@/app/types/order';
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
    const { order } : { order: OrderPropsAdmin } = await req.json();
    
    // Verifică dacă toate câmpurile necesare pentru comandă sunt prezente
    if(order.orderNumber === undefined || !order.orderDate || !order.status || !order.paymentMethod || order.totalPrice === undefined || !order.products) {
        return NextResponse.json(
        { success: false, message: 'Missing required order fields.' },
        { status: 400 }
      );
    }

    // Verifică dacă email-ul clientului este valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(order.clientEmail)) {
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

    // Conținutul email-ului cu comanda anulata
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.clientEmail,
      subject: 'Comanda ta a fost anulata',
      html: `
        <h2>Salut ${order.clientName},</h2>
        <p>Comanda ta cu numarul <strong>#${order.orderNumber}</strong> a fost anulata.</p>
        <p>Daca ai intrebari sau nelamuriri, nu ezita sa ne contactezi!</p>
        <p>Gasiti la finalul acestui email datele de contact</p>
        <h3>Detalii Comanda:</h3>
        <ul>
          <li><strong>Data Comenzii:</strong> ${new Date(order.orderDate).toLocaleDateString()}</li>
          <li><strong>Status:</strong> ${order.status}</li>
          <li><strong>Metoda de Plata:</strong> ${order.paymentMethod === 'ramburs' ? 'Ramburs' : 'Card'}</li>
          <li><strong>Total Plata:</strong> ${order.totalPrice.toFixed(2)} RON</li>
        </ul>
        <h3>Produse Comandate:</h3>
        <ul>
          ${order.products.map(product => `
            <li>
              ${product.title} - Cantitate: ${product.quantity} - Pret unitar: ${product.price.toFixed(2)} RON
            </li>
          `).join('')}
        </ul>
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