// File: src/app/api/media/delete/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import clientPromise from '@/app/components/lib/mongodb';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json();
    console.log(publicId)
    if (!publicId) {
      return NextResponse.json(
        { error: 'Missing publicId parameter' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const cloudinaryResult = await cloudinary.uploader.destroy(publicId);

    if (cloudinaryResult.result === 'not found') {
      return NextResponse.json(
        { error: 'Media not found in Cloudinary' },
        { status: 404 }
      );
    }

    // Delete from MongoDB
    const client = await clientPromise;
    const db = client.db('florarie');
    const deleteResult = await db.collection('posts').deleteOne({ publicId });

    if (deleteResult.deletedCount === 0) {
      console.warn('Media not found in database but deleted from Cloudinary');
    }

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
      data: { cloudinaryResult, dbResult: deleteResult },
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}