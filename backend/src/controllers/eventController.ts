import { Request, Response } from 'express';
import Event from '../models/Event';
import Registration from '../models/Registration';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await Event.find().populate('organizer', 'name email').lean();

        // Add registration counts
        const eventsWithCounts = await Promise.all(events.map(async (event: any) => {
            const count = await Registration.countDocuments({ event: event._id, status: { $ne: 'cancelled' } });
            return { ...event, registered: count };
        }));

        res.status(200).json(eventsWithCounts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in organizer's events
// @route   GET /api/events/my-events
// @access  Private (Organizer)
export const getMyEvents = async (req: any, res: Response) => {
    try {
        const events = await Event.find({ organizer: req.user.id }).lean();

        // Add registration counts
        const eventsWithCounts = await Promise.all(events.map(async (event: any) => {
            const count = await Registration.countDocuments({ event: event._id, status: { $ne: 'cancelled' } });
            return { ...event, registered: count };
        }));

        res.status(200).json(eventsWithCounts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = async (req: Request, res: Response) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name email').lean();
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const count = await Registration.countDocuments({ event: req.params.id, status: { $ne: 'cancelled' } });

        res.status(200).json({ ...event, registered: count });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer/Admin)
export const createEvent = async (req: any, res: Response) => {
    try {
        console.log('Create Event Body:', req.body);
        if (!req.body.title || !req.body.date || !req.body.location) {
            return res.status(400).json({ message: 'Please provide title, date and location' });
        }

        const event = await Event.create({
            ...req.body,
            organizer: req.user.id
        });
        res.status(201).json(event);
    } catch (error: any) {
        console.error('Create Event Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer/Admin)
export const updateEvent = async (req: any, res: Response) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is organizer of this event or admin
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedEvent);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin)
export const deleteEvent = async (req: any, res: Response) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is organizer of this event or admin
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await event.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
