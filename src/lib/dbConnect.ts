import mongoose from "mongoose";
declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
  var mongoose: any; // This must be a `var` and not a `let / const`
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const MONGODB_URI = process.env.DATABASE_URI!;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  if (cached.conn) {
    console.log("Already connected to DB");
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("DB connected successfully");
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.log("DB connection failed");
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
