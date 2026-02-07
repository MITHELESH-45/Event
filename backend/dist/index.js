"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const registrationRoutes_1 = __importDefault(require("./routes/registrationRoutes"));
dotenv_1.default.config({ override: true });
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/api/auth', (req, res, next) => {
    console.log('Auth route hit:', req.method, req.url);
    next();
}, authRoutes_1.default);
app.use('/api/events', eventRoutes_1.default);
app.use('/api/registrations', registrationRoutes_1.default);
const PORT = process.env.PORT || 5000;
console.log('PORT from env:', process.env.PORT);
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.listen(PORT, () => console.log(`Backend Server started on port ${PORT}`));
