import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import Job from '../src/models/Job.js';

async function run() {
  await connectDB();
  try {
    const sample = [
      {
        role: 'Frontend Developer',
        skills_required: ['javascript', 'react', 'typescript', 'html', 'css'],
        description: 'Build responsive UI and collaborate with backend.',
        company_name: 'TechVision',
      },
      {
        role: 'Backend Developer',
        skills_required: ['node.js', 'express', 'mongodb', 'api'],
        description: 'Design REST APIs and database schemas.',
        company_name: 'DataWave',
      },
      {
        role: 'Data Analyst',
        skills_required: ['sql', 'python', 'excel', 'tableau'],
        description: 'Analyze datasets and produce business insights.',
        company_name: 'InsightPro',
      },
    ];

    await Job.insertMany(sample);
    console.log('Jobs seeded');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.connection.close();
  }
}

run();




