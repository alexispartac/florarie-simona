// File: src/app/models/Post.ts
import { ObjectId } from 'mongodb';

export interface Post {
  _id?: ObjectId;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  publicId: string;
  format: string;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  resourceType: string;
  url: string;
}

export const PostSchema = {
  title: { type: String, required: true },
  description: { type: String, default: '' },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  publicId: { type: String, required: true },
  format: { type: String, required: true },
  width: { type: Number },
  height: { type: Number },
  duration: { type: Number },
  thumbnailUrl: { type: String },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
};