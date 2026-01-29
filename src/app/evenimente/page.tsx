'use client';

import { useState } from 'react';
import { useEvents, useLikeEvent, useShareEvent } from '@/hooks/useEvents';
import Image from 'next/image';
import { Calendar, MapPin, Heart, Share2, Search, Sparkles, Play, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Event } from '@/types/events';

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [userId] = useState<string>(() => {
    // Initialize userId on mount
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
  const [selectedMedia, setSelectedMedia] = useState<{ event: Event; mediaIndex: number } | null>(null);

  const { data, isLoading } = useEvents({
    page: 1,
    limit: 50,
    search: searchQuery,
    eventType: eventTypeFilter === 'all' ? undefined : eventTypeFilter,
    published: true,
  });

  const likeMutation = useLikeEvent();
  const shareMutation = useShareEvent();

  const events = data?.data || [];

  const handleLike = async (eventId: string, e?: React.MouseEvent) => {
    // Prevent event bubbling
    if (e) {
      e.stopPropagation();
    }

    if (!userId) {
      alert('Please wait, loading user session...');
      return;
    }
    
    console.log('Attempting to like event:', eventId, 'User:', userId);
    
    try {
      const result = await likeMutation.mutateAsync({ eventId, userId });
      console.log('Like result:', result);
    } catch (error) {
      console.error('Error liking event:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown } };
        console.error('Error response:', axiosError.response?.data);
      }
      alert('Failed to like event. Please try again.');
    }
  };

  const handleShare = async (event: Event) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.origin + `/evenimente`,
        });
        // Increment share count
        await shareMutation.mutateAsync(event.eventId);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.origin + `/evenimente`);
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

  const openMediaModal = (event: Event, mediaIndex: number) => {
    setSelectedMedia({ event, mediaIndex });
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (!selectedMedia) return;
    const mediaCount = selectedMedia.event.media.length;
    let newIndex = selectedMedia.mediaIndex;
    
    if (direction === 'prev') {
      newIndex = newIndex === 0 ? mediaCount - 1 : newIndex - 1;
    } else {
      newIndex = newIndex === mediaCount - 1 ? 0 : newIndex + 1;
    }
    
    setSelectedMedia({ ...selectedMedia, mediaIndex: newIndex });
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <div 
        className="bg-[var(--secondary)] relative overflow-hidden"
        style={{
          backgroundImage: 'url(/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/25 via-[var(--primary)]/15 to-[var(--primary)]/30"
          style={{ backgroundBlendMode: 'overlay' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--primary-foreground)] drop-shadow-lg">
              Evenimente
            </h1>
            <p className="text-lg md:text-xl text-[var(--primary-foreground)]/95 max-w-2xl mx-auto drop-shadow-md">
              Descoperiți momentele noastre speciale și evenimentele viitoare
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[var(--card)] rounded-lg shadow-sm p-6 border border-[var(--border)]">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[var(--muted-foreground)]" />
              </div>
              <input
                type="text"
                placeholder="Caută evenimente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 py-2 w-full border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--card)] text-[var(--foreground)]"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value as 'all' | 'upcoming' | 'past')}
                className="px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--card)] text-[var(--foreground)]"
              >
                <option value="all">Toate Evenimentele</option>
                <option value="upcoming">Viitoare</option>
                <option value="past">Trecute</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-8">
            {events.map((event) => (
              <div
                key={event.eventId}
                className="bg-[var(--card)] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-[var(--border)]"
              >
                {/* Event Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold text-[var(--foreground)]">{event.title}</h2>
                        {event.featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-[var(--accent)] text-[var(--accent-foreground)]">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Featured
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          event.eventType === 'upcoming' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-[var(--secondary)] text-[var(--foreground)]'
                        }`}>
                          {event.eventType === 'upcoming' ? 'Viitor' : 'Trecut'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)] mb-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(event.eventDate)}
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </div>
                        )}
                      </div>

                      <p className="text-[var(--foreground)] leading-relaxed whitespace-pre-line">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Media Gallery */}
                  {event.media && event.media.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                      {event.media.map((media, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => openMediaModal(event, index)}
                        >
                          {media.type === 'image' ? (
                            <Image
                              src={media.url}
                              alt={media.caption || event.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="relative w-full h-full bg-black/90 flex items-center justify-center">
                              <Play className="h-12 w-12 text-[var(--primary-foreground)] absolute z-10" />
                              {media.thumbnail && (
                                <Image
                                  src={media.thumbnail}
                                  alt={media.caption || event.title}
                                  fill
                                  className="object-cover opacity-70"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
                    <button
                      onClick={(e) => handleLike(event.eventId, e)}
                      disabled={likeMutation.isPending || !userId}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        hasUserLiked(event)
                          ? 'bg-[var(--destructive)]/10 text-[var(--destructive)] hover:bg-[var(--destructive)]/20'
                          : 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--accent)]'
                      }`}
                      title={!userId ? 'Loading...' : hasUserLiked(event) ? 'Unlike' : 'Like'}
                    >
                      <Heart className={`h-5 w-5 ${hasUserLiked(event) ? 'fill-current' : ''} ${likeMutation.isPending ? 'animate-pulse' : ''}`} />
                      <span className="font-medium">{event.likes || 0}</span>
                    </button>

                    <button
                      onClick={() => handleShare(event)}
                      disabled={shareMutation.isPending}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Share2 className={`h-5 w-5 ${shareMutation.isPending ? 'animate-pulse' : ''}`} />
                      <span className="font-medium">{event.shares || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--card)] rounded-lg shadow-sm p-12 text-center border border-[var(--border)]">
            <Calendar className="mx-auto h-16 w-16 text-[var(--muted-foreground)] mb-4" />
            <h3 className="text-xl font-medium text-[var(--foreground)] mb-2">
              Nu există evenimente
            </h3>
            <p className="text-[var(--muted-foreground)]">
              {searchQuery ? 'Încearcă să modifici filtrele' : 'Revino curând pentru evenimente noi'}
            </p>
          </div>
        )}
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <button
            onClick={closeMediaModal}
            className="absolute top-4 right-4 p-2 text-[var(--primary-foreground)] hover:bg-[var(--card)]/10 rounded-full transition-colors"
          >
            <X className="h-8 w-8" />
          </button>

          {selectedMedia.event.media.length > 1 && (
            <>
              <button
                onClick={() => navigateMedia('prev')}
                className="absolute left-4 p-2 text-[var(--primary-foreground)] hover:bg-[var(--card)]/10 rounded-full transition-colors"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={() => navigateMedia('next')}
                className="absolute right-4 p-2 text-[var(--primary-foreground)] hover:bg-[var(--card)]/10 rounded-full transition-colors"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-[90vh] w-full p-4">
            {selectedMedia.event.media[selectedMedia.mediaIndex].type === 'image' ? (
              <div className="relative w-full h-[80vh]">
                <Image
                  src={selectedMedia.event.media[selectedMedia.mediaIndex].url}
                  alt={selectedMedia.event.media[selectedMedia.mediaIndex].caption || selectedMedia.event.title}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <video
                src={selectedMedia.event.media[selectedMedia.mediaIndex].url}
                controls
                autoPlay
                className="w-full h-[80vh] object-contain"
              />
            )}
            {selectedMedia.event.media[selectedMedia.mediaIndex].caption && (
              <p className="text-[var(--primary-foreground)] text-center mt-4">
                {selectedMedia.event.media[selectedMedia.mediaIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
