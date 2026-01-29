'use client';

import { useState } from 'react';
import { Event, EventMedia } from '@/types/events';
import { X, Plus, Trash2, Video } from 'lucide-react';
import Image from 'next/image';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Event>) => void;
  event?: Event | null;
  isSaving?: boolean;
}

const getInitialFormData = (event?: Event | null): Partial<Event> => ({
  title: event?.title || '',
  description: event?.description || '',
  media: event?.media || [],
  eventDate: event?.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : '',
  location: event?.location || '',
  featured: event?.featured || false,
  published: event?.published !== undefined ? event.published : true,
});

function EventModalContent({
  onClose,
  onSave,
  event,
  isSaving = false,
}: Omit<EventModalProps, 'isOpen'>) {
  const [formData, setFormData] = useState<Partial<Event>>(getInitialFormData(event));
  const [mediaInput, setMediaInput] = useState({ url: '', type: 'image' as 'image' | 'video', caption: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev: Partial<Event>) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddMedia = () => {
    if (!mediaInput.url) return;

    setFormData((prev: Partial<Event>) => ({
      ...prev,
      media: [...(prev.media || []), { ...mediaInput }],
    }));

    setMediaInput({ url: '', type: 'image', caption: '' });
  };

  const handleRemoveMedia = (index: number) => {
    setFormData((prev: Partial<Event>) => ({
      ...prev,
      media: prev.media?.filter((_: EventMedia, i: number) => i !== index) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="sm:flex sm:items-start">
      <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
        <h3 className="text-lg leading-6 font-medium text-[var(--foreground)] mb-4">
          {event ? 'Edit Event' : 'Add New Event'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Event Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Valentine's Day Workshop"
              className="block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm text-[var(--foreground)] placeholder-gray-400 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the event..."
              className="block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm text-[var(--foreground)] placeholder-gray-400 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
            />
          </div>

          {/* Event Date */}
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Event Date & Time *
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="datetime-local"
              required
              value={formData.eventDate ? new Date(formData.eventDate).toISOString().slice(0, 16) : ''}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm text-[var(--foreground)] focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Bucharest, Romania"
              className="block w-full px-3 py-2 border border-[var(--border)] rounded-md shadow-sm text-[var(--foreground)] placeholder-gray-400 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
            />
          </div>

          {/* Media Section */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Media (Images/Videos)
            </label>
            
            {/* Add Media Form */}
            <div className="border border-[var(--border)] rounded-md p-3 mb-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="url"
                  placeholder="Media URL"
                  value={mediaInput.url}
                  onChange={(e) => setMediaInput({ ...mediaInput, url: e.target.value })}
                  className="px-3 py-2 border border-[var(--border)] rounded-md text-sm text-[var(--foreground)] placeholder-gray-400"
                />
                <select
                  value={mediaInput.type}
                  onChange={(e) => setMediaInput({ ...mediaInput, type: e.target.value as 'image' | 'video' })}
                  className="px-3 py-2 border border-[var(--border)] rounded-md text-sm text-[var(--foreground)]"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Caption (optional)"
                value={mediaInput.caption}
                onChange={(e) => setMediaInput({ ...mediaInput, caption: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm text-[var(--foreground)] placeholder-gray-400"
              />
              <button
                type="button"
                onClick={handleAddMedia}
                className="w-full flex items-center justify-center px-3 py-2 border border-[var(--border)] rounded-md text-sm font-medium text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--secondary)]"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Media
              </button>
            </div>

            {/* Media List */}
            {formData.media && formData.media.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {formData.media.map((item: EventMedia, index: number) => (
                  <div key={index} className="relative border border-[var(--border)] rounded-md p-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute top-1 right-1 p-1 bg-[var(--destructive)]/100 text-white rounded-full hover:bg-[var(--destructive)]/90"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    {item.type === 'image' ? (
                      <Image className="h-8 w-8 text-[var(--muted-foreground)] mx-auto" src={item.url} alt={item.caption || 'Image'} width={32} height={32} />
                    ) : (
                      <Video className="h-8 w-8 text-[var(--muted-foreground)] mx-auto" />
                    )}
                    <p className="text-xs text-[var(--muted-foreground)] mt-1 truncate">{item.caption || 'No caption'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured & Published Checkboxes */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--border)] rounded cursor-pointer"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-[var(--foreground)] cursor-pointer">
                Featured Event
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="published"
                name="published"
                type="checkbox"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--border)] rounded cursor-pointer"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-[var(--foreground)] cursor-pointer">
                Published
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense pt-4 border-t">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--primary)] text-base font-medium text-white hover:bg-[var(--hover-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : event ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--border)] shadow-sm px-4 py-2 bg-[var(--card)] text-base font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] sm:mt-0 sm:col-start-1 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  event,
  isSaving = false,
}: EventModalProps) {
  if (!isOpen) return null;

  const modalKey = event?.eventId || 'new';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-[var(--secondary)]0 bg-opacity-75"
          onClick={onClose}
          aria-hidden="true"
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="relative inline-block align-bottom bg-[var(--card)] rounded-lg px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 z-50">
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button
              type="button"
              onClick={onClose}
              className="bg-[var(--card)] rounded-md text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <EventModalContent
            key={modalKey}
            onClose={onClose}
            onSave={onSave}
            event={event}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
