import { MongoClient, type Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const mongoUrl = process.env.MONGODB_URI

  if (!mongoUrl) {
    throw new Error("Please define MONGODB_URI in environment variables")
  }

  const client = new MongoClient(mongoUrl)

  try {
    await client.connect()
    const db = client.db("piel_lighthouse_resort")

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("[v0] MongoDB connection failed:", error)
    throw error
  }
}

export default connectToDatabase
