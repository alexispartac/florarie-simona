import { Product } from './products';

export interface Collection {
    collectionId: string;
    name: string;
    description: string;
    image: string;
    products: string[]; // Array of product IDs
    featured?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    productsDetails?: Product[]; // Populated product details
}