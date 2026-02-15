/**
 * Native MongoDB Client for NextAuth Adapter
 *
 * NextAuth's MongoDB adapter requires a native MongoClient (not Mongoose).
 * This module provides a cached MongoClient promise that reuses connections
 * across hot reloads in development and concurrent requests in production.
 *
 * The connection string is the same MONGODB_URI used by Mongoose — both
 * clients talk to the same database but through different drivers.
 */

import { MongoClient } from 'mongodb';
import dns from 'dns';

// Use public DNS servers (same fix as our Mongoose connection)
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

if (!process.env.MONGODB_URI) {
  throw new Error('[MongoDB Client] MONGODB_URI is not defined in .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

// Extend globalThis for dev hot-reload caching
const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

const clientPromise: Promise<MongoClient> =
  globalForMongo._mongoClientPromise ??
  (() => {
    const client = new MongoClient(uri, options);
    const promise = client.connect();
    if (process.env.NODE_ENV !== 'production') {
      globalForMongo._mongoClientPromise = promise;
    }
    return promise;
  })();

export default clientPromise;
