import mongoose from 'mongoose';
const URI = process.env.DATABASE_URI;

//Connecting to the Database
const connectDB = async() => {
 try {
    await mongoose.connect(URI);
    console.log('db connected...!');
 } catch (err) {
    console.error('db connection failed:', err.message);
    process.exit(1);
 }
}

export default connectDB;