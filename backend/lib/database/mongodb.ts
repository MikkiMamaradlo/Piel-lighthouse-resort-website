import { MongoClient, type Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    console.log("[Database] Using cached MongoDB connection")
    return { client: cachedClient, db: cachedDb }
  }

  const mongoUrl = process.env.MONGODB_URI

  if (!mongoUrl) {
    throw new Error("Please define MONGODB_URI in environment variables")
  }

  console.log("[Database] Connecting to MongoDB...")
  const client = new MongoClient(mongoUrl)

  try {
    await client.connect()
    const db = client.db("piel_lighthouse_resort")

    cachedClient = client
    cachedDb = db

    console.log("[Database] ✓ MongoDB connected successfully")
    console.log("[Database] Database:piel_lighthouse_resort")

    return { client, db }
  } catch (error) {
    console.error("[Database] ✗ MongoDB connection failed:", error)
    throw error
  }
}

export default connectToDatabase
