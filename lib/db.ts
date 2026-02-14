/**
 * MongoDB Connection Utility for Writely
 * 
 * Implements connection caching for serverless environments (Vercel, etc.)
 * to prevent multiple connections during hot reloads and concurrent requests.
 */

import mongoose from 'mongoose';
import dns from 'dns';

// Use public DNS servers so SRV lookups work on restrictive networks
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// Environment variable validation
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        '[DB Error] Please define the MONGODB_URI environment variable in .env.local'
    );
}

/**
 * Type definition for the cached mongoose connection
 */
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

/**
 * Extend globalThis to include our mongoose cache
 * This persists across hot reloads in development
 */
const globalForMongoose = globalThis as typeof globalThis & {
    mongoose?: MongooseCache;
};

// Initialize the cache if it doesn't exist
const cached: MongooseCache = globalForMongoose.mongoose ?? {
    conn: null,
    promise: null,
};

// Persist the cache to global object
if (!globalForMongoose.mongoose) {
    globalForMongoose.mongoose = cached;
}

/**
 * MongoDB connection options
 */
const connectionOptions: mongoose.ConnectOptions = {
    bufferCommands: false, // Disable buffering for serverless
    maxPoolSize: 10,       // Connection pool size
};

/**
 * Connect to MongoDB with connection caching
 * 
 * @returns Promise<typeof mongoose> - The mongoose instance
 * @throws Error if connection fails
 * 
 * @example
 * ```ts
 * import connectDB from '@/lib/db';
 * 
 * export async function GET() {
 *   await connectDB();
 *   // ... your database operations
 * }
 * ```
 */
async function connectDB(): Promise<typeof mongoose> {
    // Return existing connection if available
    if (cached.conn) {
        console.log('[DB] Using cached connection');
        return cached.conn;
    }

    // Create new connection promise if none exists
    if (!cached.promise) {
        console.log('[DB] Creating new connection...');

        cached.promise = mongoose
            .connect(MONGODB_URI!, connectionOptions)
            .then((mongooseInstance) => {
                console.log('[DB] Connected successfully');
                return mongooseInstance;
            });
    }

    // Wait for connection and cache it
    try {
        cached.conn = await cached.promise;
    } catch (error) {
        // Reset promise on error so next call can retry
        cached.promise = null;

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[DB] Connection failed:', errorMessage);

        throw new Error(`[DB] Failed to connect to MongoDB: ${errorMessage}`);
    }

    return cached.conn;
}

/**
 * Disconnect from MongoDB
 * Useful for graceful shutdown or testing
 */
export async function disconnectDB(): Promise<void> {
    if (cached.conn) {
        await cached.conn.disconnect();
        cached.conn = null;
        cached.promise = null;
        console.log('[DB] Disconnected');
    }
}

/**
 * Check if database is connected
 */
export function isConnected(): boolean {
    return mongoose.connection.readyState === 1;
}

export default connectDB;