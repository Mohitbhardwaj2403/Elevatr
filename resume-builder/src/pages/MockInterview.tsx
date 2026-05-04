import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send, Mic, MicOff, BarChart3, Clock, Target, Home, Volume2, VolumeX } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface InterviewSession {
  jobRole: string;
  duration: number;
  questionsAsked: number;
  score: number;
  difficulty: string;
  date: Date;
}

const MockInterview: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('intermediate');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const recognitionRef = useRef<any | null>(null);
  const [sessionData, setSessionData] = useState<InterviewSession>({
    jobRole: '',
    duration: 0,
    questionsAsked: 0,
    score: 0,
    difficulty: '',
    date: new Date()
  });
  const [showResults, setShowResults] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { token } = useAuth();

  const canTts = typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';
  const SpeechRecognitionCtor =
    typeof window !== 'undefined'
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : undefined;
  const canStt = Boolean(SpeechRecognitionCtor);

  const speak = (text: string) => {
    if (!ttsEnabled || !canTts) return;
    if (!text?.trim()) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1;
      utter.pitch = 1;
      utter.lang = 'en-US';
      window.speechSynthesis.speak(utter);
    } catch {
      // ignore
    }
  };

  const stopSpeak = () => {
    if (!canTts) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  };

  const startListening = () => {
    if (!canStt) {
      alert('Voice input is not supported in this browser.');
      return;
    }
    if (isListening) return;

    const rec = new SpeechRecognitionCtor();
    recognitionRef.current = rec;
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';

    let finalText = '';

    rec.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) finalText += t;
        else interim += t;
      }
      setCurrentMessage((finalText + interim).trim());
    };

    rec.onerror = () => {
      setIsListening(false);
    };
    rec.onend = () => {
      setIsListening(false);
      setIsRecording(false);
      // Auto-send if we have something
      setTimeout(() => {
        const text = (finalText || '').trim();
        if (text) sendVoiceMessage(text);
      }, 100);
    };

    setIsListening(true);
    setIsRecording(true);
    try {
      rec.start();
    } catch {
      setIsListening(false);
      setIsRecording(false);
    }
  };

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    try {
      rec.stop();
    } catch {
      // ignore
    }
  };

  const jobRoles = [
    { id: 'software-engineer', name: 'Software Engineer', category: 'Technology' },
    { id: 'data-analyst', name: 'Data Analyst', category: 'Analytics' },
    { id: 'product-manager', name: 'Product Manager', category: 'Product' },
    { id: 'marketing-executive', name: 'Marketing Executive', category: 'Marketing' },
    { id: 'business-analyst', name: 'Business Analyst', category: 'Business' },
    { id: 'ui-ux-designer', name: 'UI/UX Designer', category: 'Design' },
    { id: 'sales-representative', name: 'Sales Representative', category: 'Sales' },
    { id: 'project-manager', name: 'Project Manager', category: 'Management' },
    { id: 'financial-analyst', name: 'Financial Analyst', category: 'Finance' },
    { id: 'hr-specialist', name: 'HR Specialist', category: 'Human Resources' },
    { id: 'devops-engineer', name: 'DevOps Engineer', category: 'Technology' },
    { id: 'content-writer', name: 'Content Writer', category: 'Marketing' }
  ];

  const difficultyLevels = [
    { id: 'beginner', name: 'Beginner', description: 'Basic questions, friendly tone' },
    { id: 'intermediate', name: 'Intermediate', description: 'Standard interview questions' },
    { id: 'advanced', name: 'Advanced', description: 'Challenging technical questions' }
  ];

  const sampleQuestions = {
    'software-engineer': [
      "Tell me about yourself and why you're interested in software engineering.",
      "What programming languages are you most comfortable with?",
      "Describe a challenging project you've worked on. How did you approach it?",
      "How do you stay updated with new technologies?",
      "Explain the difference between front-end and back-end development."
    ],
    'data-analyst': [
      "What drew you to data analysis as a career choice?",
      "Which data analysis tools and languages are you familiar with?",
      "How would you explain a complex data finding to a non-technical stakeholder?",
      "Describe your process for cleaning and preparing data for analysis.",
      "What's the difference between correlation and causation?"
    ],
    'product-manager': [
      "Why are you interested in product management?",
      "How would you prioritize features for a new product?",
      "Describe a time when you had to work with multiple teams.",
      "How do you gather and incorporate user feedback?",
      "What metrics would you use to measure product success?"
    ],
    'sales-representative': [
      "What motivates you in sales?",
      "How do you handle rejection in sales?",
      "Describe your approach to building relationships with clients.",
      "How do you identify potential customers?",
      "What's your strategy for closing deals?"
    ],
    'project-manager': [
      "How do you ensure projects stay on schedule and within budget?",
      "Describe a time when a project went off track. How did you handle it?",
      "How do you communicate with stakeholders?",
      "What project management methodologies are you familiar with?",
      "How do you prioritize tasks when resources are limited?"
    ],
    'financial-analyst': [
      "What financial analysis tools and software are you proficient with?",
      "How do you approach financial modeling?",
      "Describe your experience with budgeting and forecasting.",
      "How do you ensure accuracy in financial reports?",
      "What's your approach to risk assessment?"
    ],
    'hr-specialist': [
      "How do you approach talent acquisition and recruitment?",
      "Describe your experience with employee relations.",
      "How do you ensure compliance with employment laws?",
      "What's your approach to performance management?",
      "How do you handle workplace conflicts?"
    ],
    'devops-engineer': [
      "What DevOps tools and practices are you familiar with?",
      "How do you approach CI/CD pipeline design?",
      "Describe your experience with cloud platforms.",
      "How do you ensure system reliability and monitoring?",
      "What's your approach to infrastructure as code?"
    ],
    'content-writer': [
      "What types of content do you enjoy writing most?",
      "How do you research and fact-check your content?",
      "Describe your experience with SEO and content optimization.",
      "How do you adapt your writing style for different audiences?",
      "What's your process for content planning and strategy?"
    ]
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // cleanup voice on unmount
    return () => {
      stopSpeak();
      try {
        recognitionRef.current?.stop?.();
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (interviewStarted && !showResults) {
      intervalRef.current = setInterval(() => {
        setSessionData(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interviewStarted, showResults]);

  const startInterview = async () => {
    const role = jobRoles.find(r => r.id === selectedRole);
    if (!role) return;

    setInterviewStarted(true);
    setSessionData({
      jobRole: role.name,
      duration: 0,
      questionsAsked: 0,
      score: 0,
      difficulty: selectedDifficulty,
      date: new Date()
    });
    setShowResults(false);
    setSessionId(null);
    setQuestionIndex(0);

    // Welcome message
    const welcomeMessage: Message = {
      id: '1',
      content: `Hello! I'm your AI interviewer. I'll be conducting a mock interview for the ${role.name} position. When you're ready, I'll ask the first question.`,
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    speak(welcomeMessage.content);

    if (!token) {
      const msg: Message = {
        id: 'auth-required',
        content: "Please login to use AI Mock Interview (it calls the backend).",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, msg]);
      speak(msg.content);
      return;
    }

    try {
      const res = await apiFetch<{ questions: string[] }>('/interview/generate-questions', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({
          job_role: role.name,
          difficulty: selectedDifficulty,
          num_questions: 5,
        }),
      });
      const qs = (res.questions || []).filter(Boolean);
      setQuestions(qs);

      const first = qs[0] || "Tell me about yourself and why you're interested in this role.";
      const firstQuestion: Message = {
        id: 'q-0',
        content: first,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, firstQuestion]);
      speak(firstQuestion.content);
      setSessionData(prev => ({ ...prev, questionsAsked: 1 }));
    } catch (e) {
      const fallback = sampleQuestions[selectedRole as keyof typeof sampleQuestions]?.[0]
        || "Tell me about yourself and why you're interested in this role.";
      setQuestions([fallback]);
      setMessages(prev => [...prev, {
        id: 'q-fallback',
        content: fallback,
        sender: 'ai',
        timestamp: new Date(),
      }]);
      speak(fallback);
      setSessionData(prev => ({ ...prev, questionsAsked: 1 }));
    }
  };

  const sendVoiceMessage = async (voiceText: string) => {
    setCurrentMessage(voiceText);
    await sendMessage(voiceText);
  };

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? currentMessage).trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const answer = text;
    setCurrentMessage('');

    const currentQ = questions[questionIndex] || messages.slice().reverse().find(m => m.sender === 'ai')?.content || "";

    if (!token) return;

    try {
      const res = await apiFetch<any>('/interview/analyze-answer', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({
          session_id: sessionId,
          job_role: sessionData.jobRole,
          difficulty: selectedDifficulty,
          question: currentQ,
          answer,
        }),
      });

      const feedbackText =
        res?.feedback?.feedback ||
        "Thanks. I’ve recorded your answer.";

      const scoreValue = Number(res?.feedback?.score || 0);
      setSessionId(res?.session?.id || sessionId);
      setSessionData(prev => ({ ...prev, score: scoreValue }));

      setMessages(prev => [...prev, {
        id: `${Date.now()}-feedback`,
        content: feedbackText,
        sender: 'ai',
        timestamp: new Date()
      }]);
      speak(feedbackText);
    } catch {
      setMessages(prev => [...prev, {
        id: `${Date.now()}-feedback-fallback`,
        content: "Thanks — try to be more specific and quantify your impact where possible. Let's continue.",
        sender: 'ai',
        timestamp: new Date()
      }]);
      speak("Thanks — try to be more specific and quantify your impact where possible. Let's continue.");
    }

    const nextIndex = questionIndex + 1;
    if (nextIndex >= Math.max(1, questions.length)) {
      endInterview();
      return;
    }

    setQuestionIndex(nextIndex);
    setTimeout(() => {
      const nextQ = questions[nextIndex];
      if (!nextQ) return;
      setMessages(prev => [...prev, {
        id: `q-${nextIndex}`,
        content: nextQ,
        sender: 'ai',
        timestamp: new Date()
      }]);
      speak(nextQ);
      setSessionData(prev => ({ ...prev, questionsAsked: prev.questionsAsked + 1 }));
    }, 900);
  };

  const endInterview = () => {
    const finalMessage: Message = {
      id: 'final',
      content: "Thank you for completing the mock interview! I'll now generate your performance feedback. This usually takes a few moments...",
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, finalMessage]);
    speak(finalMessage.content);

    setTimeout(() => {
      setShowResults(true);
      setSessionData(prev => ({ ...prev, score: prev.score || Math.floor(Math.random() * 10) + 75 }));
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Button */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Interview Complete!</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Here's your performance analysis</p>
          </div>

          <div className="space-y-8">
            {/* Overall Score */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Overall Performance</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{sessionData.score}%</div>
                  <div className="text-gray-600 dark:text-gray-300">Overall Score</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{formatTime(sessionData.duration)}</div>
                  <div className="text-gray-600 dark:text-gray-300">Duration</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">{sessionData.questionsAsked}</div>
                  <div className="text-gray-600 dark:text-gray-300">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2 capitalize">{sessionData.difficulty}</div>
                  <div className="text-gray-600 dark:text-gray-300">Difficulty</div>
                </div>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                  <Target className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                  Strengths
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">Clear and confident communication style</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">Good use of specific examples</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">Demonstrated enthusiasm for the role</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">Appropriate response length</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-2" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full mt-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">Include more quantifiable achievements</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full mt-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">Ask more questions about the role</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full mt-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">Practice the STAR method for behavioral questions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-xl font-bold mb-4">Ready for More Practice?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setInterviewStarted(false);
                    setShowResults(false);
                    setMessages([]);
                    setSelectedRole('');
                    setSelectedDifficulty('intermediate');
                    setSessionData({ jobRole: '', duration: 0, questionsAsked: 0, score: 0, difficulty: '', date: new Date() });
                  }}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Start New Interview
                </button>
                <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  View Dashboard
                </button>
                <Link
                  to="/"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Button */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">AI Mock Interview</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Practice with our AI interviewer and get instant feedback to improve your performance
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Select Your Target Role</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {jobRoles.map((role) => (
                <div
                  key={role.id}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedRole === role.id
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">{role.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{role.category}</p>
                </div>
              ))}
            </div>

            {selectedRole && (
              <div className="border-t pt-6">
                {/* Difficulty Selection */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-4">Select Difficulty Level</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {difficultyLevels.map((level) => (
                      <div
                        key={level.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedDifficulty === level.id
                            ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => setSelectedDifficulty(level.id)}
                      >
                        <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{level.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{level.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">What to Expect</h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-center">
                      <Clock className="w-4 h-4 text-blue-600 mr-2" />
                      5-10 minute interview session
                    </li>
                    <li className="flex items-center">
                      <MessageCircle className="w-4 h-4 text-green-600 mr-2" />
                      Role-specific questions tailored to {jobRoles.find(r => r.id === selectedRole)?.name}
                    </li>
                    <li className="flex items-center">
                      <BarChart3 className="w-4 h-4 text-purple-600 mr-2" />
                      Detailed feedback and performance analysis
                    </li>
                    <li className="flex items-center">
                      <Target className="w-4 h-4 text-orange-600 mr-2" />
                      {difficultyLevels.find(d => d.id === selectedDifficulty)?.name} level questions
                    </li>
                  </ul>
                </div>

                <button
                  onClick={startInterview}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Start Interview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Mock Interview: {sessionData.jobRole}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(sessionData.duration)}
                </span>
                <span>Questions: {sessionData.questionsAsked}</span>
              </div>
            </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTtsEnabled((v) => !v)}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                    title={canTts ? "Toggle voice (TTS)" : "TTS not supported"}
                    disabled={!canTts}
                  >
                    {ttsEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                    Voice
                  </button>
                  <button
                    onClick={endInterview}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    End Interview
                  </button>
                </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-[600px] flex flex-col border border-gray-200 dark:border-gray-700">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (!canStt) {
                    alert("Voice input isn't supported in this browser. Please type your answer.");
                    return;
                  }
                  if (isListening) stopListening();
                  else startListening();
                }}
                className={`p-3 rounded-full ${
                  isRecording ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-colors`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={canStt ? "Type your answer or use voice..." : "Type your answer here..."}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!currentMessage.trim()}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between">
              <div>
                {canStt ? (
                  <span>
                    Voice input: <span className="font-semibold">{isListening ? "listening…" : "ready"}</span>
                  </span>
                ) : (
                  <span>Voice input not supported in this browser.</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  const lastAi = [...messages].reverse().find((m) => m.sender === "ai")?.content || "";
                  speak(lastAi);
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold"
                disabled={!canTts || !ttsEnabled}
              >
                Repeat last question
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;