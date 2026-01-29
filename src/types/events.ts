
export type EventType = 'upcoming' | 'past';
export type MediaType = 'image' | 'video';

export interface EventMedia {
  url: string;
  type: MediaType;
  thumbnail?: string; // For videos
  caption?: string;
}

export interface Event {
  eventId: string;
  title: string;
  description: string;
  media: EventMedia[]; // Images or videos
  eventDate: Date | string;
  eventType: EventType; // upcoming or past
  location?: string;
  likes: number;
  likedBy?: string[]; // Array of user IDs who liked
  shares: number;
  featured?: boolean;
  published?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface EventsResponse {
  data: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
