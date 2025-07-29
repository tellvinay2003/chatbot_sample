const { useState, useRef, useEffect } = React;

// API Service
const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.isAvailable = false;
    this.checkConnection();
  }

  async checkConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      this.isAvailable = response.ok;
      console.log(`🔗 API Status: ${this.isAvailable ? 'Connected' : 'API Unavailable'}`);
    } catch (error) {
      this.isAvailable = false;
      console.log('🔗 API Status: Unavailable - Please start the Python backend');
    }
  }

  async sendMessage(message, userId) {
    if (!this.isAvailable) {
      await this.checkConnection();
      
      if (!this.isAvailable) {
        throw new Error('API is not available. Please start the Python backend with: cd API && python run.py');
      }
    }

    try {
      console.log('🚀 Sending message to API...');
      
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          user_id: userId
        })
      });

      if (!response.ok) {
        console.error('❌ API request failed:', response.status, response.statusText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        ...data.message,
        timestamp: new Date(data.message.timestamp)
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to send message to API'
      );
    }
  }

  async getAgents() {
    try {
      const response = await fetch(`${this.baseUrl}/api/agents`);
      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.status}`);
      }
      const data = await response.json();
      return data.success ? data.data.agents : [];
    } catch (error) {
      console.error('❌ Failed to fetch agents:', error);
      return [];
    }
  }

  getConnectionStatus() {
    return this.isAvailable;
  }
}

const apiService = new ApiService();

// Message Bubble Component
const MessageBubble = ({ message, agent }) => {
  const isUser = message.sender === 'user';

  const getAgentIcon = (agentId) => {
    if (!agentId) return 'Bot';
    
    const iconMap = {
      'orchestrator': 'Bot',
      'itinerary-planner': 'MapPin',
      'booking-specialist': 'Calendar',
      'suggestion-engine': 'Lightbulb',
      'seasonal-analyst': 'Sun',
      'offers-manager': 'Tag',
    };

    return iconMap[agentId] || 'Bot';
  };

  const IconComponent = isUser ? 'User' : getAgentIcon(message.agentId);
  const agentColor = agent?.color || '#2563EB';

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: agentColor }}
        >
          <i className="w-4 h-4">🤖</i>
        </div>
      )}
      
      <div className={`max-w-2xl ${isUser ? 'order-first' : ''}`}>
        {!isUser && agent && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-medium text-gray-700">{agent.name}</span>
            {message.metadata?.confidence && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {Math.round(message.metadata.confidence * 100)}% confidence
              </span>
            )}
          </div>
        )}
        
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-200 text-gray-800'
          }`}
        >
          <div className="prose prose-sm max-w-none">
            {message.content.split('\n').map((line, index) => {
              if (line.startsWith('• ')) {
                return (
                  <div key={index} className="flex items-start space-x-2 my-1">
                    <span className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-blue-600'}`}>•</span>
                    <span className="text-sm">{line.substring(2)}</span>
                  </div>
                );
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <div key={index} className={`font-semibold text-sm my-2 ${isUser ? 'text-blue-100' : 'text-gray-800'}`}>
                    {line.replace(/\*\*/g, '')}
                  </div>
                );
              }
              return (
                <div key={index} className="text-sm mb-1">
                  {line}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString()}
          </span>
          {message.metadata?.sources && (
            <span className="text-xs text-gray-400">
              via {message.metadata.sources.join(', ')}
            </span>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
          <i className="w-4 h-4">👤</i>
        </div>
      )}
    </div>
  );
};

