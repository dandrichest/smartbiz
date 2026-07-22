import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
dotenv.config();

const deleteAll = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        const result = await User.deleteMany({});
        console.log('✅ Deleted:', result.deletedCount);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};
deleteAll();
