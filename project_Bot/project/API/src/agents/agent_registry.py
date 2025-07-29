"""
Agent Registry - Manages different AI agents and their capabilities
"""
from typing import Dict, List, Optional, Any
from ..models.agent import Agent, AgentType
import logging

logger = logging.getLogger(__name__)

class AgentRegistry:
    """Registry for managing AI agents"""
    
    def __init__(self):
        self.agents: Dict[str, Agent] = {}
        self.active_agents: List[str] = []
        self._initialize_agents()
    
    def _initialize_agents(self):
        """Initialize default agents"""
        default_agents = [
            {
                "id": "orchestrator",
                "name": "Orchestrator",
                "type": AgentType.ORCHESTRATOR,
                "description": "Main coordinator that routes requests to specialized agents",
                "specialization": ["Coordination", "Routing"],
                "color": "#2563EB",
                "icon": "Bot",
                "active": True
            },
            {
                "id": "itinerary-planner",
                "name": "Trip Planner",
                "type": AgentType.ITINERARY,
                "description": "Creates detailed travel itineraries and plans",
                "specialization": ["Itinerary Planning", "Route Optimization"],
                "color": "#059669",
                "icon": "MapPin",
                "active": True
            },
            {
                "id": "booking-specialist",
                "name": "Booking Specialist",
                "type": AgentType.BOOKING,
                "description": "Handles hotel, flight, and activity bookings",
                "specialization": ["Bookings", "Reservations"],
                "color": "#DC2626",
                "icon": "Calendar",
                "active": True
            },
            {
                "id": "suggestion-engine",
                "name": "Recommendation Engine",
                "type": AgentType.SUGGESTIONS,
                "description": "Provides personalized travel recommendations",
                "specialization": ["Recommendations", "Personalization"],
                "color": "#7C3AED",
                "icon": "Lightbulb",
                "active": True
            },
            {
                "id": "seasonal-analyst",
                "name": "Seasonal Analyst",
                "type": AgentType.SEASONAL,
                "description": "Analyzes best travel times and seasonal factors",
                "specialization": ["Seasonal Analysis", "Timing"],
                "color": "#EA580C",
                "icon": "Sun",
                "active": True
            },
            {
                "id": "offers-manager",
                "name": "Deals Manager",
                "type": AgentType.OFFERS,
                "description": "Finds and manages travel deals and offers",
                "specialization": ["Deals", "Offers", "Discounts"],
                "color": "#16A34A",
                "icon": "Tag",
                "active": True
            }
        ]
        
        for agent_data in default_agents:
            agent = Agent(**agent_data)
            self.agents[agent.id] = agent
            if agent.active:
                self.active_agents.append(agent.id)
    
    def get_agent(self, agent_id: str) -> Optional[Agent]:
        """Get an agent by ID"""
        return self.agents.get(agent_id)
    
    def get_all_agents(self) -> List[Agent]:
        """Get all agents"""
        return list(self.agents.values())
    
    def get_active_agents(self) -> List[Agent]:
        """Get all active agents"""
        return [agent for agent in self.agents.values() if agent.active]
    
    def activate_agent(self, agent_id: str) -> bool:
        """Activate an agent"""
        if agent_id in self.agents:
            self.agents[agent_id].active = True
            if agent_id not in self.active_agents:
                self.active_agents.append(agent_id)
            return True
        return False
    
    def deactivate_agent(self, agent_id: str) -> bool:
        """Deactivate an agent"""
        if agent_id in self.agents:
            self.agents[agent_id].active = False
            if agent_id in self.active_agents:
                self.active_agents.remove(agent_id)
            return True
        return False
    
    def add_agent(self, agent: Agent) -> bool:
        """Add a new agent"""
        if agent.id not in self.agents:
            self.agents[agent.id] = agent
            if agent.active:
                self.active_agents.append(agent.id)
            return True
        return False
    
    def remove_agent(self, agent_id: str) -> bool:
        """Remove an agent"""
        if agent_id in self.agents:
            del self.agents[agent_id]
            if agent_id in self.active_agents:
                self.active_agents.remove(agent_id)
            return True
        return False
    
    def get_agents_by_type(self, agent_type: AgentType) -> List[Agent]:
        """Get agents by type"""
        return [agent for agent in self.agents.values() if agent.type == agent_type]
    
    def get_agents_by_specialization(self, specialization: str) -> List[Agent]:
        """Get agents by specialization"""
        return [
            agent for agent in self.agents.values() 
            if specialization.lower() in [spec.lower() for spec in agent.specialization]
        ]

# Global agent registry instance
agent_registry = AgentRegistry() 