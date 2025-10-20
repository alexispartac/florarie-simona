import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }

    // Extrage public_id din URL-ul Cloudinary
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = filename.split('.')[0]; // elimină extensia
    
    // Dacă imaginea este într-un folder, include și folder-ul
    const folderIndex = urlParts.findIndex((part: string) => part === 'upload');
    if (folderIndex !== -1 && folderIndex + 2 < urlParts.length) {
      const folderParts = urlParts.slice(folderIndex + 2, -1);
      const fullPublicId = [...folderParts, publicId].join('/');
      
      const result = await cloudinary.uploader.destroy(fullPublicId);
      
      if (result.result === 'ok') {
        return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
      } else {
        return NextResponse.json({ error: 'Failed to delete image' }, { status: 400 });
      }
    }

    // Fallback pentru imagini fără folder
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}