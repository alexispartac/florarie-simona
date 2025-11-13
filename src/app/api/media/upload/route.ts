import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import clientPromise from '@/app/components/lib/mongodb';
import { Post } from '@/app/models/Posts';
import sharp from 'sharp';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const isFeatured = formData.get('isFeatured') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Optimize and upload to Cloudinary
    const result = await new Promise<Post>((resolve, reject) => {
      sharp(buffer)
        .resize({ width: 2000, withoutEnlargement: true }) // limitează dimensiunea
        .webp({ quality: 80 }) // convertește în WebP și comprimă
        .toBuffer()
        .then((optimizedBuffer) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'florarie-simona/media',
              resource_type: 'image',
              format: 'webp',
            },
            (error, cloudinaryResult) => {
              if (error) {
                reject(error);
                return;
              }

              if (!cloudinaryResult) {
                reject(new Error('No result from Cloudinary upload'));
                return;
              }

              // Map Cloudinary response to Post type
              const post: Post = {
                title,
                description,
                mediaUrl: cloudinaryResult.secure_url,
                mediaType: cloudinaryResult.resource_type as 'image' | 'video',
                publicId: cloudinaryResult.public_id,
                format: cloudinaryResult.format || 'webp',
                width: cloudinaryResult.width,
                height: cloudinaryResult.height,
                duration: cloudinaryResult.duration,
                thumbnailUrl: cloudinaryResult.secure_url,
                isFeatured,
                createdAt: new Date(),
                updatedAt: new Date(),
                resourceType: cloudinaryResult.resource_type,
                url: cloudinaryResult.secure_url,
              };

              resolve(post);
            }
          );

          const readable = new Readable();
          readable._read = () => {};
          readable.push(optimizedBuffer);
          readable.push(null);
          readable.pipe(uploadStream);
        })
        .catch((err) => reject(err));
    });

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db('florarie');
    const collection = db.collection<Post>('posts');
    const insertResult = await collection.insertOne(result);

    return NextResponse.json({ 
      success: true, 
      data: { 
        ...result, 
        _id: insertResult.insertedId 
      } 
    });

  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
