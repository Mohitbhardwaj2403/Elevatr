import React from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  const features = {
    free: [
      '1 resume scan per month',
      'Basic ATS scoring',
      'Limited job matching (5 jobs)',
      'Community support',
      'Basic skill gap analysis'
    ],
    pro: [
      'Unlimited resume scans',
      'Advanced AI analysis with detailed feedback',
      'Unlimited mock interviews',
      'Unlimited job matching',
      'Detailed skill gap reports',
      'Interview performance analytics',
      'Priority support',
      'Resume templates',
      'Interview question bank (500+ questions)',
      'Career coaching insights',
      'Progress tracking dashboard',
      'Export reports as PDF'
    ]
  };

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer at TCS',
      content: 'The Pro plan helped me prepare thoroughly. Got my dream job in just 3 weeks!',
      rating: 5
    },
    {
      name: 'Rahul Kumar',
      role: 'Data Analyst at Wipro',
      content: 'Amazing value for money. The mock interviews were exactly like real ones.',
      rating: 5
    },
    {
      name: 'Anita Patel',
      role: 'Product Manager at HCL',
      content: 'Best investment I made for my career. Highly recommend the Pro plan.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start free, upgrade when you're ready to accelerate your career
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Zap className="w-4 h-4 text-green-600" />
            <span>Join 50,000+ successful job seekers</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">₹0</span>
                <span className="text-xl text-gray-500 ml-2">forever</span>
              </div>
              <Link
                to="/signup"
                className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors block text-center"
              >
                Get Started Free
              </Link>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-lg">What's included:</h4>
              {features.free.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl shadow-lg p-8 text-white relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold flex items-center">
                <Star className="w-4 h-4 mr-1" />
                MOST POPULAR
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-blue-100 mb-6">Everything you need to succeed</p>
              <div className="mb-2">
                <span className="text-5xl font-bold">₹1,999</span>
                <span className="text-xl text-blue-200 ml-2">/month</span>
              </div>
              <div className="text-blue-200 text-sm mb-6">
                <span className="line-through">₹2,999</span> Save 33%
              </div>
              <Link
                to="/signup"
                className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors block text-center mb-4"
              >
                Start 7-Day Free Trial
              </Link>
              <p className="text-blue-200 text-sm">No credit card required</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Everything in Free, plus:</h4>
              {features.pro.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-blue-50">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Compare Plans
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-4 px-4 font-semibold text-blue-600">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-4 text-gray-700">Resume scans</td>
                  <td className="text-center py-4 px-4">1/month</td>
                  <td className="text-center py-4 px-4 text-blue-600 font-semibold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Mock interviews</td>
                  <td className="text-center py-4 px-4">-</td>
                  <td className="text-center py-4 px-4 text-blue-600 font-semibold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Job matches</td>
                  <td className="text-center py-4 px-4">5</td>
                  <td className="text-center py-4 px-4 text-blue-600 font-semibold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">AI analysis depth</td>
                  <td className="text-center py-4 px-4">Basic</td>
                  <td className="text-center py-4 px-4 text-blue-600 font-semibold">Advanced</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Performance tracking</td>
                  <td className="text-center py-4 px-4">-</td>
                  <td className="text-center py-4 px-4 text-blue-600">
                    <Check className="w-5 h-5 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Priority support</td>
                  <td className="text-center py-4 px-4">-</td>
                  <td className="text-center py-4 px-4 text-blue-600">
                    <Check className="w-5 h-5 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Success Stories from Pro Users
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 mb-6">Yes, you can cancel your subscription at any time. No questions asked.</p>
              
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 mb-6">Yes, Pro plan comes with a 7-day free trial. No credit card required to start.</p>
              
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, UPI, and net banking.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 mb-6">Yes, we offer a 30-day money-back guarantee if you're not satisfied.</p>
              
              <h3 className="font-semibold text-gray-900 mb-2">How does the AI analysis work?</h3>
              <p className="text-gray-600 mb-6">Our AI analyzes your resume using industry standards and ATS requirements to provide personalized feedback.</p>
              
              <h3 className="font-semibold text-gray-900 mb-2">Is my data secure?</h3>
              <p className="text-gray-600">Yes, we use enterprise-grade security and never share your personal information.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful job seekers who trusted our AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              Start Free Trial
            </Link>
            <Link
              to="/signup"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg"
            >
              Get Started Free
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-4">
            ✓ No credit card required ✓ Cancel anytime ✓ 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;