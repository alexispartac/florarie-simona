# API Documentation

This document provides detailed information about the API endpoints available in the Buchetul Simonei flower shop application.

## Base URL

All API routes are prefixed with `/api/v1`.

## Data Storage

All user-specific data is stored in the browser's `sessionStorage`. No authentication is required as data is persisted only for the current session.

## Endpoints

### Products

#### Get All Products

```
GET /api/v1/products
```

**Query Parameters:**
- `category` (string, optional): Filter by category (e.g., 'Roses', 'Tulips')
- `limit` (number, optional): Limit number of results
- `offset` (number, optional): Offset for pagination
- `colors` (string, optional): Filter by flower colors (comma-separated)
- `occasions` (string, optional): Filter by occasions (comma-separated)
- `sameDayDelivery` (boolean, optional): Filter by same-day delivery availability

**Response:**
```json
{
  "products": [
    {
      "productId": "flower_123",
      "name": "Romantic Red Roses Bouquet",
      "description": "Beautiful bouquet of 12 red roses",
      "price": 15000,
      "images": ["..."],
      "category": "Roses",
      "tags": ["romantic", "popular"],
      "available": true,
      "flowerDetails": {
        "colors": ["red"],
        "occasions": ["romantic", "valentines-day"],
        "flowerTypes": ["roses"],
        "size": ["medium", "large"],
        "stemCount": 12,
        "sameDayDelivery": true,
        "careInstructions": {
          "wateringFrequency": "daily",
          "expectedLifespan": "7-10 days"
        }
      }
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### User Session

User preferences and cart data are stored in `sessionStorage` using the following structure:

```typescript
interface UserSession {
  cart: CartItem[];
  wishlist: WishlistItem[];
  preferences: {
    theme: 'light' | 'dark';
    language: 'en' | 'ro';
    // other user preferences
  };
  // other session data
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedSize?: 'small' | 'medium' | 'large' | 'extra-large';
  customMessage?: string;
  deliveryDate?: string;
}
```

Example of storing data:
```javascript
// Save to sessionStorage
const userData = {
  cart: [],
  preferences: {
    theme: 'light',
    currency: 'USD'
  }
};
sessionStorage.setItem('userSession', JSON.stringify(userData));

// Retrieve from sessionStorage
const sessionData = JSON.parse(sessionStorage.getItem('userSession') || '{}');
```

### Orders

#### Create Order

```
POST /api/v1/orders
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "flower_123",
      "quantity": 1,
      "selectedSize": "medium",
      "customMessage": "Happy Birthday!",
      "deliveryDate": "2026-01-25"
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Bucharest",
    "state": "București",
    "zipCode": "010101",
    "country": "Romania"
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Common Error Codes

- `400`: Bad Request - Invalid request format
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Something went wrong on our end

## Rate Limiting

API is rate limited to 100 requests per minute per IP address. Exceeding this limit will result in a `429 Too Many Requests` response.
