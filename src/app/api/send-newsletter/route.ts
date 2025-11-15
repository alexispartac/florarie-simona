import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import clientPromise from '@/app/components/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { subject, content } = await request.json();
    
    if (!subject || !content) {
      return NextResponse.json(
        { error: "Subiectul și conținutul sunt obligatorii" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("florarie");
    const subscribers = await db.collection("newsletter").find().toArray();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let sentCount = 0;
    const errors: string[] = [];

    for (const subscriber of subscribers) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: subscriber.email,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1>${subject}</h1>
              <div style="margin: 20px 0; line-height: 1.6;">
                ${content.replace(/\n/g, '<br>')}
              </div>
              <hr>
              <p style="color: #666; font-size: 0.9em;">
                Dacă nu doriți să mai primiți acest newsletter, vă puteți dezabona 
                <a href="https://www.buchetul-simonei.com" 
                   style="color: #3b82f6; text-decoration: none;">
                  aici
                </a>.
              </p>
            </div>
          `,
        });
        sentCount++;
      } catch (err) {
        console.error(`Eroare trimitere către ${subscriber.email}:`, err);
        errors.push(subscriber.email);
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent: sentCount,
      failed: errors.length,
      failedEmails: errors
    });

  } catch (error) {
    console.error('Error in newsletter API:', error);
    return NextResponse.json(
      { error: "Eroare internă a serverului" },
      { status: 500 }
    );
  }
}