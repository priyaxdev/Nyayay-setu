import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nyayasetu';

  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = !!conn.connections[0].readyState;
    console.log(`[db] MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[db] Warning: MongoDB connection failed (${error.message}). Continuing in fallback mode.`);
  }
}
