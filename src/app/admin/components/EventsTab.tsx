'use client';

import { useState } from 'react';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/useEvents';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, Calendar, MapPin, Heart, Share2, Eye, EyeOff } from 'lucide-react';
import { Event } from '@/types/events';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { toast } from '@/components/hooks/use-toast';
import EventModal from './EventModal';
import { AdminTableSkeleton } from './AdminTableSkeleton';

const ITEMS_PER_PAGE = 10;

export default function EventsTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // Hooks
  const { data, isLoading, error } = useEvents({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery,
    eventType: eventTypeFilter === 'all' ? undefined : eventTypeFilter,
  });

  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const events = data?.data || [];
  const { total = 0 } = data?.pagination || {};
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEvent = async (data: Partial<Event>) => {
    try {
      if (selectedEvent) {
        await updateMutation.mutateAsync({
          eventId: selectedEvent.eventId,
          data,
        });
        toast({
          title: '✓ Event updated!',
          description: 'Event has been successfully updated',
        });
      } else {
        await createMutation.mutateAsync(data);
        toast({
          title: '✓ Event created!',
          description: 'Event has been successfully created',
        });
      }
      setIsEventModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: '✗ Save failed',
        description: 'Failed to save event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      await deleteMutation.mutateAsync(eventToDelete);
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
      toast({
        title: '✓ Event deleted!',
        description: 'Event has been successfully deleted',
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: '✗ Delete failed',
        description: 'Failed to delete event. Please try again.',
        variant: 'destructive',
      });
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

  if (isLoading) {
    return <AdminTableSkeleton rows={10} withImage={true} withSearch={false} withAddButton={true} columns={5} />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-[var(--destructive)] mr-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-[var(--destructive)]">Error loading events. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div className="p-6">
      {/* Modals */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete Event"
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setEventToDelete(null);
        }}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        event={selectedEvent}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium text-[var(--foreground)]">Evenimente (Events)</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Filter */}
          <select
            value={eventTypeFilter}
            onChange={(e) => {
              setEventTypeFilter(e.target.value as 'all' | 'upcoming' | 'past');
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-[var(--border)] rounded-md text-sm text-[var(--foreground)] focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past Events</option>
          </select>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-[var(--muted-foreground)]" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2 border border-[var(--border)] rounded-md leading-5 bg-[var(--card)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddEvent}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium cursor-pointer rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--hover-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] whitespace-nowrap"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Event
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg">
        {events.length > 0 ? (
          <>
            <div className="divide-y divide-[var(--border)]">
              {events.map((event) => (
                <div key={event.eventId} className="p-6 hover:bg-[var(--secondary)]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-[var(--foreground)]">
                          {event.title}
                        </h3>
                        {event.featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--accent)]/20 text-[var(--accent-foreground)]">
                            Featured
                          </span>
                        )}
                        {event.published ? (
                          <Eye className="h-4 w-4 text-[var(--primary)]" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-[var(--muted-foreground)]" />
                        )}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          event.eventType === 'upcoming' ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-[var(--muted)] text-[var(--foreground)]'
                        }`}>
                          {event.eventType === 'upcoming' ? 'Upcoming' : 'Past'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-[var(--muted-foreground)] mb-3 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
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
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {event.likes} likes
                        </div>
                        <div className="flex items-center">
                          <Share2 className="h-4 w-4 mr-1" />
                          {event.shares} shares
                        </div>
                        <div className="text-xs text-[var(--muted-foreground)]">
                          {event.media?.length || 0} media files
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-2 text-[var(--primary)] hover:text-[var(--foreground)] cursor-pointer"
                        title="Edit event"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(event.eventId)}
                        className="p-2 text-[var(--destructive)] hover:text-[var(--destructive)]/90 cursor-pointer"
                        title="Delete event"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-[var(--card)] px-4 py-3 flex items-center justify-between border-t border-[var(--border)] sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-[var(--border)] text-sm font-medium rounded-md text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-[var(--border)] text-sm font-medium rounded-md text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-[var(--foreground)]">
                    Showing <span className="font-medium">{startItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(startItem + ITEMS_PER_PAGE, total)}
                    </span>{' '}
                    of <span className="font-medium">{total}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[var(--border)] bg-[var(--card)] text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]'
                              : 'bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[var(--border)] bg-[var(--card)] text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
            <h3 className="mt-2 text-sm font-medium text-[var(--foreground)]">No events</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">Get started by creating a new event.</p>
            <div className="mt-6">
              <button
                onClick={handleAddEvent}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--hover-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
