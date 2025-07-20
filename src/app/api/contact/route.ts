'use server';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); 

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    if (!EMAIL_USER || !EMAIL_PASS) {
        return NextResponse.json({ success: false, message: 'Credențialele email-ului nu sunt definite.' }, { status: 500 });
    }
    
    try {
        const { first_name, last_name, email, phone_number, message } = await req.json();

        if (!first_name || !last_name || !email || !phone_number || !message) {
            return NextResponse.json({ success: false, message: 'Toate câmpurile sunt obligatorii' }, { status: 400 });
        }

        const mailOptions = {
            from: EMAIL_USER,
            to: 'simonabuzau2@gmail.com',
            subject: `Mesaj de la ${first_name} ${last_name}`,
            text: `
                Nume: ${first_name} ${last_name}
                Email: ${email}
                Telefon: ${phone_number}
                Mesaj: ${message}
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email trimis cu succes' });
    } catch (error) {
        console.log('Eroare la trimiterea email-ului:', error);
        return NextResponse.json({ success: false, message: 'Eroare internă a serverului' }, { status: 500 });
    }
}