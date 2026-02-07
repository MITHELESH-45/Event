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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
const path_1 = __importDefault(require("path"));
// Load env vars
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const setAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI not found in environment variables');
        }
        console.log('Connecting to MongoDB...');
        yield mongoose_1.default.connect(uri);
        console.log('MongoDB Connected');
        const email = 'admin@gmail.com';
        const password = 'admin123';
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        let user = yield User_1.default.findOne({ email });
        if (user) {
            console.log('User found. Updating to admin...');
            user.role = 'admin';
            user.password = hashedPassword;
            yield user.save();
            console.log('User updated successfully to admin role.');
        }
        else {
            console.log('User not found. Creating new admin user...');
            user = yield User_1.default.create({
                name: 'Admin',
                email,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created successfully.');
        }
        process.exit(0);
    }
    catch (error) {
        console.error('Error setting admin:', error);
        process.exit(1);
    }
});
setAdmin();
