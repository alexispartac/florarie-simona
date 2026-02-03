// Create this file at /src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/email';
import { withRateLimit } from '@/lib/rateLimit';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  // Stricter rate limit for contact form: 5 requests per minute
  return withRateLimit(request, async (req) => {
  try {
    const formData: ContactFormData = await req.json();
    
    // Validate required fields
    const requiredFields: Array<keyof ContactFormData> = ['name', 'email', 'subject', 'message'];
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Send the contact form email
    await sendContactFormEmail(formData);

    return NextResponse.json({ 
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you soon.' 
    });
  } catch (error) {
    console.error('Error in contact form submission:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to send message. Please try again later.' 
      },
      { status: 500 }
    );
  }
  }, { limit: 5, windowMs: 60000 }); // 5 requests per minute
}