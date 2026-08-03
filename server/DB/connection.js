import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const URI = process.env.DATABASE_URI;

//Connecting to the Database
const connectDB = async () => {
  if (!URI) {
    console.error('db connection failed: DATABASE_URI is not defined');
    process.exit(1);
  }

  try {
    await mongoose.connect(URI);
    console.log('db connected...!');
  } catch (err) {
    console.error('db connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;