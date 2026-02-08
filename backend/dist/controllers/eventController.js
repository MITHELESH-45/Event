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
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEvent = exports.getMyEvents = exports.getEvents = void 0;
const Event_1 = __importDefault(require("../models/Event"));
const Registration_1 = __importDefault(require("../models/Registration"));
// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield Event_1.default.find().populate('organizer', 'name email').lean();
        // Add registration counts
        const eventsWithCounts = yield Promise.all(events.map((event) => __awaiter(void 0, void 0, void 0, function* () {
            const count = yield Registration_1.default.countDocuments({ event: event._id, status: { $ne: 'cancelled' } });
            return Object.assign(Object.assign({}, event), { registered: count });
        })));
        res.status(200).json(eventsWithCounts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getEvents = getEvents;
// @desc    Get logged in organizer's events
// @route   GET /api/events/my-events
// @access  Private (Organizer)
const getMyEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield Event_1.default.find({ organizer: req.user.id }).lean();
        // Add registration counts
        const eventsWithCounts = yield Promise.all(events.map((event) => __awaiter(void 0, void 0, void 0, function* () {
            const count = yield Registration_1.default.countDocuments({ event: event._id, status: { $ne: 'cancelled' } });
            return Object.assign(Object.assign({}, event), { registered: count });
        })));
        res.status(200).json(eventsWithCounts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getMyEvents = getMyEvents;
// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield Event_1.default.findById(req.params.id).populate('organizer', 'name email').lean();
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const count = yield Registration_1.default.countDocuments({ event: req.params.id, status: { $ne: 'cancelled' } });
        res.status(200).json(Object.assign(Object.assign({}, event), { registered: count }));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getEvent = getEvent;
// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer/Admin)
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.title || !req.body.date || !req.body.location) {
            return res.status(400).json({ message: 'Please provide title, date and location' });
        }
        const event = yield Event_1.default.create(Object.assign(Object.assign({}, req.body), { organizer: req.user.id }));
        res.status(201).json(event);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createEvent = createEvent;
// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer/Admin)
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield Event_1.default.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        // Check if user is organizer of this event or admin
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }
        const updatedEvent = yield Event_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json(updatedEvent);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateEvent = updateEvent;
// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin)
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield Event_1.default.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        // Check if user is organizer of this event or admin
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }
        yield event.deleteOne();
        res.status(200).json({ id: req.params.id });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteEvent = deleteEvent;
