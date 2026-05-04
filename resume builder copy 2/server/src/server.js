import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.mjs';

import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resumes.js';
import interviewRoutes from './routes/interviews.js';
import jobRoutes from './routes/jobs.js';
import healthRoutes from './routes/health.js';
import atsRoutes from './routes/atsRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ats', atsRoutes);
app.use('/health', healthRoutes);
app.get('/test', (req, res) => {
    res.json({ status: 'successfull' })

})

// 404
app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

