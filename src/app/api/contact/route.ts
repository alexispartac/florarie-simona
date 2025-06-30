'use server';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER || 'simonabuzau2@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'qpqz bneu qlfi ehvc';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

export async function POST(req: NextRequest) {
    try {
        const { first_name, last_name, email, phone_number, message } = await req.json();

        if (!first_name || !last_name || !email || !phone_number || !message) {
            return NextResponse.json({ error: 'Toate câmpurile sunt obligatorii' }, { status: 400 });
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

        return NextResponse.json({ message: 'Email trimis cu succes' });
    } catch (error) {
        console.log('Eroare la trimiterea email-ului:', error);
        return NextResponse.json({ error: 'Eroare internă a serverului' }, { status: 500 });
    }
}