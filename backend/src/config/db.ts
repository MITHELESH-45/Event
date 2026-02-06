import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        console.log("URI:", process.env.MONGODB_URI?.replace(/:([^:@]+)@/, ':****@')); // Log URI with hidden password

        const conn = await mongoose.connect(process.env.MONGODB_URI || '', {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        console.error(`Full Error:`, error);
        // Do not exit process, let it retry or fail gracefully
        // process.exit(1); 
    }
};

export default connectDB;
