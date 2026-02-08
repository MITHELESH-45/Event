"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRegistrationStatus = exports.getEventRegistrations = exports.getMyRegistrations = exports.registerForEvent = void 0;
const Registration_1 = __importDefault(require("../models/Registration"));
const Event_1 = __importDefault(require("../models/Event"));
// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private
const registerForEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.body;
        const event = yield Event_1.default.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        // Check capacity
        const registrationCount = yield Registration_1.default.countDocuments({ event: eventId, status: 'confirmed' });
        if (registrationCount >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' });
        }
        // Check if already registered
        const existingRegistration = yield Registration_1.default.findOne({
            user: req.user.id,
            event: eventId
        });
        if (existingRegistration) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }
        const registration = yield Registration_1.default.create({
            user: req.user.id,
            event: eventId,
            status: 'confirmed'
        });
        // Update event registered count
        yield Event_1.default.findByIdAndUpdate(eventId, { $inc: { registered: 1 } });
        res.status(201).json(registration);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.registerForEvent = registerForEvent;
// @desc    Get my registrations
// @route   GET /api/registrations/my
// @access  Private
const getMyRegistrations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registrations = yield Registration_1.default.find({ user: req.user.id })
            .populate('event')
            .populate('user', 'name')
            .sort('-createdAt');
        res.status(200).json(registrations);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getMyRegistrations = getMyRegistrations;
// @desc    Get registrations for an event
// @route   GET /api/registrations/event/:eventId
// @access  Private (Organizer/Admin)
const getEventRegistrations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registrations = yield Registration_1.default.find({ event: req.params.eventId })
            .populate('user', 'name email');
        res.status(200).json(registrations);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getEventRegistrations = getEventRegistrations;
// @desc    Update registration status
// @route   PUT /api/registrations/:id
// @access  Private (Organizer/Admin)
const updateRegistrationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, certificate } = req.body;
        const registration = yield Registration_1.default.findById(req.params.id).populate('event');
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }
        // Check authorization: Admin or Event Organizer
        const event = registration.event;
        if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (status)
            registration.status = status;
        if (typeof certificate !== 'undefined')
            registration.certificate = certificate;
        yield registration.save();
        res.status(200).json(registration);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateRegistrationStatus = updateRegistrationStatus;
