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
 * MongoDB connection options — tuned for performance
 */
const connectionOptions: mongoose.ConnectOptions = {
    maxPoolSize: 10,                  // reuse up to 10 connections
    minPoolSize: 2,                   // keep 2 warm connections ready
    serverSelectionTimeoutMS: 5000,   // fail fast on unreachable server
    socketTimeoutMS: 45000,           // long-running queries allowed
    bufferCommands: true,             // queue commands until connected
    autoIndex: process.env.NODE_ENV !== 'production', // skip in prod
};

/**
 * Connect to MongoDB with connection caching.
 *
 * Uses readyState check to instantly return when already connected,
 * avoiding unnecessary promise awaits on hot paths.
 */
async function connectDB(): Promise<typeof mongoose> {
    // Fast path: already connected → instant return
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // Connection in progress → wait for it
    if (cached.promise) {
        cached.conn = await cached.promise;
        return cached.conn;
    }

    // New connection
    console.log('[DB] Creating new connection...');
    cached.promise = mongoose
        .connect(MONGODB_URI!, connectionOptions)
        .then((m) => {
            console.log('[DB] Connected successfully');
            return m;
        })
        .catch((err) => {
            cached.promise = null;
            const msg = err instanceof Error ? err.message : String(err);
            console.error('[DB] Connection failed:', msg);
            throw new Error(`[DB] Failed to connect to MongoDB: ${msg}`);
        });

    cached.conn = await cached.promise;
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