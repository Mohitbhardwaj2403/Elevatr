import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, index: true },
    skills_required: { type: [String], required: true, index: true },
    description: { type: String, required: true },
    company_name: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

jobSchema.index({ skills_required: 1 });

export default mongoose.model('Job', jobSchema);




