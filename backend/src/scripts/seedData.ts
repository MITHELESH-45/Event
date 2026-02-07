
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';
import Event from '../models/Event';
import Registration from '../models/Registration';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedData = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI not found in environment variables');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Event.deleteMany({});
        await Registration.deleteMany({});

        // Create Users
        console.log('Creating users...');
        const hashedPassword = await bcrypt.hash('password123', 10);
        const adminPassword = await bcrypt.hash('admin123', 10);

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@gmail.com',
            password: adminPassword,
            role: 'admin'
        });

        const organizer = await User.create({
            name: 'Tech Organizer',
            email: 'organizer@gmail.com',
            password: hashedPassword,
            role: 'organizer'
        });

        const user = await User.create({
            name: 'John Doe',
            email: 'user@gmail.com',
            password: hashedPassword,
            role: 'user'
        });

        // Create Events
        console.log('Creating events...');

        // Single Pending Event for Admin to Approve/Reject
        await Event.create({
            title: 'Future of AI Conference',
            description: 'A deep dive into Artificial Intelligence trends for 2026.',
            date: new Date('2026-05-15'),
            time: '09:00',
            location: 'Tech Hub, San Francisco',
            category: 'Technology',
            capacity: 200,
            organizer: organizer._id,
            status: 'pending'
        });

        // No pre-made registrations to keep it clean, or we could add one if needed.
        // For now, leaving registrations empty as requested "remove every sample just keep one".
        // The "one" likely refers to the main entity (Event). 

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
