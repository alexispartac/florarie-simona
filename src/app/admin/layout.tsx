import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import React from 'react';
import { cookies } from 'next/headers';

const ADMIN_EMAILS = new Set<string>(['laurasimona97@yahoo.com']);

type TokenPayload = {
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('login')?.value;

  if (!token) {
    redirect('/homepage');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    redirect('/homepage');
  }

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;

    const email = decoded?.email;
    const role = decoded?.role;

    const allowed =
      (email && ADMIN_EMAILS.has(email)) ||
      role === 'admin';

    if (!allowed) {
      redirect('/homepage');
    }
  } catch {
    redirect('/homepage');
  }

  return <>{children}</>;
}