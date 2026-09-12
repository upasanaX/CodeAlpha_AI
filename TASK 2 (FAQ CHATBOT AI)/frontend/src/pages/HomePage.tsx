import React, { useState } from 'react';
import { ChatWindow } from '../components/ChatWindow';
import { ChatInput } from '../components/ChatInput';
import { Message } from '../types/faq';
import { chatApi } from '../api/chatApi';
import { AlertCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hello! 👋 I'm your Coursemate AI learning assistant. Ask me anything about course access, certificates, refunds, or technical questions.",
      confidence: 1.0,
      category: 'General',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await chatApi.sendMessage(text);

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.answer,
        matched_question: response.matched_question,
        confidence: response.confidence,
        category: response.category,
        is_fallback: response.is_fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setErrorMessage(err.message || 'Something went wrong while connecting to the server. Please ensure the backend is running.');
      
      const fallbackErrorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: 'Sorry, I ran into an error connecting to our FAQ server. Please make sure the FastAPI backend is running at http://127.0.0.1:8000 and try again.',
        confidence: 0,
        is_fallback: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      {errorMessage && (
        <div className="bg-rose-500/10 border-b border-rose-500/30 px-4 py-2 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSuggestionClick={handleSendMessage}
        onClearChat={handleClearChat}
      />

      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
