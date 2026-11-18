import { MongoClient } from "mongodb";

let clientPromise;
let dbPromise;

export async function getDb() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI belum diatur.");
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000
    });
    clientPromise = client.connect();
  }
  const client = await clientPromise;
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = client.db(process.env.MONGODB_DB || "hvos_db");
      await Promise.all([
        db.collection("users").createIndex({ email: 1 }, { unique: true, name: "uniq_users_email" }),
        db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: "ttl_sessions_expires" }),
        db.collection("user_data").createIndex({ userId: 1, key: 1 }, { unique: true, name: "uniq_user_data_key" }),
        db.collection("user_settings").createIndex({ userId: 1 }, { unique: true, name: "uniq_user_settings_user" }),
        db.collection("auth_rate_limits").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: "ttl_auth_rate_limits" })
      ]);
      return db;
    })().catch(error => {
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
}
