import { Router } from 'express';
import Joi from 'joi';
import { authMiddleware } from '../middleware/auth.js';
import Job from '../models/Job.js';

const router = Router();

const recommendSchema = Joi.object({
  skills: Joi.array().items(Joi.string()).min(1).required(),
});

router.post('/recommend', authMiddleware, async (req, res) => {
  try {
    const { error, value } = recommendSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const skills = value.skills.map((s) => s.toLowerCase());
    const jobs = await Job.find({ skills_required: { $in: skills } }).limit(50);
    return res.json(jobs);
  } catch (err) {
    console.error('Job recommend error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ created_at: -1 }).limit(100);
    return res.json(jobs);
  } catch (err) {
    console.error('Job list error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;




