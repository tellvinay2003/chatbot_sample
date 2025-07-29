import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface LLMProvider {
  available: boolean;
  models: string[];
  status: string;
}

interface LLMStatusProps {
  className?: string;
}

export const LLMStatus: React.FC<LLMStatusProps> = ({ className = '' }) => {
  const [providers, setProviders] = useState<Record<string, LLMProvider>>({});
  const [defaultProvider, setDefaultProvider] = useState<string>('');
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

  const switchProvider = async (provider: string) => {
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

  const getProviderColor = (provider: string, isAvailable: boolean) => {
    if (!isAvailable) return 'bg-gray-400';
    
    const colors: Record<string, string> = {
      openai: 'bg-green-500',
      anthropic: 'bg-orange-500',
      google: 'bg-blue-500',
      cohere: 'bg-purple-500'
    };
    return colors[provider] || 'bg-gray-500';
  };

  const getProviderName = (provider: string) => {
    const names: Record<string, string> = {
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
        <RefreshCw className="w-4 h-4 animate-spin text-gray-500" />
        <span className="text-sm text-gray-500">Loading LLM status...</span>
      </div>
    );
  }

  const availableProviders = Object.entries(providers).filter(([_, config]) => config.available);

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-800">LLM Status</span>
        </div>
        <button
          onClick={fetchLLMStatus}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <RefreshCw className="w-3 h-3 text-gray-500" />
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
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
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