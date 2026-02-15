import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { StoreSettings, UpdateStoreSettingsRequest } from '@/types/store-settings';
import { WithId } from 'mongodb';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'store_settings';
const SETTINGS_ID = 'default'; // Single settings document

// GET - Fetch store settings
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let settings = await db.collection(COLLECTION).findOne({
      settingsId: SETTINGS_ID,
    });

    // If no settings exist, create default settings (store open by default)
    if (!settings) {
      const defaultSettings: StoreSettings = {
        settingsId: SETTINGS_ID,
        isOpen: true,
        updatedAt: new Date(),
      };

      await db.collection(COLLECTION).insertOne(defaultSettings);
      settings = defaultSettings as unknown as WithId<Document>;
    }

    return NextResponse.json(settings as unknown as StoreSettings, { status: 200 });
  } catch (error) {
    console.error('Error fetching store settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch store settings' },
      { status: 500 }
    );
  }
}

// PUT - Update store settings
export async function PUT(request: NextRequest) {
  try {
    const body: UpdateStoreSettingsRequest = await request.json();
    const { isOpen, closureReason, closureMessage, scheduledOpenTime } = body;

    // Validation
    if (typeof isOpen !== 'boolean') {
      return NextResponse.json(
        { error: 'isOpen must be a boolean value' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Build update object
    const updateData: Partial<StoreSettings> = {
      isOpen,
      updatedAt: new Date(),
    };

    // Only add closure details if store is being closed
    if (!isOpen) {
      if (closureReason) {
        updateData.closureReason = closureReason.trim();
      }
      if (closureMessage) {
        updateData.closureMessage = closureMessage.trim();
      }
      if (scheduledOpenTime) {
        updateData.scheduledOpenTime = new Date(scheduledOpenTime);
      }
    } else {
      // Clear closure details when store is opened
      updateData.closureReason = undefined;
      updateData.closureMessage = undefined;
      updateData.scheduledOpenTime = undefined;
    }

    // Update or create settings
    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { settingsId: SETTINGS_ID },
      { 
        $set: updateData,
        $setOnInsert: { settingsId: SETTINGS_ID }
      },
      { 
        upsert: true, 
        returnDocument: 'after' 
      }
    );

    // If result.value is null, fetch the newly created document
    let settings = result?.value as unknown as StoreSettings | null;
    if (!settings) {
      settings = (await db.collection(COLLECTION).findOne({
        settingsId: SETTINGS_ID,
      })) as unknown as StoreSettings | null;
    }

    return NextResponse.json(
      { 
        message: `Store ${isOpen ? 'opened' : 'closed'} successfully`,
        settings 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating store settings:', error);
    return NextResponse.json(
      { error: 'Failed to update store settings' },
      { status: 500 }
    );
  }
}
