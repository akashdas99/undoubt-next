import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

if (!process.env.DATABASE_URI) {
  throw new Error("Please add your MongoDB URI to the .env file");
}

const uri = process.env.DATABASE_URI;

const dbConnect = async (): Promise<void> => {
  if (connection?.isConnected) {
    console.log("Already connected to DB");
    return;
  }
  try {
    const db = await mongoose?.connect(uri);
    connection.isConnected = db.connections[0]?.readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection failed", error);
    process.exit(1);
  }
};

export default dbConnect;
