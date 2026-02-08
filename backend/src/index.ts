import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import registrationRoutes from './routes/registrationRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config({ override: true });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', (req, res, next) => {
    console.log('Auth route hit:', req.method, req.url);
    next();
}, authRoutes);
app.use('/api/events', eventRoutes);
import path from 'path';
import uploadRoutes from './routes/uploadRoutes';

app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 5000;
console.log('PORT from env:', process.env.PORT);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => console.log(`Backend Server started on port ${PORT}`));
