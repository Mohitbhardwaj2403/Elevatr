import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, MessageCircle, Target, CheckCircle, Star, ArrowRight, Users, Zap, Shield, Mic } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Professional Banner Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Build and Analyse Your Professional Resume with AI
              <span className="block text-yellow-300">in Minutes, Not Hours</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Join over 2 million job seekers who've landed their dream jobs with our AI-powered resume builder. 
              Professional templates, ATS optimization, and instant downloads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                to="/resume-builder"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-10 py-5 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center shadow-lg"
              >
                <Upload className="w-6 h-6 mr-3" />
                Create New Resume
              </Link>
              <Link
                to="/resume-analysis"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-5 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center"
              >
                Analyze Existing Resume
              </Link>
              <Link
                to="/mock-interview"
                className="bg-green-600 hover:bg-green-500 text-white px-10 py-5 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center shadow-lg"
              >
                <Mic className="w-6 h-6 mr-3" />
                Practice Mock Interview
              </Link>
            </div>
            <div className="flex items-center justify-center space-x-8 text-blue-100">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                <span className="font-medium">Free to Start</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                <span className="font-medium">ATS Optimized</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                <span className="font-medium">Instant Download</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-6">
                Why Choose Our <span className="text-blue-600 dark:text-blue-400">AI Resume Builder?</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Our advanced AI technology analyzes your content and creates professional resumes that pass ATS systems and impress recruiters.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-lg text-gray-700 dark:text-gray-300">Professional templates designed by experts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-lg text-gray-700 dark:text-gray-300">ATS-friendly formatting and keywords</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-lg text-gray-700 dark:text-gray-300">AI-powered content suggestions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-lg text-gray-700 dark:text-gray-300">Instant PDF download</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 mb-4">
                  <div className="text-white font-semibold text-lg">AI Resume Analysis</div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">ATS Compatibility</span>
                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">95/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full w-[95%]"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Content Quality</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">92/100</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full w-[92%]"></div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    ✓ 15 improvements suggested • ✓ Keywords optimized • ✓ Formatting enhanced
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">The Challenge Freshers Face</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Getting that first job is tough when you don't know what employers are looking for
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">😰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Resume Gets Rejected</h3>
              <p className="text-gray-600 dark:text-gray-300">90% of resumes never reach human recruiters due to ATS filtering</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">😵</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Interview Anxiety</h3>
              <p className="text-gray-600 dark:text-gray-300">No practice leads to poor performance in crucial first interviews</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤔</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Skill Gap Confusion</h3>
              <p className="text-gray-600 dark:text-gray-300">Unclear what skills to develop for target roles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">AI-Powered Solution</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get personalized, instant feedback and prepare like never before
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Smart Resume Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">AI analyzes your resume against ATS requirements and provides actionable improvements</p>
              <div className="text-green-600 dark:text-green-400 font-semibold">✓ Instant feedback</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Mock Interview Practice</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Practice with AI interviewer that adapts to your experience level and target role</p>
              <div className="text-green-600 dark:text-green-400 font-semibold">✓ Realistic scenarios</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Job Role Matching</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Find perfect job matches and identify skill gaps to focus your learning</p>
              <div className="text-green-600 dark:text-green-400 font-semibold">✓ Personalized roadmap</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mock Interview Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">Practice Makes Perfect</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Build confidence with our AI-powered mock interviews tailored to your target role and experience level
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mic className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Role-Specific Questions</h3>
                    <p className="text-gray-600 dark:text-gray-300">Practice with questions tailored to your target job role - from Software Engineer to Marketing Executive</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Adaptive Difficulty</h3>
                    <p className="text-gray-600 dark:text-gray-300">Choose from Beginner, Intermediate, or Advanced levels to match your experience</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Instant Feedback</h3>
                    <p className="text-gray-600 dark:text-gray-300">Get detailed performance analysis with strengths and areas for improvement</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Safe Practice Environment</h3>
                    <p className="text-gray-600 dark:text-gray-300">Practice without pressure in a judgment-free environment designed for learning</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link
                  to="/mock-interview"
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <Mic className="w-6 h-6 mr-3" />
                  Start Mock Interview
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 mb-6">
                  <div className="text-white font-semibold text-lg">Mock Interview Session</div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Role: Software Engineer</span>
                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">Intermediate</span>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">AI Interviewer:</div>
                    <div className="text-gray-800 dark:text-gray-200">"Tell me about a challenging project you've worked on and how you approached it."</div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your Response:</div>
                    <div className="text-gray-800 dark:text-gray-200">"I worked on a complex e-commerce platform where I implemented..."</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">8:45</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">5</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Questions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">87%</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">Professional Resume Builder Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to create a winning resume that gets you noticed by employers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">ATS Optimization</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our AI ensures your resume passes Applicant Tracking Systems with proper formatting and keywords
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Professional Templates</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Choose from expertly designed templates tailored for different industries and career levels
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">AI Content Suggestions</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Get intelligent recommendations to improve your resume content and make it more compelling
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Instant Download</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Download your professional resume in PDF format instantly, ready to send to employers
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Build Your Professional Resume?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of successful job seekers who've landed their dream jobs with our AI-powered resume builder
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/resume-builder"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center shadow-lg"
              >
                <Upload className="w-6 h-6 mr-3" />
                Start Building Now
              </Link>
              <Link
                to="/resume-analysis"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center"
              >
                Analyze My Resume
              </Link>
              <Link
                to="/mock-interview"
                className="bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center shadow-lg"
              >
                <Mic className="w-6 h-6 mr-3" />
                Practice Interview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Start free and upgrade when you're ready. No hidden fees, no surprises.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Free</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Perfect for getting started</p>
                <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">$0</div>
                <div className="text-gray-500 dark:text-gray-400">forever</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">1 resume template</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Basic ATS scoring</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">PDF download</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Email support</span>
                </li>
              </ul>
              <Link
                to="/signup"
                className="block w-full text-center py-4 px-6 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan - Most Popular */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-2xl relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold text-sm">
                  MOST POPULAR
                </div>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <p className="text-blue-100 mb-6">Everything you need to succeed</p>
                <div className="text-5xl font-bold mb-2">$19</div>
                <div className="text-blue-200">per month</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Unlimited templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Advanced AI analysis</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>ATS optimization</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Multiple formats</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Cover letter builder</span>
                </li>
              </ul>
              <Link
                to="/signup"
                className="block w-full text-center py-4 px-6 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Enterprise</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">For teams and organizations</p>
                <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">$49</div>
                <div className="text-gray-500 dark:text-gray-400">per month</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Team collaboration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Custom branding</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">API access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Dedicated support</span>
                </li>
              </ul>
              <Link
                to="/signup"
                className="block w-full text-center py-4 px-6 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">Trusted by Job Seekers Worldwide</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how our AI-powered resume builder has helped thousands of professionals land their dream jobs
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                "This resume builder is incredible! I went from getting no responses to landing 3 interviews in one week. 
                The ATS optimization feature is a game-changer."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">Sarah Johnson</div>
                  <div className="text-gray-600 dark:text-gray-400">Software Engineer at Google</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                "The AI suggestions helped me rewrite my resume completely. My ATS score went from 45 to 92! 
                I got my dream job at Microsoft within 2 weeks."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">Michael Chen</div>
                  <div className="text-gray-600 dark:text-gray-400">Product Manager at Microsoft</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                "As a recent graduate, I had no idea how to write a professional resume. This tool guided me through 
                everything and I landed my first job at Amazon!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">Alex Rodriguez</div>
                  <div className="text-gray-600 dark:text-gray-400">Data Analyst at Amazon</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white text-center">
            <h3 className="text-3xl font-bold mb-8">Join Our Success Stories</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">2M+</div>
                <div className="text-blue-100">Resumes Created</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-blue-100">Jobs Landed</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.9/5</div>
                <div className="text-blue-100">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Land Your Dream Job?</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join over 2 million successful job seekers who've used our AI-powered resume builder to ace their applications and land their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link
              to="/resume-builder"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center shadow-lg"
            >
              <Upload className="w-6 h-6 mr-3" />
              Create Resume with AI
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
            <Link
              to="/resume-analysis"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center"
            >
              Analyze Existing Resume
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
              <span className="font-medium">No Credit Card Required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
              <span className="font-medium">Cancel Anytime</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
              <span className="font-medium">30-Day Money Back</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="font-bold text-xl">Elevatr</span>
              </div>
              <p className="text-gray-400">
                AI-powered career preparation platform helping freshers land their dream jobs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/resume-analysis" className="hover:text-white transition-colors">Resume Analysis</Link></li>
                <li><Link to="/mock-interview" className="hover:text-white transition-colors">Mock Interviews</Link></li>
                <li><Link to="/job-matching" className="hover:text-white transition-colors">Job Matching</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-gray-400">50K+ Users</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-gray-400">95% Success Rate</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-purple-400 mr-2" />
                  <span className="text-gray-400">Trusted Platform</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Elevatr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;