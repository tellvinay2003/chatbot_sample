import React from 'react';
import { Bot, MapPin, Calendar, Lightbulb, Sun, Tag, Activity } from 'lucide-react';
import { Agent } from '../types/agent';

interface AgentPanelProps {
  agents: Agent[];
}

export const AgentPanel: React.FC<AgentPanelProps> = ({ agents }) => {
  const getAgentIcon = (agentId: string) => {
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
                  <IconComponent className="w-5 h-5" />
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
          <Activity className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">LangGraph Workflow</span>
        </div>
        <p className="text-xs text-blue-700">
          Agents communicate through LangGraph workflows, sharing context and coordinating responses for optimal user experience.
        </p>
      </div>
    </div>
  );
};