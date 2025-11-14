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
    const isVideo = file.type.startsWith('video/');

    const uploadToCloudinary = (): Promise<Post> => {
      return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'florarie-simona/media',
            resource_type: isVideo ? 'video' : 'image',
            ...(isVideo ? {} : { format: 'webp' }),
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

            const post: Post = {
              title,
              description,
              mediaUrl: cloudinaryResult.secure_url,
              mediaType: isVideo ? 'video' : 'image',
              publicId: cloudinaryResult.public_id,
              format: isVideo ? cloudinaryResult.format : 'webp',
              width: cloudinaryResult.width,
              height: cloudinaryResult.height,
              duration: cloudinaryResult.duration,
              thumbnailUrl: isVideo 
                ? cloudinaryResult.secure_url.replace(/\.(mp4|mov|avi|webm)$/, '.jpg') 
                : cloudinaryResult.secure_url,
              isFeatured,
              createdAt: new Date(),
              updatedAt: new Date(),
              resourceType: cloudinaryResult.resource_type,
              url: cloudinaryResult.secure_url,
            };

            resolve(post);
          }
        );

        if (isVideo) {
          // For videos, just pipe the buffer directly
          const readable = new Readable();
          readable._read = () => {};
          readable.push(buffer);
          readable.push(null);
          readable.pipe(uploadStream);
        } else {
          // For images, use sharp for optimization
          sharp(buffer)
            .resize({ width: 2000, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer()
            .then(optimizedBuffer => {
              const readable = new Readable();
              readable._read = () => {};
              readable.push(optimizedBuffer);
              readable.push(null);
              readable.pipe(uploadStream);
            })
            .catch(reject);
        }
      });
    };

    const result = await uploadToCloudinary();

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
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Failed to upload media', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
