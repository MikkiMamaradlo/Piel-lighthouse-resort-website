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
  
  // Enhanced connection options for better reliability
  const client = new MongoClient(mongoUrl, {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
  })

  try {
    await client.connect()
    const db = client.db("piel_lighthouse_resort")

    // Verify the connection
    await db.command({ ping: 1 })

    cachedClient = client
    cachedDb = db

    console.log("[Database] ✓ MongoDB connected successfully")
    console.log("[Database] Database: piel_lighthouse_resort")

    return { client, db }
  } catch (error) {
    console.error("[Database] ✗ MongoDB connection failed:", error)
    throw error
  }
}

export default connectToDatabase
