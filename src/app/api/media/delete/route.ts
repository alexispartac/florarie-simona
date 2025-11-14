import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import clientPromise from '@/app/components/lib/mongodb';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface DeleteRequest {
  publicId: string;
}

export async function DELETE(request: NextRequest) {
  // Check if request has a body
  if (!request.body) {
    return NextResponse.json(
      { success: false, error: 'Request body is required' },
      { status: 400 }
    );
  }

  try {
    // Parse and validate request body
    let requestBody: DeleteRequest;
    try {
      requestBody = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error },
        { status: 400 }
      );
    }

    const { publicId } = requestBody;
    
    // Validate publicId
    if (!publicId || typeof publicId !== 'string' || publicId.trim() === '') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid publicId. Must be a non-empty string.' 
        },
        { status: 400 }
      );
    }

    // Sanitize publicId to prevent potential security issues
    const sanitizedPublicId = publicId.replace(/[^\w\-\/]/g, '');
    
    try {
      // First get the resource type to determine the correct resource type
      let resourceType: 'image' | 'video' | 'raw' = 'image';
      try {
        // First try with image type
        try {
          await cloudinary.api.resource(sanitizedPublicId, { resource_type: 'image' });
          resourceType = 'image';
        } catch (imageError) {
          // If not found as image, try with video type
          try {
            await cloudinary.api.resource(sanitizedPublicId, { resource_type: 'video' });
            resourceType = 'video';
          } catch (videoError) {
            // If not found as video, try with raw type
            try {
              await cloudinary.api.resource(sanitizedPublicId, { resource_type: 'raw' });
              resourceType = 'raw';
            } catch (rawError) {
              console.warn('Could not determine resource type, defaulting to image', { imageError, videoError, rawError });
            }
          }
        }
      } catch (error) {
        console.warn('Error determining resource type, defaulting to image', error);
      }

      // Delete from Cloudinary with proper resource type
      const cloudinaryResult = await cloudinary.uploader.destroy(
        sanitizedPublicId,
        {
          resource_type: resourceType,
          invalidate: true // Optional: invalidate CDN cache
        }
      );

      if (cloudinaryResult.result === 'not found') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Media not found in Cloudinary',
            publicId: sanitizedPublicId
          },
          { status: 404 }
        );
      }

      // Delete from MongoDB
      const client = await clientPromise;
      const db = client.db('florarie');
      const deleteResult = await db.collection('posts').deleteOne({ 
        publicId: sanitizedPublicId 
      });

      if (deleteResult.deletedCount === 0) {
        console.warn(`Media with publicId ${sanitizedPublicId} not found in database but was deleted from Cloudinary`);
      }

      return NextResponse.json({
        success: true,
        message: 'Media deleted successfully',
        data: { 
          cloudinaryResult: {
            result: cloudinaryResult.result,
            // Only include non-sensitive data in the response
            ...(cloudinaryResult.result === 'ok' ? { 
              deleted: true,
              resourceType: cloudinaryResult.resource_type 
            } : {})
          },
          dbDeleted: deleteResult.deletedCount > 0
        },
      });
      
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete media from Cloudinary',
          details: process.env.NODE_ENV === 'development' 
            ? (cloudinaryError as Error).message 
            : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in DELETE /api/media/delete:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}