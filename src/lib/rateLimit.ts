import { MongoClient, Db } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/buchetul-simonei';
let client: MongoClient | null = null;
let db: Db | null = null;

async function getDatabase(): Promise<Db> {
  if (!db) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
  }
  return db;
}

interface RateLimitRecord {
  ip: string;
  route: string;
  count: number;
  resetAt: Date;
  createdAt: Date;
}

interface RateLimitOptions {
  limit: number; // Number of requests allowed
  windowMs: number; // Time window in milliseconds (default: 60000 = 1 minute)
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
}

/**
 * Get the client IP address from the request
 */
function getClientIp(request: NextRequest): string {
  // Check various headers for the real IP (in case of proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const cfConnecting = request.headers.get('cf-connecting-ip');
  
  if (cfConnecting) return cfConnecting;
  if (forwarded) return forwarded.split(',')[0].trim();
  if (real) return real;
  
  // Fallback to a default (though this shouldn't happen in production)
  return 'unknown';
}

/**
 * Check and update rate limit for a given IP and route
 */
export async function checkRateLimit(
  request: NextRequest,
  route: string,
  options: RateLimitOptions = { limit: 100, windowMs: 60000 }
): Promise<RateLimitResult> {
  const ip = getClientIp(request);
  const db = await getDatabase();
  const collection = db.collection<RateLimitRecord>('rate_limits');
  
  const now = new Date();
  
  // Find existing rate limit record
  const existing = await collection.findOne({
    ip,
    route,
    resetAt: { $gt: now }
  });
  
  if (existing) {
    // Check if limit exceeded
    if (existing.count >= options.limit) {
      return {
        success: false,
        limit: options.limit,
        remaining: 0,
        resetAt: existing.resetAt
      };
    }
    
    // Increment count
    await collection.updateOne(
      { _id: existing._id },
      { $inc: { count: 1 } }
    );
    
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - existing.count - 1,
      resetAt: existing.resetAt
    };
  } else {
    // Create new rate limit record
    const resetAt = new Date(now.getTime() + options.windowMs);
    
    await collection.insertOne({
      ip,
      route,
      count: 1,
      resetAt,
      createdAt: now
    });
    
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      resetAt
    };
  }
}

/**
 * Middleware wrapper for rate limiting
 */
export function rateLimitMiddleware(
  options: RateLimitOptions = { limit: 100, windowMs: 60000 }
) {
  return async (request: NextRequest, route: string) => {
    const result = await checkRateLimit(request, route, options);
    
    if (!result.success) {
      const resetTime = Math.ceil((result.resetAt.getTime() - Date.now()) / 1000);
      
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Too many requests. Please try again in ${resetTime} seconds.`
          }
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetAt.toISOString(),
            'Retry-After': resetTime.toString()
          }
        }
      );
    }
    
    // Return headers to be added to successful responses
    return {
      headers: {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.resetAt.toISOString()
      }
    };
  };
}

/**
 * Helper to apply rate limiting to a route handler
 */
export async function withRateLimit(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: RateLimitOptions = { limit: 100, windowMs: 60000 }
): Promise<NextResponse> {
  const route = new URL(request.url).pathname;
  const rateLimitCheck = rateLimitMiddleware(options);
  const result = await rateLimitCheck(request, route);
  
  // If result is a Response, rate limit was exceeded
  if (result instanceof NextResponse) {
    return result;
  }
  
  // Otherwise, call the handler and add rate limit headers
  const response = await handler(request);
  
  // Add rate limit headers to the response
  Object.entries(result.headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * Cleanup old rate limit records (optional, for maintenance)
 */
export async function cleanupOldRecords(): Promise<void> {
  const db = await getDatabase();
  const collection = db.collection<RateLimitRecord>('rate_limits');
  
  // Delete records older than their reset time
  await collection.deleteMany({
    resetAt: { $lt: new Date() }
  });
}
