import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatbotContextType {
  isOpen: boolean;
  isMinimized: boolean;
  toggleChatbot: () => void;
  minimizeChatbot: () => void;
  maximizeChatbot: () => void;
  closeChatbot: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(prev => !prev);
    if (isOpen) {
      setIsMinimized(false);
    }
  };

  const minimizeChatbot = () => {
    setIsMinimized(true);
  };

  const maximizeChatbot = () => {
    setIsMinimized(false);
  };

  const closeChatbot = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const value: ChatbotContextType = {
    isOpen,
    isMinimized,
    toggleChatbot,
    minimizeChatbot,
    maximizeChatbot,
    closeChatbot,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};
