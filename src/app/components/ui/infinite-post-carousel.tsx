"use client";

import { useEffect, useRef, useState } from 'react';
import { Post } from '@/app/models/Posts';
import Image from 'next/image';
import { IconTrash } from '@tabler/icons-react';

interface InfinitePostCarouselProps {
  posts: Post[];
  isAdmin?: boolean;
  onDelete?: (publicId: string) => void;
  onPreview: (post: Post) => void;
}

export function InfinitePostCarousel({ 
  posts, 
  isAdmin = false, 
  onDelete,
  onPreview 
}: InfinitePostCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Duplicate posts for infinite effect
  const duplicatedPosts = [...posts, ...posts];

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollAmount = 1;
    let scrollPosition = 0;
    let animationId: number;

    const scroll = () => {
      if (!hovered) {
        scrollPosition += scrollAmount;
        if (scrollPosition >= container.scrollWidth / 2) {
          scrollPosition = 0;
        }
        container.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [hovered]);

  const handleVideoClick = (e: React.MouseEvent, item: Post) => {
    e.stopPropagation();
    onPreview(item);
  };

  return (
    <div 
      className="relative w-full overflow-hidden py-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div 
        ref={containerRef}
        className="flex gap-6 w-max"
        style={{
          scrollBehavior: hovered ? 'smooth' : 'auto',
        }}
      >
        {duplicatedPosts.map((post, index) => (
          <div 
            key={`${post._id}-${index}`}
            className="w-[300px] flex-shrink-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={(e) => handleVideoClick(e, post)}
          >
            <div className="relative aspect-square overflow-hidden group">
              {post.mediaType === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    src={post.url}
                    className="w-full h-full object-cover"
                    poster={post.thumbnailUrl || ''}
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <div className="w-16 h-16 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center backdrop-blur-sm transform group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {post.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {Math.floor((post.duration || 0) / 60)}:{((post.duration || 0) % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
              ) : (
                <Image
                  src={post.url}
                  alt={post.title || 'Post image'}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}

              {isAdmin && onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(post.publicId);
                  }}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete post"
                >
                  <IconTrash size={16} />
                </button>
              )}
            </div>

            <div className="p-4">
              {post.title && (
                <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                  {post.title}
                </h3>
              )}
              {post.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {post.description}
                </p>
              )}
              <div className="mt-3 pt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                {new Date(post.createdAt).toLocaleDateString('ro-RO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}