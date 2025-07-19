'use server';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import clientPromise from '@/app/components/lib/mongodb';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Configurare nodemailer pentru trimiterea email-urilor
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

// POST /api/users/login/forgot-password
export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email-ul este obligatoriu' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('florarie');
        const usersCollection = db.collection('users');

        // Verificăm dacă utilizatorul există în baza de date
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'Utilizatorul nu există' }, { status: 404 });
        }

        // Generăm un cod de verificare unic
        const verificationCode = crypto.randomInt(100000, 999999).toString();

        // Salvăm codul de verificare în baza de date (opțional, cu un timp de expirare)
        await usersCollection.updateOne(
            { email },
            { $set: { resetCode: verificationCode, resetCodeExpires: Date.now() + 15 * 60 * 1000 } } // Cod valabil 15 minute
        );

        // Trimitem codul de verificare pe email
        await transporter.sendMail({
            from: EMAIL_USER,
            to: email,
            subject: 'Cod de resetare parolă',
            text: `Codul tău de resetare a parolei este: ${verificationCode}`,
        });

        return NextResponse.json({ success: true, message: 'Codul de verificare a fost trimis pe email' });
    } catch (error) {
        console.log('Eroare la trimiterea codului de verificare:', error);
        return NextResponse.json({ success: false, message: 'Eroare internă a serverului' }, { status: 500 });
    }
}