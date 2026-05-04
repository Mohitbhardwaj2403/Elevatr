import { Router } from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
});

router.post('/register', async(req, res) => {
    try {
        console.log(req.body)
        const { error, value } = registerSchema.validate({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        if (error) {
            console.log(error)
            return res.status(400).json({ message: error.message });
        }

        const existing = await User.findOne({ email: value.email });
        if (existing) return res.status(409).json({ message: 'Email already in use' });

        const hash = await bcrypt.hash(value.password, 10);
        const user = await User.create({
            name: value.name,
            email: value.email,
            password_hash: hash,
        });

        return res.status(201).json({ id: user._id, email: user.email, name: user.name });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async(req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const user = await User.findOne({ email: value.email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const ok = await bcrypt.compare(value.password, user.password_hash);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', { expiresIn: '7d' });
        return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

export default router;

