'use client';

import React, { useState, useEffect } from 'react';
import { IconTrash, IconX, IconPlus, IconVideo, IconPhoto } from '@tabler/icons-react';
import { Modal, Button, FileInput, Alert, TextInput, Textarea, Container, Tabs } from '@mantine/core';
import { useUser } from '../components/context/ContextUser';
import { Footer } from '../components/Footer';
import axios from 'axios';
import { Post } from '@/app/models/Posts';
import imageCompression from 'browser-image-compression';

type MediaType = 'image' | 'video';


const AboutUs = () => {
  const { user } = useUser();
  const isAdmin = user?.userInfo?.email === 'laurasimona97@yahoo.com';
  const [media, setMedia] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<Post | null>(null);
  // In your page.tsx, update the fetchMedia function:
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/media/list');
      setMedia(res.data.posts || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching media:', error);
      setError('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = (file: File | null) => {
    if (file) {
      if ((mediaType === 'video' && !file.type.startsWith('video/')) ||
        (mediaType === 'image' && !file.type.startsWith('image/'))) {
        setError(`Te rog selectează un fișier de tip ${mediaType === 'video' ? 'video' : 'imagine'}`);
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const formData = new FormData();

      // Only compress if it's an image
      if (mediaType === 'image') {
        const compressedFile = await imageCompression(selectedFile, {
          maxSizeMB: 5,
          maxWidthOrHeight: 2000,
          useWebWorker: true,
        });
        formData.append('file', compressedFile);
      } else {
        // For videos, append the original file
        formData.append('file', selectedFile);
      }

      formData.append('title', title);
      formData.append('description', description);
      formData.append('isFeatured', String(isFeatured));

      await axios.post('/api/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await fetchMedia();
      setShowUploadModal(false);
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setIsFeatured(false);
    } catch (error) {
      console.error('Error uploading media:', error);
      setError('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete('/api/media/delete',
        {
          data: { publicId }
        }
      );
      await fetchMedia();
    } catch (error) {
      console.error('Error deleting media:', error);
      setError('Failed to delete media');
    }
  };

  const featuredMedia = media.filter(item => item.isFeatured);
  const regularMedia = media.filter(item => !item.isFeatured);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="py-28 px-4 sm:px-6 lg:px-8 flex-grow">
        <Container size="xl" className="max-w-7xl mx-auto">

          {isAdmin && (
            <div className="flex justify-end mb-8">
              <Button
                leftSection={<IconPlus size={18} />}
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Adaugă Media
              </Button>
            </div>
          )}

          {error && (
            <Alert color="red" className="mb-8">
              {error}
            </Alert>
          )}

          {featuredMedia.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recomandările Noastre</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredMedia.map((item) => (
                  <MediaCard
                    key={item.publicId}
                    item={item}
                    isAdmin={isAdmin}
                    onPreview={setPreviewMedia}
                    onDelete={() => handleDelete(item.publicId)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-12">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : regularMedia.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nu există imagini sau videoclipuri de afișat momentan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {regularMedia.map((item) => (
                  <MediaCard
                    key={item.publicId}
                    item={item}
                    isAdmin={isAdmin}
                    onPreview={setPreviewMedia}
                    onDelete={() => handleDelete(item.publicId)}
                  />
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>

      <Modal
        opened={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Încarcă Media"
        size="lg"
        className="[&_.mantine-Modal-title]:text-xl [&_.mantine-Modal-title]:font-semibold"
      >
        <Tabs
          value={mediaType}
          onChange={(value) => {
            setMediaType(value as MediaType);
            setSelectedFile(null);
            setError(null);
          }}
        >
          <Tabs.List>
            <Tabs.Tab
              value="image"
              leftSection={<IconPhoto size={16} />}
            >
              Imagine
            </Tabs.Tab>
            <Tabs.Tab
              value="video"
              leftSection={<IconVideo size={16} />}
            >
              Video
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="image" pt="md">
            <FileInput
              label="Selectează imaginea"
              placeholder="Fă click pentru a încărca"
              accept="image/*"
              onChange={handleFileChange}
              value={mediaType === 'image' ? selectedFile : null}
              className="mb-4"
              error={error && mediaType === 'image' ? error : undefined}
            />
            {selectedFile && mediaType === 'image' && (
              <div className="mt-2 text-sm text-green-600">
                {selectedFile.name} - {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="video" pt="md">
            <FileInput
              label="Selectează videoclipul"
              placeholder="Fă click pentru a încărca"
              accept="video/*"
              onChange={handleFileChange}
              value={mediaType === 'video' ? selectedFile : null}
              className="mb-4"
              error={error && mediaType === 'video' ? error : undefined}
            />
            {selectedFile && mediaType === 'video' && (
              <div className="mt-2 text-sm text-green-600">
                {selectedFile.name} - {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </Tabs.Panel>
        </Tabs>

        <TextInput
          label="Titlu (opțional)"
          placeholder="Titlu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
        />

        <Textarea
          label="Descriere (opțională)"
          placeholder="Descriere"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-6"
          minRows={3}
        />

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUploadModal(false)}
              disabled={uploading}
            >
              Anulează
            </Button>
            <Button
              onClick={handleUpload}
              loading={uploading}
              disabled={!selectedFile || uploading}
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {uploading ? 'Se încarcă...' : 'Încarcă'}
            </Button>
          </div>
        </div>

      </Modal>

      <MediaPreviewModal
        media={previewMedia}
        onClose={() => setPreviewMedia(null)}
      />

      <Footer />
    </div >
  );
};

// Media Card Component
const MediaCard = ({ item, isAdmin, onPreview, onDelete }: { 
  item: Post, 
  isAdmin: boolean, 
  onPreview: (item: Post) => void, 
  onDelete: (id: string) => void
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleVideoClick = (e: React.MouseEvent, item: Post) => {
    e.stopPropagation();
    if (item.resourceType === 'video') {
      const video = document.createElement('video');
      video.src = item.url;
      video.controls = true;
      video.style.width = '90%';
      video.style.height = '90%';
      video.style.maxWidth = '1200px';
      video.style.maxHeight = '80vh';
      video.style.objectFit = 'contain';
      
      const closeButton = document.createElement('button');
      closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
      closeButton.style.position = 'absolute';
      closeButton.style.top = '20px';
      closeButton.style.right = '20px';
      closeButton.style.background = 'rgba(0,0,0,0.7)';
      closeButton.style.border = 'none';
      closeButton.style.borderRadius = '50%';
      closeButton.style.width = '40px';
      closeButton.style.height = '40px';
      closeButton.style.display = 'flex';
      closeButton.style.alignItems = 'center';
      closeButton.style.justifyContent = 'center';
      closeButton.style.cursor = 'pointer';
      closeButton.style.color = 'white';
      closeButton.style.transition = 'all 0.2s ease';
      closeButton.style.zIndex = '1000';
      closeButton.onmouseover = () => {
        closeButton.style.background = 'rgba(255,255,255,0.2)';
      };
      closeButton.onmouseout = () => {
        closeButton.style.background = 'rgba(0,0,0,0.7)';
      };
      
      const videoContainer = document.createElement('div');
      videoContainer.style.position = 'relative';
      videoContainer.style.display = 'flex';
      videoContainer.style.flexDirection = 'column';
      videoContainer.style.alignItems = 'center';
      videoContainer.style.justifyContent = 'center';
      videoContainer.style.width = '100%';
      videoContainer.style.height = '100%';
      videoContainer.style.padding = '20px';
      
      videoContainer.appendChild(video);
      videoContainer.appendChild(closeButton);
      
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100vw';
      container.style.height = '100vh';
      container.style.backgroundColor = 'rgba(0,0,0,0.9)';
      container.style.display = 'flex';
      container.style.justifyContent = 'center';
      container.style.alignItems = 'center';
      container.style.zIndex = '9999';
      container.style.cursor = 'pointer';
      container.style.padding = '20px';
      container.style.boxSizing = 'border-box';
      
      const handleClose = () => {
        if (document.body.contains(container)) {
          document.body.removeChild(container);
          document.removeEventListener('keydown', handleKeyDown);
          document.body.style.overflow = '';
        }
      };
      
      container.onclick = (e) => {
        if (e.target === container) {
          handleClose();
        }
      };
      
      closeButton.onclick = (e) => {
        e.stopPropagation();
        handleClose();
      };
      
      container.appendChild(videoContainer);
      document.body.appendChild(container);
      
      // Add escape key to close
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
    } else {
      onPreview(item);
    }
  };

  return (
    <div className="relative group h-full">
      <div className="h-full flex flex-col bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Media Container */}
        <div 
          className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
          onClick={(e) => handleVideoClick(e, item)}
        >
          {item.resourceType === 'video' ? (
            <div className="relative w-full h-full group/video">
              <video
                src={item.url}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                poster={item.thumbnailUrl || ''}
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm transform group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-sm">
                <div className="flex items-center">
                  <span className="bg-black/50 px-2 py-1 rounded text-xs">Video</span>
                  <span className="ml-auto text-xs bg-black/50 px-2 py-1 rounded">
                    {Math.round((item.duration || 0) / 60)}:{(item.duration || 0) % 60 < 10 ? '0' : ''}{(item.duration || 0) % 60}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <img
              src={item.url}
              alt={item.title || 'Imagine'}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          )}
          
          {/* Admin Actions */}
          {isAdmin && (
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.publicId);
                }}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 backdrop-blur-sm transition-colors"
                aria-label="Delete media"
              >
                <IconTrash className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {item.title && (
            <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
              {item.title}
            </h3>
          )}
          {/* Replace the existing description section with this: */}
          {item.description && (
            <div className="mt-1">
              <p
                className={`text-gray-600 text-sm ${!showFullDescription ? 'line-clamp-3' : ''}`}
              >
                {item.description}
              </p>
              {item.description.length > 100 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullDescription(!showFullDescription);
                  }}
                  className="text-gray-600 hover:text-gray-700 text-[0.3rem] mt-1 inline-block"
                >
                  {showFullDescription ? 'Arata mai putin' : 'Arata mai mult'}
                </button>
              )}
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="inline-flex items-center text-xs text-gray-500">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Media Preview Modal Component
const MediaPreviewModal = ({ media, onClose }: { media: Post | null, onClose: () => void }) => {
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen().catch(console.error);
        setIsFullscreen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (!media) return null;

  return (
    <Modal
      opened={!!media}
      onClose={onClose}
      size="xl"
      withCloseButton={false}
      padding={0}
      fullScreen={isFullscreen}
      transitionProps={{ transition: 'fade', duration: 200 }}
      className="[&_.mantine-Modal-body]:p-0 [&_.mantine-Modal-content]:bg-black/90"
      overlayProps={{
        backgroundOpacity: 0.9,
        blur: 2,
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        <div className="relative w-full h-full max-h-[80vh] md:max-h-[90vh] flex items-center justify-center p-4">
          {media.resourceType === 'image' ? (
            <img
              src={media.url}
              alt={media.title || 'Preview'}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ 
                maxHeight: 'calc(100vh - 120px)',
                width: 'auto',
                height: 'auto'
              }}
            />
          ) : (
            <video
              src={media.url}
              controls
              autoPlay
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              style={{ maxHeight: 'calc(100vh - 120px)' }}
            />
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white transition-all duration-200 hover:scale-110"
          aria-label="Close preview"
        >
          <IconX size={24} />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute bottom-4 right-4 z-10 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white transition-all duration-200 hover:scale-110"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          )}
        </button>

        {/* Media Info (shows on hover) */}
        {(media.title || media.description) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 pt-12 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="max-w-4xl mx-auto text-center">
              {media.title && (
                <h3 className="text-xl font-bold text-white mb-2">{media.title}</h3>
              )}
              {media.description && (
                <p className="text-gray-200 text-sm">{media.description}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AboutUs;