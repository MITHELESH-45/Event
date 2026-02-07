
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const setAdmin = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI not found in environment variables');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        const email = 'admin@gmail.com';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        let user = await User.findOne({ email });

        if (user) {
            console.log('User found. Updating to admin...');
            user.role = 'admin';
            user.password = hashedPassword;
            await user.save();
            console.log('User updated successfully to admin role.');
        } else {
            console.log('User not found. Creating new admin user...');
            user = await User.create({
                name: 'Admin',
                email,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error setting admin:', error);
        process.exit(1);
    }
};

setAdmin();
