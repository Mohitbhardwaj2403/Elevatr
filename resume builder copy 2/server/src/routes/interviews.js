import { Router } from 'express';
import Joi from 'joi';
import { authMiddleware } from '../middleware/auth.js';
import InterviewSession from '../models/InterviewSession.js';

const router = Router();

const sessionSchema = Joi.object({
  question: Joi.string().min(5).required(),
  answer: Joi.string().min(1).required(),
  feedback: Joi.string().allow('').optional(),
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { error, value } = sessionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const doc = await InterviewSession.create({
      user_id: req.user.id,
      question: value.question,
      answer: value.answer,
      feedback: value.feedback ?? '',
    });
    return res.status(201).json(doc);
  } catch (err) {
    console.error('Interview save error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await InterviewSession.find({ user_id: req.user.id }).sort({ timestamp: -1 });
    return res.json(items);
  } catch (err) {
    console.error('Interview list error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;




