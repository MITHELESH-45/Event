import { Request, Response } from 'express';
import Registration from '../models/Registration';
import Event from '../models/Event';

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private
export const registerForEvent = async (req: any, res: Response) => {
    try {
        const { eventId } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check capacity
        const registrationCount = await Registration.countDocuments({ event: eventId, status: 'confirmed' });
        if (registrationCount >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' });
        }

        // Check if already registered
        const existingRegistration = await Registration.findOne({
            user: req.user.id,
            event: eventId
        });

        if (existingRegistration) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        const registration = await Registration.create({
            user: req.user.id,
            event: eventId,
            status: 'confirmed'
        });

        // Update event registered count
        await Event.findByIdAndUpdate(eventId, { $inc: { registered: 1 } });

        res.status(201).json(registration);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my registrations
// @route   GET /api/registrations/my
// @access  Private
export const getMyRegistrations = async (req: any, res: Response) => {
    try {
        const registrations = await Registration.find({ user: req.user.id })
            .populate({ path: 'event', populate: { path: 'organizer', select: 'name' } })
            .populate('user', 'name')
            .sort('-createdAt');
        res.status(200).json(registrations);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get registrations for an event
// @route   GET /api/registrations/event/:eventId
// @access  Private (Organizer/Admin)
export const getEventRegistrations = async (req: any, res: Response) => {
    try {
        const registrations = await Registration.find({ event: req.params.eventId })
            .populate('user', 'name email');
        res.status(200).json(registrations);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update registration status
// @route   PUT /api/registrations/:id
// @access  Private (Organizer/Admin)
export const updateRegistrationStatus = async (req: any, res: Response) => {
    try {
        const { status, certificate } = req.body;
        const registration = await Registration.findById(req.params.id).populate('event');

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        // Check authorization: Admin or Event Organizer
        const event: any = registration.event;
        if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
             return res.status(401).json({ message: 'Not authorized' });
        }

        if (status) registration.status = status;
        if (typeof certificate !== 'undefined') registration.certificate = certificate;
        
        await registration.save();

        res.status(200).json(registration);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
