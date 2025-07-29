export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  specialization: string[];
  color: string;
  icon: string;
  active: boolean;
}

export enum AgentType {
  ITINERARY = 'itinerary',
  BOOKING = 'booking',
  SUGGESTIONS = 'suggestions',
  SEASONAL = 'seasonal',
  OFFERS = 'offers',
  ORCHESTRATOR = 'orchestrator'
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  agentId?: string;
  timestamp: Date;
  metadata?: {
    agentType?: AgentType;
    confidence?: number;
    sources?: string[];
  };
}

export interface ChatSession {
  id: string;
  messages: Message[];
  activeAgents: string[];
  context: Record<string, any>;
  createdAt: Date;
}