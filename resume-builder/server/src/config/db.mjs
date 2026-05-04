import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
export const connectDB = async() => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('MONGO_URI is not set. Please provide it in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, {
            dbName: 'elevatr_ai_resume_db',
        });
        console.log('MongoDB connected');

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};