import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URI);
        console.log(✅ MongoDB Connected: );
        return conn;
    } catch (error) {
        console.error(❌ MongoDB Connection Error: );
        process.exit(1);
    }
};

export default connectDB;
