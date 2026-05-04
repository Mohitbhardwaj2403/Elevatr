import { useAuth } from "../context/useAuth"; // ✅ custom hook
import { useChatbot } from "../context/ChatbotContext";
import { MessageCircle, FileText, Sparkles, Home, Menu, X, Mic } from "lucide-react";
import { Link ,useNavigate} from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleChatbot, isOpen } = useChatbot();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const navigate=useNavigate()

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white shadow-md">
        <Link to="/" className="text-xl font-bold hover:text-blue-300 transition-colors">
          Elevatr
        </Link>

        <div className="flex items-center space-x-6">
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <Link
              to="/resume-analysis"
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4 mr-1" />
              Resume Analysis
            </Link>
            <Link
              to="/resume-builder"
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Resume Builder
            </Link>
            <Link
              to="/mock-interview"
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <Mic className="w-4 h-4 mr-1" />
              Mock Interview
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle size="sm" />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Chatbot Toggle Button */}
            <button
              onClick={toggleChatbot}
              className={`p-2 rounded-full transition-colors ${
                isOpen 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              title={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            {/* User Actions - Hidden on mobile when menu is open */}
            {!isMobileMenuOpen && (
              <>
                {user ? (
                  <>
                    <span className="hidden sm:inline mr-4">
                      Welcome, {user.name} ({user.plan})
                    </span>
                    <button
                      onClick={logout}
                      className="px-3 py-1 rounded bg-red-500 hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/signup')}
                      className="px-3 py-1 rounded bg-green-500 hover:bg-green-600"
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600"
                    >
                      Login
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 dark:bg-gray-700 border-t border-gray-700 dark:border-gray-600">
          <div className="px-6 py-4 space-y-4">
            <Link
              to="/"
              className="flex items-center text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="w-4 h-4 mr-3" />
              Home
            </Link>
            <Link
              to="/resume-analysis"
              className="flex items-center text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FileText className="w-4 h-4 mr-3" />
              Resume Analysis
            </Link>
            <Link
              to="/resume-builder"
              className="flex items-center text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Sparkles className="w-4 h-4 mr-3" />
              Resume Builder
            </Link>
            <Link
              to="/mock-interview"
              className="flex items-center text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Mic className="w-4 h-4 mr-3" />
              Mock Interview
            </Link>
            
            {/* Mobile User Actions */}
            <div className="pt-4 border-t border-gray-700 dark:border-gray-600">
              {user ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-400">
                    Welcome, {user.name} ({user.plan})
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      navigate('/signup');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded bg-green-500 hover:bg-green-600 transition-colors"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 transition-colors"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
