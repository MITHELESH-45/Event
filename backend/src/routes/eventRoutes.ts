import express from 'express';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent, getMyEvents } from '../controllers/eventController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/my-events').get(protect, authorize('organizer'), getMyEvents);

router.route('/')
    .get(getEvents)
    .post(protect, authorize('organizer', 'admin'), createEvent);

router.route('/:id')
    .get(getEvent)
    .put(protect, authorize('organizer', 'admin'), updateEvent)
    .delete(protect, authorize('organizer', 'admin'), deleteEvent);

export default router;
