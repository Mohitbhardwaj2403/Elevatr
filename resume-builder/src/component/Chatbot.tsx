import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';
import { generateCareerAnswer } from '../utils/gemini';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action';
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle, isMinimized = false, onMinimize }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI career assistant. I can help you with resume tips, interview preparation, job search strategies, and career advice. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Resume-related responses
    if (message.includes('resume') || message.includes('cv')) {
      if (message.includes('format') || message.includes('template')) {
        return "For a strong resume format, use a clean, ATS-friendly layout with clear sections: Contact Info, Professional Summary, Work Experience, Education, and Skills. Use bullet points for achievements and keep it to 1-2 pages. Would you like specific formatting tips for your industry?";
      }
      if (message.includes('keywords') || message.includes('ats')) {
        return "To optimize for ATS systems, include relevant keywords from job descriptions, use standard section headers, avoid graphics/tables, and use common fonts like Arial or Calibri. I can help you identify keywords for specific job roles!";
      }
      if (message.includes('length') || message.includes('pages')) {
        return "Keep your resume to 1-2 pages maximum. For entry-level positions, 1 page is ideal. For senior roles, 2 pages is acceptable. Focus on quality over quantity - every line should add value!";
      }
      return "I'd be happy to help with your resume! I can assist with formatting, ATS optimization, keyword suggestions, or specific sections. What aspect would you like to focus on?";
    }

    // Interview-related responses
    if (message.includes('interview') || message.includes('mock')) {
      if (message.includes('prepare') || message.includes('practice')) {
        return "Great question! For interview prep, research the company, practice the STAR method for behavioral questions, prepare 3-5 questions to ask them, and practice your elevator pitch. Would you like to start a mock interview session?";
      }
      if (message.includes('questions') || message.includes('common')) {
        return "Common interview questions include: 'Tell me about yourself', 'Why do you want this job?', 'What's your greatest weakness?', and 'Where do you see yourself in 5 years?'. I can help you practice answers to any of these!";
      }
      return "I can help you prepare for interviews! I can provide practice questions, feedback on your answers, or even conduct a mock interview. What would be most helpful?";
    }

    // Job search responses
    if (message.includes('job') || message.includes('career') || message.includes('search')) {
      if (message.includes('find') || message.includes('where')) {
        return "For job searching, use multiple platforms: LinkedIn, Indeed, company websites, and professional networks. Tailor your applications, follow up appropriately, and consider reaching out to employees at target companies. What type of roles are you looking for?";
      }
      if (message.includes('salary') || message.includes('negotiate')) {
        return "Research salary ranges on Glassdoor, PayScale, or LinkedIn. During negotiations, focus on your value, be prepared with data, and consider the full package (benefits, flexibility, growth opportunities). What's your target role?";
      }
      return "I can help with your job search strategy! Whether it's finding opportunities, networking, or application tips, I'm here to guide you. What specific area would you like to focus on?";
    }

    // Skills and development
    if (message.includes('skill') || message.includes('learn') || message.includes('develop')) {
      return "Continuous learning is key to career growth! Consider online courses, certifications, side projects, or networking events. What skills are you looking to develop? I can suggest specific resources and learning paths.";
    }

    // General career advice
    if (message.includes('career') || message.includes('advice') || message.includes('help')) {
      return "I'm here to help with all aspects of your career journey! Whether it's resume building, interview prep, job searching, or career planning, I can provide personalized advice. What's your current career goal?";
    }

    // Default responses
    const defaultResponses = [
      "That's an interesting question! I'd be happy to help you with career-related topics like resume building, interview preparation, job searching, or skill development. Could you be more specific?",
      "I specialize in career guidance and job search assistance. I can help with resumes, interviews, job applications, or career planning. What would you like to work on?",
      "Great question! I'm here to support your career journey. I can assist with resume optimization, interview prep, job search strategies, or professional development. What's your main focus right now?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Try Gemini first
      const aiText = await generateCareerAnswer(inputText);
      const text = aiText && aiText.length > 0 ? aiText : generateBotResponse(inputText);

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (e) {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickSuggestions = [
    "Resume formatting tips",
    "Common interview questions",
    "Job search strategies",
    "Salary negotiation advice"
  ];

  const handleQuickSuggestion = (suggestion: string) => {
    setInputText(suggestion);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isMinimized ? 'w-80' : 'w-96'} h-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Career Assistant</h3>
            <p className="text-xs text-blue-100">Online now</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'bot' && (
                  <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                )}
                {message.sender === 'user' && (
                  <User className="w-4 h-4 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 max-w-xs px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion)}
                className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your career..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
