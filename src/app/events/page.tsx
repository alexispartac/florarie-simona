'use client';

import { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Heart, Share2, Search, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';
import { EventCardSkeleton } from './components/EventCardSkeleton';

export default function EventsListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const { language } = useLanguage();
  const t = useTranslation(language);

  const { data, isLoading } = useEvents({
    page: 1,
    limit: 50,
    search: searchQuery,
    eventType: eventTypeFilter === 'all' ? undefined : eventTypeFilter,
    published: true,
  });

  const events = data?.data || [];

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Hero Section */}
      <div
        className="bg-[var(--secondary)] text-[var(--foreground)] my-20 relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/25 via-[var(--primary)]/15 to-[var(--primary)]/30"
          style={{ backgroundBlendMode: 'overlay' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--primary-foreground)] drop-shadow-lg">{t('events.title')}</h1>
            <p className="text-lg md:text-xl text-[var(--primary-foreground)]/95 max-w-2xl mx-auto drop-shadow-md">
              {t('events.subtitle')}
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
                placeholder={t('events.searchPlaceholder')}
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
                <option value="all">{t('events.filterAll')}</option>
                <option value="upcoming">{t('events.filterUpcoming')}</option>
                <option value="past">{t('events.filterPast')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link
                key={event.eventId}
                href={`/events/${event.eventId}`}
                className="group bg-[var(--card)] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[var(--border)]"
              >
                {/* Event Image */}
                <div className="relative h-64 bg-[var(--muted)]">
                  {event.media && event.media.length > 0 && event.media[0].type === 'image' ? (
                    <Image
                      src={event.media[0].url}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-[var(--primary)]/10">
                      <Calendar className="h-16 w-16 text-[var(--primary)]/40" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {event.featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {t('events.featured')}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-lg ${
                        event.eventType === 'upcoming'
                          ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                          : 'bg-[var(--secondary)] text-[var(--foreground)]'
                      }`}
                    >
                      {event.eventType === 'upcoming' ? t('events.upcoming') : t('events.past')}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)] mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(event.eventDate)}
                    </div>
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[var(--foreground)] text-sm mb-4 line-clamp-3">{event.description}</p>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{event.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="flex items-center text-[var(--primary)] font-medium text-sm group-hover:text-[var(--hover-primary)] transition-colors">
                      Detalii
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--card)] rounded-lg shadow-sm p-12 text-center border border-[var(--border)]">
            <Calendar className="mx-auto h-16 w-16 text-[var(--muted-foreground)] mb-4" />
            <h3 className="text-xl font-medium text-[var(--foreground)] mb-2">{t('events.noEvents')}</h3>
            <p className="text-[var(--muted-foreground)]">
              {searchQuery ? t('events.tryAdjusting') : t('events.noEventsText')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
