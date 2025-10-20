import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Delete a folder based on folder name sent in request body
export async function DELETE(req: NextRequest) {
  try {
    const { id: folderName } = await req.json();
    console.log('Folder to delete:', folderName);
    
    if (!folderName) {
      return NextResponse.json({ error: 'No folder name provided' }, { status: 400 });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary configuration missing');
      return NextResponse.json({ error: 'Cloudinary configuration missing' }, { status: 500 });
    }

    let resourcesDeleted = false;
    let folderDeleted = false;

    // First, delete all resources in the folder
    try {
      const deleteResourcesResult = await cloudinary.api.delete_resources_by_prefix(`Home/${folderName}/`);
      console.log(`Resources in folder Home/${folderName}/ deleted:`, deleteResourcesResult);
      resourcesDeleted = true;
    } catch (resourceError) {
      console.log('Error deleting resources:', resourceError);
    }

      // Try to delete the folder (might already be deleted if it was empty)
    try {
        const result = await cloudinary.api.delete_folder(`Home/${folderName}`);
        console.log('Delete folder result:', result);

        if (result.result === 'ok') {
            folderDeleted = true;
        }
    } catch (folderError) {
        console.log('Folder deletion error:', folderError);
    }

    // Consider it successful if resources were deleted (folder cleanup is automatic)
    if (resourcesDeleted || folderDeleted) {
      return NextResponse.json({ 
        message: 'Folder and resources deleted successfully',
        folderName: folderName,
        resourcesDeleted,
        folderDeleted: folderDeleted || resourcesDeleted // Auto-deleted when empty
      }, { status: 200 });
    } else {
      return NextResponse.json({ 
        error: 'Failed to delete folder or resources',
        folderName: folderName 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error deleting folder:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: 'Failed to delete folder',
        message: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}