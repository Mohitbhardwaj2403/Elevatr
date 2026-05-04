import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resume_text: { type: String, required: true },
    ats_score: { type: Number, default: 0 },
    suggestions: { type: [String], default: [] },
  },
  { timestamps: { createdAt: 'uploaded_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Resume', resumeSchema);




