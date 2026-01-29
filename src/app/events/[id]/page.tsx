'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvent, useLikeEvent, useShareEvent } from '@/hooks/useEvents';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Heart, Share2, ArrowLeft, Sparkles, Play, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Event, EventMedia } from '@/types/events';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [userId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      let storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('userId', storedUserId);
      }
      return storedUserId;
    }
    return '';
  });

  const [selectedMedia, setSelectedMedia] = useState<{ mediaIndex: number } | null>(null);

  const { data: event, isLoading, error } = useEvent(eventId);
  const likeMutation = useLikeEvent();
  const shareMutation = useShareEvent();

  const handleLike = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!userId || !event) return;

    try {
      await likeMutation.mutateAsync({ eventId: event.eventId, userId });
    } catch (error) {
      console.error('Error liking event:', error);
      alert('Failed to like event. Please try again.');
    }
  };

  const handleShare = async () => {
    if (!event) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
        await shareMutation.mutateAsync(event.eventId);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
        await shareMutation.mutateAsync(event.eventId);
      }
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const hasUserLiked = (event: Event) => {
    return event.likedBy?.includes(userId) || false;
  };

  const openMediaModal = (mediaIndex: number) => {
    setSelectedMedia({ mediaIndex });
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (!selectedMedia || !event) return;
    const mediaCount = event.media.length;
    let newIndex = selectedMedia.mediaIndex;

    if (direction === 'prev') {
      newIndex = newIndex === 0 ? mediaCount - 1 : newIndex - 1;
    } else {
      newIndex = newIndex === mediaCount - 1 ? 0 : newIndex + 1;
    }

    setSelectedMedia({ mediaIndex: newIndex });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--primary-background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[var(--primary-background)] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">Event Not Found</h1>
          <p className="text-[var(--muted-foreground)] mb-6">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link
            href="/events"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--hover-primary)]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Back Button */}
      <div className="bg-[var(--card)] border-b border-[var(--border)] my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/events')}
            className="inline-flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Înapoi la Evenimente
          </button>
        </div>
      </div>

      {/* Event Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[var(--card)] rounded-lg shadow-lg overflow-hidden border border-[var(--border)]">
          {/* Header */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">{event.title}</h1>
                  {event.featured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-[var(--accent)] text-[var(--accent-foreground)]">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Featured
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      event.eventType === 'upcoming' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-[var(--secondary)] text-[var(--foreground)]'
                    }`}
                  >
                    {event.eventType === 'upcoming' ? 'Viitor' : 'Trecut'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)] mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {formatDate(event.eventDate)}
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      {event.location}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[var(--foreground)] text-lg leading-relaxed whitespace-pre-line mb-6">{event.description}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-6 border-t border-[var(--border)]">
              <button
                onClick={(e) => handleLike(e)}
                disabled={likeMutation.isPending || !userId}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  hasUserLiked(event)
                    ? 'bg-[var(--destructive)]/10 text-[var(--destructive)] hover:bg-[var(--destructive)]/20'
                    : 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--accent)]'
                }`}
                title={!userId ? 'Loading...' : hasUserLiked(event) ? 'Unlike' : 'Like'}
              >
                <Heart className={`h-6 w-6 ${hasUserLiked(event) ? 'fill-current' : ''} ${likeMutation.isPending ? 'animate-pulse' : ''}`} />
                <span className="font-medium text-lg">{event.likes || 0}</span>
              </button>

              <button
                onClick={handleShare}
                disabled={shareMutation.isPending}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Share2 className={`h-6 w-6 ${shareMutation.isPending ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>

          {/* Media Gallery */}
          {event.media && event.media.length > 0 && (
            <div className="px-8 pb-8">
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Galerie</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.media.map((media: EventMedia, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => openMediaModal(index)}
                  >
                    {media.type === 'image' ? (
                      <Image src={media.url} alt={media.caption || event.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <div className="relative w-full h-full bg-black/90 flex items-center justify-center">
                        <Play className="h-12 w-12 text-[var(--primary-foreground)] absolute z-10" />
                        {media.thumbnail && <Image src={media.thumbnail} alt={media.caption || event.title} fill className="object-cover opacity-70" />}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Media Modal */}
      {selectedMedia && event.media && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <button onClick={closeMediaModal} className="absolute top-4 right-4 p-2 text-[var(--primary-foreground)] hover:bg-[var(--card)]/10 rounded-full transition-colors">
            <X className="h-8 w-8" />
          </button>

          {event.media.length > 1 && (
            <>
              <button onClick={() => navigateMedia('prev')} className="absolute left-4 p-2 text-[var(--primary-foreground)] hover:bg-[var(--card)]/10 rounded-full transition-colors">
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button onClick={() => navigateMedia('next')} className="absolute right-4 p-2 text-[var(--primary-foreground)] hover:bg-[var(--card)]/10 rounded-full transition-colors">
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-[90vh] w-full p-4">
            {event.media[selectedMedia.mediaIndex].type === 'image' ? (
              <div className="relative w-full h-[80vh]">
                <Image src={event.media[selectedMedia.mediaIndex].url} alt={event.media[selectedMedia.mediaIndex].caption || event.title} fill className="object-contain" />
              </div>
            ) : (
              <video src={event.media[selectedMedia.mediaIndex].url} controls autoPlay className="w-full h-[80vh] object-contain" />
            )}
            {event.media[selectedMedia.mediaIndex].caption && <p className="text-[var(--primary-foreground)] text-center mt-4">{event.media[selectedMedia.mediaIndex].caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
