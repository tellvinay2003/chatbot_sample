import React from 'react';
import { User, Bot, MapPin, Calendar, Lightbulb, Sun, Tag } from 'lucide-react';
import { Message, Agent } from '../types/agent';

interface MessageBubbleProps {
  message: Message;
  agent?: Agent;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, agent }) => {
  const isUser = message.sender === 'user';

  const getAgentIcon = (agentId?: string) => {
    if (!agentId) return Bot;
    
    const iconMap: Record<string, React.ElementType> = {
      'orchestrator': Bot,
      'itinerary-planner': MapPin,
      'booking-specialist': Calendar,
      'suggestion-engine': Lightbulb,
      'seasonal-analyst': Sun,
      'offers-manager': Tag,
    };

    return iconMap[agentId] || Bot;
  };

  const IconComponent = isUser ? User : getAgentIcon(message.agentId);
  const agentColor = agent?.color || '#2563EB';

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: agentColor }}
        >
          <IconComponent className="w-4 h-4" />
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
          <IconComponent className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};