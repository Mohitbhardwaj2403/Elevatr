
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar';
import LandingPage from './pages/LandingPage';
import ResumeAnalysis from './pages/ResumeAnalysis';
import ResumeBuilder from './pages/ResumeBuilder';
import MockInterview from './pages/MockInterview';
import JobMatching from './pages/JobMatching';
import Dashboard from "./pages/Dashboard";
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import { ChatbotProvider } from './context/ChatbotContext';
import { ThemeProvider } from './context/ThemeContext';
import Chatbot from './component/Chatbot';
import { useChatbot } from './context/ChatbotContext';

const SAFE_MODE_ENABLED = import.meta.env.VITE_SAFE_MODE === 'true';

const AppContent = () => {
  if (SAFE_MODE_ENABLED) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-white border border-gray-200 rounded-xl p-6 shadow">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Safe Mode</h1>
          <p className="text-sm text-gray-600 mb-4">
            The full UI is temporarily disabled so the app can load. Turn off safe mode after we fix the crash.
          </p>
          <div className="space-x-3">
            <a href="/" className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Home</a>
            <a href="/login" className="inline-block px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100">Login</a>
          </div>
        </div>
      </div>
    );
  }
  const { isOpen, isMinimized, toggleChatbot, minimizeChatbot } = useChatbot();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/resume-analysis" element={<ResumeAnalysis />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/job-matching" element={<JobMatching />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Chatbot 
        isOpen={isOpen} 
        onToggle={toggleChatbot}
        isMinimized={isMinimized}
        onMinimize={minimizeChatbot}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatbotProvider>
          <Router>
            <AppContent />
          </Router>
        </ChatbotProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;