// Agent Panel Component
const AgentPanel = ({ agents }) => {
  const getAgentIcon = (agentId) => {
    const iconMap = {
      'orchestrator': '🤖',
      'itinerary-planner': '🗺️',
      'booking-specialist': '📅',
      'suggestion-engine': '💡',
      'seasonal-analyst': '☀️',
      'offers-manager': '🏷️',
    };

    return iconMap[agentId] || '🤖';
  };

  return (
    <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Agent Network</h2>
        <p className="text-sm text-gray-600">Specialized AI agents working together</p>
      </div>

      <div className="space-y-3">
        {agents.map((agent) => {
          const IconComponent = getAgentIcon(agent.id);
          
          return (
            <div
              key={agent.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                agent.active
                  ? 'border-blue-200 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm ${
                    agent.active ? 'shadow-lg' : ''
                  }`}
                  style={{ backgroundColor: agent.color }}
                >
                  <span className="text-lg">{IconComponent}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-800 truncate">{agent.name}</h3>
                    {agent.active && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">Active</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {agent.description}
                  </p>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {agent.specialization.slice(0, 2).map((spec) => (
                      <span
                        key={spec}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {spec}
                      </span>
                    ))}
                    {agent.specialization.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        +{agent.specialization.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-blue-600">⚡</span>
          <span className="text-sm font-medium text-blue-800">LangGraph Workflow</span>
        </div>
        <p className="text-xs text-blue-700">
          Agents communicate through LangGraph workflows, sharing context and coordinating responses for optimal user experience.
        </p>
      </div>
    </div>
  );
};

// LLM Status Component
const LLMStatus = ({ className = '' }) => {
  const [providers, setProviders] = useState({});
  const [defaultProvider, setDefaultProvider] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLLMStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/llm/providers');
      const data = await response.json();
      
      if (data.success) {
        setProviders(data.data.providers);
        setDefaultProvider(data.data.default);
      }
    } catch (error) {
      console.error('Failed to fetch LLM status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchProvider = async (provider) => {
    try {
      const response = await fetch('http://localhost:8000/api/llm/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });
      
      const data = await response.json();
      if (data.success) {
        setDefaultProvider(provider);
      }
    } catch (error) {
      console.error('Failed to switch provider:', error);
    }
  };

  useEffect(() => {
    fetchLLMStatus();
    const interval = setInterval(fetchLLMStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const getProviderColor = (provider, isAvailable) => {
    if (!isAvailable) return 'bg-gray-400';
    
    const colors = {
      openai: 'bg-green-500',
      anthropic: 'bg-orange-500',
      google: 'bg-blue-500',
      cohere: 'bg-purple-500'
    };
    return colors[provider] || 'bg-gray-500';
  };

  const getProviderName = (provider) => {
    const names = {
      openai: 'OpenAI',
      anthropic: 'Anthropic',
      google: 'Google',
      cohere: 'Cohere'
    };
    return names[provider] || provider;
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="animate-spin">🔄</span>
        <span className="text-sm text-gray-500">Loading LLM status...</span>
      </div>
    );
  }

  const availableProviders = Object.entries(providers).filter(([_, config]) => config.available);

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600">🧠</span>
          <span className="text-sm font-medium text-gray-800">LLM Status</span>
        </div>
        <button
          onClick={fetchLLMStatus}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <span className="text-gray-500">🔄</span>
        </button>
      </div>

      <div className="space-y-2">
        {Object.entries(providers).map(([provider, config]) => (
          <div
            key={provider}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
              provider === defaultProvider
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => config.available && switchProvider(provider)}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${getProviderColor(provider, config.available)}`}
              />
              <span className="text-sm font-medium text-gray-700">
                {getProviderName(provider)}
              </span>
              {provider === defaultProvider && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  Default
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              {config.available ? (
                <span className="text-green-500">✅</span>
              ) : (
                <span className="text-red-500">❌</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{availableProviders.length} of {Object.keys(providers).length} providers active</span>
          <span>Auto-fallback enabled</span>
        </div>
      </div>
    </div>
  );
};

// Main Chat Interface Component
const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const messagesEndRef = useRef(null);

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
        
        const welcomeMessage = {
          id: 'welcome',
          content: '🤖 **Welcome to your AI Travel Assistant!**\n\nI\'m powered by **Multi-LLM Technology** with automatic fallback support:\n\n🧠 **Available LLMs**: OpenAI, Anthropic, Google, Cohere\n🔄 **Auto-Fallback**: If one fails, I switch to another\n🎯 **Specialized Agents**: Each optimized for different tasks\n\n• 🗺️ **Trip Planning** - Detailed itineraries\n• 📅 **Bookings** - Hotels, flights, reservations\n• 💡 **Recommendations** - Personalized suggestions\n• 🌤️ **Seasonal Advice** - Best travel timing\n• 🏷️ **Deals & Offers** - Money-saving tips\n\nWhat would you like to explore today?',
          sender: 'agent',
          agentId: 'orchestrator',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        const errorMessage = {
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

    const userMessage = {
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
      const errorMessage = {
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

  const handleKeyPress = (e) => {
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
                  <span className="w-4 h-4">📤</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <div className="min-h-screen">
      <ChatInterface />
    </div>
  );
};

// Render the app
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
); 