# API Documentation

This document provides detailed information about the API endpoints available in the Vintage Custom Clothes application.

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
- `category` (string, optional): Filter by category
- `limit` (number, optional): Limit number of results
- `offset` (number, optional): Offset for pagination

**Response:**
```json
{
  "products": [
    {
      "id": "prod_123",
      "name": "Vintage Denim Jacket",
      "description": "Handcrafted denim jacket with vintage wash",
      "price": 129.99,
      "images": ["..."],
      "sizes": ["S", "M", "L"],
      "colors": ["blue"],  // one single color
      "category": "jackets",
      "stock": 15
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
  preferences: {
    theme: 'light' | 'dark';
    currency: string;
    // other user preferences
  };
  // other session data
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
      "productId": "prod_123",
      "quantity": 1,
      "customizations": {
        "size": "M",
        "color": "blue",
        "embroidery": "custom text"
      }
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
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
