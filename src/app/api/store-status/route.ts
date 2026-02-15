import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'store_settings';
const SETTINGS_ID = 'default';

// GET - Check if store is open (public endpoint)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const settings = await db.collection(COLLECTION).findOne({
      settingsId: SETTINGS_ID,
    });

    // If no settings exist, assume store is open by default
    const isOpen = settings?.isOpen ?? true;
    const closureMessage = settings?.closureMessage;
    const scheduledOpenTime = settings?.scheduledOpenTime;

    return NextResponse.json({
      isOpen,
      closureMessage,
      scheduledOpenTime,
    }, { status: 200 });
  } catch (error) {
    console.error('Error checking store status:', error);
    // On error, return store as open to avoid blocking customers
    return NextResponse.json({
      isOpen: true,
    }, { status: 200 });
  }
}
