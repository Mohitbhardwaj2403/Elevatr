import { Router } from 'express';
import Joi from 'joi';
import { authMiddleware } from '../middleware/auth.js';
import Resume from '../models/Resume.js';

const router = Router();

const uploadSchema = Joi.object({
  resume_text: Joi.string().min(20).required(),
  ats_score: Joi.number().min(0).max(100).optional(),
  suggestions: Joi.array().items(Joi.string()).optional(),
});

router.post('/upload', authMiddleware, async (req, res) => {
  try {
    const { error, value } = uploadSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const doc = await Resume.create({
      user_id: req.user.id,
      resume_text: value.resume_text,
      ats_score: value.ats_score ?? 0,
      suggestions: value.suggestions ?? [],
    });

    return res.status(201).json(doc);
  } catch (err) {
    console.error('Resume upload error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await Resume.find({ user_id: req.user.id }).sort({ uploaded_at: -1 });
    return res.json(items);
  } catch (err) {
    console.error('Resume list error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;




