"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registrationController_1 = require("../controllers/registrationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, registrationController_1.registerForEvent);
router.get('/my', authMiddleware_1.protect, registrationController_1.getMyRegistrations);
router.get('/event/:eventId', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('organizer', 'admin'), registrationController_1.getEventRegistrations);
router.put('/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('organizer', 'admin'), registrationController_1.updateRegistrationStatus);
exports.default = router;
