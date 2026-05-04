import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Clock, Building, TrendingUp, Star, ExternalLink } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  match: number;
  description: string;
  requirements: string[];
  skills: string[];
}

interface SkillGap {
  required: string[];
  missing: string[];
  present: string[];
}

const JobMatching: React.FC = () => {
  const [careerGoal, setCareerGoal] = useState('');
  const [location, setLocation] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const sampleJobs: Job[] = [
    {
      id: '1',
      title: 'Junior Software Engineer',
      company: 'TechCorp India',
      location: 'Bangalore, India',
      salary: '₹6-8 LPA',
      type: 'Full-time',
      posted: '2 days ago',
      match: 92,
      description: 'We are looking for a passionate Junior Software Engineer to join our growing team. You will work on exciting projects and learn from experienced developers.',
      requirements: ['Bachelor\'s degree in Computer Science', '0-1 years experience', 'Strong problem-solving skills'],
      skills: ['JavaScript', 'React', 'Node.js', 'Git', 'SQL']
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Mumbai, India',
      salary: '₹5-7 LPA',
      type: 'Full-time',
      posted: '1 day ago',
      match: 87,
      description: 'Join our dynamic startup as a Frontend Developer. Work directly with designers and product managers to create amazing user experiences.',
      requirements: ['HTML/CSS expertise', 'JavaScript proficiency', 'React experience preferred'],
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Tailwind CSS']
    },
    {
      id: '3',
      title: 'Software Developer Intern',
      company: 'BigTech Solutions',
      location: 'Hyderabad, India',
      salary: '₹25,000/month',
      type: 'Internship',
      posted: '3 days ago',
      match: 78,
      description: 'Great opportunity for fresh graduates to gain hands-on experience in software development. Full-time conversion possible.',
      requirements: ['Recent graduate', 'Basic programming knowledge', 'Eagerness to learn'],
      skills: ['Python', 'Java', 'Database fundamentals', 'Problem solving']
    },
    {
      id: '4',
      title: 'Junior Full Stack Developer',
      company: 'InnovateTech',
      location: 'Chennai, India',
      salary: '₹7-9 LPA',
      type: 'Full-time',
      posted: '1 week ago',
      match: 85,
      description: 'Looking for a motivated Junior Full Stack Developer to work on both frontend and backend technologies.',
      requirements: ['Full stack development knowledge', '0-2 years experience', 'Team collaboration skills'],
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js', 'API development']
    }
  ];

  const handleSearch = async () => {
    if (!careerGoal.trim()) return;

    setIsSearching(true);
    setSearchPerformed(false);

    // Simulate API call
    setTimeout(() => {
      setJobs(sampleJobs);
      setSkillGap({
        required: ['JavaScript', 'React', 'Node.js', 'Git', 'SQL', 'TypeScript', 'MongoDB'],
        missing: ['TypeScript', 'MongoDB', 'Docker', 'AWS'],
        present: ['JavaScript', 'React', 'HTML', 'CSS', 'Git']
      });
      setSearchPerformed(true);
      setIsSearching(false);
    }, 2000);
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-green-600 bg-green-100';
    if (match >= 80) return 'text-blue-600 bg-blue-100';
    if (match >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Job Matching</h1>
          <p className="text-lg text-gray-600">
            Find perfect job matches based on your skills and get a personalized learning roadmap
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Career Goal / Target Role
              </label>
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                placeholder="e.g., Software Engineer, Data Analyst, Product Manager"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Bangalore, Mumbai, Remote"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleSearch}
              disabled={isSearching || !careerGoal.trim()}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing your profile and finding matches...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Find Matching Jobs
                </>
              )}
            </button>
          </div>

          {isSearching && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                Scanning your resume for skills and experience...
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                Matching with relevant job opportunities...
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                Analyzing skill gaps and requirements...
              </div>
            </div>
          )}
        </div>

        {searchPerformed && (
          <div className="space-y-8">
            {/* Skill Gap Analysis */}
            {skillGap && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                  Skill Gap Analysis for {careerGoal}
                </h2>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-green-700">✓ Skills You Have</h3>
                    <div className="space-y-2">
                      {skillGap.present.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mr-2 mb-2"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-red-700">⚠ Missing Skills</h3>
                    <div className="space-y-2">
                      {skillGap.missing.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium mr-2 mb-2"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-blue-700">📚 Learning Recommendations</h3>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        Start with TypeScript fundamentals
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        Learn MongoDB basics
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        Docker containerization course
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        AWS Cloud Practitioner certification
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Job Results */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Job Matches ({jobs.length} found)
                </h2>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  Sorted by match score
                </div>
              </div>

              <div className="space-y-6">
                {jobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(job.match)}`}>
                            {job.match}% match
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-600 mb-3">
                          <span className="flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            {job.company}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {job.salary}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {job.posted}
                          </span>
                        </div>
                      </div>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
                        Apply Now
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </button>
                    </div>

                    <p className="text-gray-700 mb-4">{job.description}</p>

                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, index) => {
                            const hasSkill = skillGap?.present.includes(skill);
                            return (
                              <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  hasSkill
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {skill}
                                {hasSkill && ' ✓'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Path CTA */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Bridge the Gap?</h3>
                <p className="text-lg mb-6">
                  Get a personalized learning path to acquire the missing skills and increase your job match score
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Create Learning Plan
                  </button>
                  <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                    Practice Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatching;