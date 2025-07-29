import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Message } from '../types/agent';
import { apiService } from '../services/api';
import { MessageBubble } from './MessageBubble';
import { AgentPanel } from './AgentPanel';
import { LLMStatus } from './LLMStatus';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const agentList = await apiService.getAgents();
        setAgents(agentList);
        
        const welcomeMessage: Message = {
          id: 'welcome',
          content: '🤖 **Welcome to your AI Travel Assistant!**\n\nI\'m powered by **Multi-LLM Technology** with automatic fallback support:\n\n🧠 **Available LLMs**: OpenAI, Anthropic, Google, Cohere\n🔄 **Auto-Fallback**: If one fails, I switch to another\n🎯 **Specialized Agents**: Each optimized for different tasks\n\n• 🗺️ **Trip Planning** - Detailed itineraries\n• 📅 **Bookings** - Hotels, flights, reservations\n• 💡 **Recommendations** - Personalized suggestions\n• 🌤️ **Seasonal Advice** - Best travel timing\n• 🏷️ **Deals & Offers** - Money-saving tips\n\nWhat would you like to explore today?',
          sender: 'agent',
          agentId: 'orchestrator',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        const errorMessage: Message = {
          id: 'error',
          content: '⚠️ **Connection Issue**\n\nI\'m having trouble connecting to the AI backend. Please:\n\n1. **Start the API server**:\n```bash\ncd API\npython run.py\n```\n\n2. **Check your API keys** in `API/.env`:\n- OPENAI_API_KEY\n- ANTHROPIC_API_KEY\n- GOOGLE_API_KEY\n- COHERE_API_KEY\n\n3. **Install dependencies**:\n```bash\ncd API\npip install -r requirements.txt\n```',
          sender: 'agent',
          agentId: 'orchestrator',
          timestamp: new Date()
        };
        setMessages([errorMessage]);
      }
    };
    
    initializeChat();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiService.sendMessage(inputMessage, 'user123');
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content: '❌ **Error Processing Request**\n\nI encountered an error while processing your message. The system will automatically try other LLM providers:\n\n🔄 **Auto-Fallback Active**\n• Trying alternative LLM providers\n• OpenAI → Anthropic → Google → Cohere\n\n**Possible Issues**:\n• All API keys invalid/expired\n• Network connectivity problems\n• Rate limits exceeded\n\nPlease try again in a moment.',
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AgentPanel agents={agents} />

      <div className="flex-1 flex flex-col">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🤖 AI Travel Assistant</h1>
              <p className="text-sm text-gray-600">Multi-LLM with Auto-Fallback Support</p>
            </div>
            <div className="flex items-center space-x-4">
              <LLMStatus className="w-64" />
              <div className="flex items-center space-x-1 text-sm text-gray-500 border-l pl-4">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  apiService.getConnectionStatus() ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span>{apiService.getConnectionStatus() ? 'API Connected' : 'API Disconnected'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              agent={message.agentId ? agents.find(a => a.id === message.agentId) : undefined}
            />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm">🧠 Multi-LLM processing with auto-fallback...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about travel - Multi-LLM powered with auto-fallback!"
                  className="w-full px-4 py-3 pr-12 bg-white rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none outline-none transition-all duration-200"
                  rows={1}
                  style={{
                    minHeight: '48px',
                    maxHeight: '120px',
                    resize: 'none'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};