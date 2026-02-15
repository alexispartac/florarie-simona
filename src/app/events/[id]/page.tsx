'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvent, useLikeEvent, useShareEvent } from '@/hooks/useEvents';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Heart, Share2, ArrowLeft, Sparkles, Play, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Event, EventMedia } from '@/types/events';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { language } = useLanguage();
  const t = useTranslation(language);

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const { data: event, isLoading, error } = useEvent(eventId);
  const likeMutation = useLikeEvent();
  const shareMutation = useShareEvent();

  useEffect(() => {
    if (showShareToast) {
      const timer = setTimeout(() => setShowShareToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showShareToast]);

  const handleLike = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!userId || !event) return;

    try {
      await likeMutation.mutateAsync({ eventId: event.eventId, userId });
    } catch (error) {
      console.error('Error liking event:', error);
      alert(t('events.failedToLike'));
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
        setShowShareToast(true);
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
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">{t('events.notFound')}</h1>
          <p className="text-[var(--muted-foreground)] mb-6">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link
            href="/events"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--hover-primary)]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('events.backToEvents')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Hero Image Section */}
      {event.media && event.media.length > 0 && event.media[0].type === 'image' && (
        <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden mt-16">
          <Image 
            src={event.media[0].url} 
            alt={event.title} 
            fill 
            priority
            className={`object-cover transition-all duration-700 ${imageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-background)] via-black/40 to-transparent" />
          
          {/* Floating Back Button */}
          <div className="absolute top-6 left-4 md:left-8 z-10">
          <Button
            onClick={() => router.push('/events')}
            variant="outline"
            >
              <ArrowLeft className="h-5 w-5 text-[var(--foreground)] group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium text-[var(--foreground)] hidden md:inline">{t('events.backToEvents')}</span>
          </Button>
        </div>

          {/* Badges Overlay */}
          <div className="absolute top-6 right-4 md:right-8 flex flex-col gap-2 z-10">
            {event.featured && (
              <Badge variant="info" className="shadow-lg backdrop-blur-sm bg-[var(--accent)]/90">
                <Sparkles className="h-3 w-3 mr-1" />
                {t('events.featured')}
              </Badge>
            )}
            <Badge
              variant={event.eventType === 'upcoming' ? 'default' : 'secondary'}
              className="shadow-lg backdrop-blur-sm"
            >
              {event.eventType === 'upcoming' ? t('events.upcoming') : t('events.past')}
            </Badge>
      </div>

          {/* Title Overlay at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl mb-4 animate-slide-down">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90 drop-shadow-lg">
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">{formatDate(event.eventDate)}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <MapPin className="h-5 w-5" />
                    <span className="text-sm font-medium">{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* No Hero Image Fallback */}
        {(!event.media || event.media.length === 0 || event.media[0].type !== 'image') && (
          <div className="mb-8">
            <button
              onClick={() => router.push('/events')}
              className="inline-flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-6 group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('events.backToEvents')}
            </button>
            <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">{event.title}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  {event.featured && (
                    <Badge variant="info">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {t('events.featured')}
                    </Badge>
                  )}
                  <Badge variant={event.eventType === 'upcoming' ? 'default' : 'secondary'}>
                    {event.eventType === 'upcoming' ? t('events.upcoming') : t('events.past')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-[var(--card)] rounded-xl shadow-md border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="bg-gradient-to-r from-[var(--primary)]/10 via-[var(--accent)]/50 to-transparent px-6 md:px-8 py-4 border-b border-[var(--border)]">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-[var(--primary)] rounded-full group-hover:h-10 transition-all"></span>
                  <span>Despre eveniment</span>
                </h2>
              </div>
              <div className="px-6 md:px-8 py-6 md:py-8">
                <p className="text-[var(--foreground)]/90 text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Media Gallery */}
            {event.media && event.media.length > 0 && (
              <div className="bg-[var(--card)] rounded-xl shadow-md border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="bg-gradient-to-r from-[var(--primary)]/10 via-[var(--accent)]/50 to-transparent px-6 md:px-8 py-4 border-b border-[var(--border)]">
                  <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-[var(--primary)] rounded-full group-hover:h-10 transition-all"></span>
                    <span>Galerie foto & video</span>
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2 ml-7">
                    {event.media.length} {event.media.length === 1 ? 'fișier' : 'fișiere'} multimedia
                  </p>
                </div>
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {event.media.map((media: EventMedia, index: number) => (
                      <button
                        key={index}
                        onClick={() => openMediaModal(index)}
                        className="group/item relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-[var(--primary)] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
                      >
                        {media.type === 'image' ? (
                          <Image 
                            src={media.url} 
                            alt={media.caption || event.title} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="relative w-full h-full bg-black/90 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center justify-center bg-[var(--primary)]/10 group-hover/item:bg-[var(--primary)]/20 transition-colors">
                              <div className="relative">
                                <div className="absolute inset-0 bg-[var(--primary)]/20 blur-xl rounded-full animate-pulse"></div>
                                <Play className="h-12 w-12 text-white drop-shadow-lg group-hover/item:scale-125 transition-transform relative z-10" />
                              </div>
                            </div>
                            {media.thumbnail && (
                              <Image 
                                src={media.thumbnail} 
                                alt={media.caption || event.title} 
                                fill 
                                className="object-cover opacity-60"
                              />
                            )}
                          </div>
                        )}
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-end">
                          {media.caption && (
                            <p className="text-white text-xs p-3 w-full">
                              {media.caption}
                            </p>
                          )}
                        </div>
                        {/* Index Badge */}
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          {index + 1}/{event.media.length}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
                </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Event Details Card */}
              <div className="bg-[var(--card)] rounded-xl shadow-md border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/30 px-5 py-4 border-b border-[var(--border)]">
                  <h3 className="text-lg font-bold text-[var(--foreground)]">Informații despre eveniment</h3>
                </div>
                <div className="p-5 space-y-3">
                  <div className="group/detail flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-[var(--accent)]/30 to-transparent hover:from-[var(--accent)]/50 transition-all cursor-default">
                    <div className="p-2 rounded-lg bg-[var(--primary)]/10 group-hover/detail:bg-[var(--primary)]/20 transition-colors">
                      <Calendar className="h-5 w-5 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Data & ora</p>
                      <p className="text-sm font-bold text-[var(--foreground)] leading-snug">{formatDate(event.eventDate)}</p>
                    </div>
                  </div>
                  
                  {event.location && (
                    <div className="group/detail flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-[var(--accent)]/30 to-transparent hover:from-[var(--accent)]/50 transition-all cursor-default">
                      <div className="p-2 rounded-lg bg-[var(--primary)]/10 group-hover/detail:bg-[var(--primary)]/20 transition-colors">
                        <MapPin className="h-5 w-5 text-[var(--primary)]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Locație</p>
                        <p className="text-sm font-bold text-[var(--foreground)] leading-snug">{event.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-[var(--card)] rounded-xl shadow-md border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/30 px-5 py-4 border-b border-[var(--border)]">
                  <h3 className="text-lg font-bold text-[var(--foreground)]">Spune-ne ce părere ai</h3>
            </div>
                <div className="p-5 space-y-3">
              <button
                onClick={(e) => handleLike(e)}
                disabled={likeMutation.isPending || !userId}
                    className={`w-full flex items-center justify-between gap-3 px-5 py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/like relative overflow-hidden ${
                  hasUserLiked(event)
                        ? 'bg-gradient-to-r from-[var(--destructive)] to-[var(--destructive)]/80 text-[var(--destructive-foreground)] hover:from-[var(--destructive)]/90 hover:to-[var(--destructive)]/70 shadow-lg shadow-[var(--destructive)]/20'
                        : 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/50 text-[var(--foreground)] hover:from-[var(--primary)] hover:to-[var(--primary)]/80 hover:text-[var(--primary-foreground)] hover:shadow-lg'
                }`}
                title={!userId ? 'Loading...' : hasUserLiked(event) ? 'Unlike' : 'Like'}
              >
                    <div className="flex items-center gap-3">
                      <Heart 
                        className={`h-6 w-6 transition-all duration-300 ${
                          hasUserLiked(event) ? 'fill-current' : ''
                        } ${
                          likeMutation.isPending ? 'animate-pulse' : 'group-hover/like:scale-125'
                        }`} 
                      />
                      <span className="text-base">
                        {hasUserLiked(event) ? '✓ Îmi place' : 'Îmi place'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold">{event.likes || 0}</span>
                    </div>
              </button>

              <button
                onClick={handleShare}
                disabled={shareMutation.isPending}
                    className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/50 text-[var(--foreground)] hover:from-[var(--primary)] hover:to-[var(--primary)]/80 hover:text-[var(--primary-foreground)] font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group/share"
                  >
                    <Share2 
                      className={`h-5 w-5 transition-all duration-300 ${
                        shareMutation.isPending ? 'animate-pulse' : 'group-hover/share:scale-110 group-hover/share:rotate-12'
                      }`} 
                    />
                    <span>Distribuie cu prietenii</span>
              </button>
            </div>
          </div>

              {/* Stats Card */}
              <div className="bg-gradient-to-br from-[var(--primary)]/10 via-[var(--accent)]/30 to-[var(--primary)]/5 rounded-xl shadow-md border border-[var(--border)]/50 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="px-5 py-4 backdrop-blur-sm">
                  <h3 className="text-base font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                    Popularitate
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-4 rounded-xl bg-[var(--card)]/90 backdrop-blur-sm border border-[var(--border)]/50 hover:border-[var(--primary)]/30 transition-all hover:scale-105 group/stat">
                      <div className="flex items-center justify-center mb-2">
                        <div className="p-2 rounded-lg bg-[var(--primary)]/10 group-hover/stat:bg-[var(--primary)]/20 transition-colors">
                          <Heart className="h-5 w-5 text-[var(--primary)] group-hover/stat:scale-110 transition-transform" />
                        </div>
                      </div>
                      <p className="text-3xl font-extrabold text-[var(--foreground)] mb-1">{event.likes || 0}</p>
                      <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Like-uri</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-[var(--card)]/90 backdrop-blur-sm border border-[var(--border)]/50 hover:border-[var(--primary)]/30 transition-all hover:scale-105 group/stat">
                      <div className="flex items-center justify-center mb-2">
                        <div className="p-2 rounded-lg bg-[var(--primary)]/10 group-hover/stat:bg-[var(--primary)]/20 transition-colors">
                          <Share2 className="h-5 w-5 text-[var(--primary)] group-hover/stat:scale-110 transition-transform" />
                        </div>
                      </div>
                      <p className="text-3xl font-extrabold text-[var(--foreground)] mb-1">{event.shares || 0}</p>
                      <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Distribuiri</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Modal */}
      {selectedMedia && event.media && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in"
          onClick={closeMediaModal}
        >
          {/* Close Button */}
          <button 
            onClick={closeMediaModal} 
            className="absolute top-6 right-6 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 z-50 group/close backdrop-blur-sm border border-white/20"
            aria-label="Închide"
          >
            <X className="h-7 w-7 group-hover/close:rotate-90 transition-transform duration-300" />
          </button>

          {/* Navigation Buttons */}
          {event.media.length > 1 && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigateMedia('prev');
                }} 
                className="absolute left-6 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 z-50 group/nav backdrop-blur-sm border border-white/20"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-7 w-7 group-hover/nav:-translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigateMedia('next');
                }} 
                className="absolute right-6 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 z-50 group/nav backdrop-blur-sm border border-white/20"
                aria-label="Următor"
              >
                <ChevronRight className="h-7 w-7 group-hover/nav:translate-x-1 transition-transform" />
              </button>
            </>
          )}

          {/* Media Counter */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-black/70 backdrop-blur-md rounded-full text-white font-semibold z-50 border border-white/20 shadow-xl">
            <span className="text-lg">{selectedMedia.mediaIndex + 1}</span>
            <span className="text-white/60 mx-1">/</span>
            <span className="text-white/80">{event.media.length}</span>
          </div>

          {/* Media Content */}
          <div 
            className="max-w-7xl max-h-[90vh] w-full px-4 md:px-8" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
            {event.media[selectedMedia.mediaIndex].type === 'image' ? (
                <div className="relative w-full h-[80vh] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
                  <Image 
                    src={event.media[selectedMedia.mediaIndex].url} 
                    alt={event.media[selectedMedia.mediaIndex].caption || event.title} 
                    fill 
                    className="object-contain"
                  />
              </div>
            ) : (
                <video 
                  src={event.media[selectedMedia.mediaIndex].url} 
                  controls 
                  autoPlay 
                  className="w-full h-[80vh] object-contain rounded-2xl shadow-2xl border-2 border-white/10"
                />
              )}
              {event.media[selectedMedia.mediaIndex].caption && (
                <div className="mt-6 text-center">
                  <p className="text-white text-lg bg-black/50 backdrop-blur-md py-4 px-8 rounded-2xl inline-block border border-white/10 shadow-xl">
                    {event.media[selectedMedia.mediaIndex].caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Toast Notification */}
      {showShareToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-[var(--card)] border-2 border-[var(--primary)]/30 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-3 backdrop-blur-sm">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping"></div>
            </div>
            <div>
              <p className="text-[var(--foreground)] font-bold text-sm">✓ Link copiat!</p>
              <p className="text-[var(--muted-foreground)] text-xs">Poți distribui acum evenimentul</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
