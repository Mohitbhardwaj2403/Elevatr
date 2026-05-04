import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    feedback: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default mongoose.model('InterviewSession', interviewSessionSchema);




