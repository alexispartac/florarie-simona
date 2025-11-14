import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import sharp from 'sharp';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process the image and upload to Cloudinary
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Create a promise that resolves with the upload result
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder || 'florarie-uploads',
          resource_type: 'image',
          format: 'webp',
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          if (!result) {
            reject(new Error('No result from Cloudinary upload'));
            return;
          }
          resolve(result);
        }
      );

      // Create a readable stream from buffer and pipe it to the upload stream
      const readable = new Readable();
      readable._read = () => {};
      readable.push(optimizedBuffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });

    // Return the upload result
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    }, { status: 200 });
    }
    catch (error) {
      console.error('Error uploading file:', error);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }
}
