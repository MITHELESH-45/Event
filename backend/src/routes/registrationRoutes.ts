import express from 'express';
import { registerForEvent, getMyRegistrations, getEventRegistrations, updateRegistrationStatus } from '../controllers/registrationController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, registerForEvent);
router.get('/my', protect, getMyRegistrations);
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getEventRegistrations);
router.put('/:id', protect, authorize('organizer', 'admin'), updateRegistrationStatus);

export default router;
