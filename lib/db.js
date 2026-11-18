import { MongoClient } from "mongodb";

let clientPromise;
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
  return client.db(process.env.MONGODB_DB || "hvos_db");
}