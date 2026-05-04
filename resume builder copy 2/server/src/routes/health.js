import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (req, res) => {
    console.log('health api reach')
    const state = mongoose.connection.readyState; // 1 connected, 2 connecting, 0 disconnected
    const status = state === 1 ? 'ok' : state === 2 ? 'connecting' : 'disconnected';
    res.json({ status, state });
});

export default router;

