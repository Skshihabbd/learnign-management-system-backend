import mongoose from 'mongoose';
import { env } from './env';

export const connectDatabase = async () => {
    try {
        await mongoose.connect(env.DATABASE_URL as string);
        console.log('🗃️  Database connected successfully');
    } catch (error) {
        console.error('❌ Error connecting to database:', error);
        process.exit(1);
    }
};

export const closeDatabase = async () => {
    if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log('🔒 MongoDB connection closed');
    }
};