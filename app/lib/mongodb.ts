import mongoose from "mongoose";

// Define the interface for the cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global type
declare global {
  var mongoose: MongooseCache;
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/room-booking";

if (!MONGODB_URI) {
  throw new Error("กรุณากำหนดค่า MONGODB_URI ในไฟล์ .env");
}

// Global is used here to maintain a cached connection across hot reloads
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
