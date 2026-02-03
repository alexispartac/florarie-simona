import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/buchetul-simonei';

/**
 * Initialize MongoDB database with required indexes and collections
 * This should be called once when the application starts
 */
export async function initializeDatabase(): Promise<void> {
  let client: MongoClient | null = null;

  try {
    console.log('🔧 Initializing MongoDB database...');
    
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db();
    
    // Create rate_limits collection with TTL index
    console.log('📊 Setting up rate_limits collection...');
    const rateLimitsCollection = db.collection('rate_limits');
    
    // Create TTL index - documents will auto-delete when resetAt expires
    await rateLimitsCollection.createIndex(
      { resetAt: 1 }, 
      { 
        expireAfterSeconds: 0,
        name: 'resetAt_ttl_index'
      }
    );
    console.log('✅ TTL index created on rate_limits.resetAt');
    
    // Create compound index for faster queries
    await rateLimitsCollection.createIndex(
      { ip: 1, route: 1, resetAt: 1 },
      { name: 'ip_route_resetAt_index' }
    );
    console.log('✅ Compound index created on rate_limits (ip, route, resetAt)');
    
    console.log('✅ Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

/**
 * Check if database is properly initialized
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  let client: MongoClient | null = null;

  try {
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db();
    const rateLimitsCollection = db.collection('rate_limits');
    
    // Check if indexes exist
    const indexes = await rateLimitsCollection.indexes();
    const hasTTLIndex = indexes.some(idx => idx.name === 'resetAt_ttl_index');
    const hasCompoundIndex = indexes.some(idx => idx.name === 'ip_route_resetAt_index');
    
    return hasTTLIndex && hasCompoundIndex;
  } catch (error) {
    console.error('Error checking database health:', error);
    return false;
  } finally {
    if (client) {
      await client.close();
    }
  }
}
