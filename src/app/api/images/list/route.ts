import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { ProductImageProps } from '../../types';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest) {
  try {
    // Extrage parametrii din URL
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get('folder');
    const limit = searchParams.get('limit') || '10';
    const sortBy = searchParams.get('sortBy') || 'created_at';

    // Construiește expresia de căutare
    let expression = 'resource_type:image';
    if (folder) {
      expression = `folder:${folder}`;
    }

    const result = await cloudinary.search
      .expression(expression)
      .sort_by(sortBy, 'desc')
      .max_results(parseInt(limit))
      .execute();

    const images: ProductImageProps[] = result.resources.map((resource: unknown) => ({
      url: (resource as { secure_url: string }).secure_url,
      public_id: (resource as { public_id: string }).public_id,
      width: (resource as { width: number }).width,
      height: (resource as { height: number }).height,
      format: (resource as { format: string }).format,
      created_at: (resource as { created_at: string }).created_at
    }));

    return NextResponse.json({ 
      images,
      total: result.total_count,
      folder: folder || 'all'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
