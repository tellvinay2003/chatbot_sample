from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
import os
import logging
from datetime import datetime
from ..models.agent import (
    ChatRequest, 
    ChatResponse, 
    Message, 
    Agent, 
    AgentType,
    LLMProvider,
    LLMProvidersResponse
)

router = APIRouter()
logger = logging.getLogger(__name__)

# Mock agents data
AGENTS = [
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

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """Chat endpoint for processing user messages"""
    try:
        message = request.message
        user_id = request.user_id or "anonymous"
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Mock response for now - you can integrate with actual LLM providers here
        response_message = Message(
            id=f"agent_{datetime.now().timestamp()}",
            content=f"🤖 **AI Response**\n\nI received your message: '{message}'\n\nThis is a mock response. To integrate with real LLMs:\n\n1. **Set up API keys** in `.env`:\n   - OPENAI_API_KEY\n   - ANTHROPIC_API_KEY\n   - GOOGLE_API_KEY\n   - COHERE_API_KEY\n\n2. **Install LLM libraries**:\n   ```bash\n   pip install openai anthropic google-generativeai cohere\n   ```\n\n3. **Implement LLM integration** in `src/agents/`\n\nYour message: {message}",
            sender="agent",
            agent_id="orchestrator",
            timestamp=datetime.now()
        )
        
        # Convert agents to Agent objects
        active_agents = [Agent(**agent) for agent in AGENTS if agent["active"]]
        
        return ChatResponse(
            message=response_message,
            active_agents=active_agents,
            session_id=request.session_id or "default"
        )
        
    except Exception as e:
        logger.error(f"Error processing chat request: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/agents")
async def get_agents():
    """Get available agents"""
    try:
        # Convert to Agent objects
        agents = [Agent(**agent) for agent in AGENTS]
        
        return {
            "success": True,
            "data": {
                "agents": agents
            }
        }
    except Exception as e:
        logger.error(f"Error fetching agents: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/llm/providers")
async def get_llm_providers():
    """Get LLM provider status"""
    try:
        providers = {
            "openai": LLMProvider(
                name="OpenAI",
                available=bool(os.getenv("OPENAI_API_KEY")),
                models=["gpt-4", "gpt-3.5-turbo"],
                status="Available" if os.getenv("OPENAI_API_KEY") else "No API Key"
            ),
            "anthropic": LLMProvider(
                name="Anthropic",
                available=bool(os.getenv("ANTHROPIC_API_KEY")),
                models=["claude-3-opus", "claude-3-sonnet"],
                status="Available" if os.getenv("ANTHROPIC_API_KEY") else "No API Key"
            ),
            "google": LLMProvider(
                name="Google",
                available=bool(os.getenv("GOOGLE_API_KEY")),
                models=["gemini-pro", "gemini-pro-vision"],
                status="Available" if os.getenv("GOOGLE_API_KEY") else "No API Key"
            ),
            "cohere": LLMProvider(
                name="Cohere",
                available=bool(os.getenv("COHERE_API_KEY")),
                models=["command", "command-light"],
                status="Available" if os.getenv("COHERE_API_KEY") else "No API Key"
            )
        }
        
        # Determine default provider (first available one)
        default_provider = next((provider for provider, config in providers.items() if config.available), "openai")
        
        return LLMProvidersResponse(
            providers=providers,
            default=default_provider
        )
    except Exception as e:
        logger.error(f"Error fetching LLM providers: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/llm/switch")
async def switch_llm_provider(request: Dict[str, str]):
    """Switch the default LLM provider"""
    try:
        provider = request.get("provider")
        
        if not provider:
            raise HTTPException(status_code=400, detail="Provider is required")
        
        # In a real implementation, you would update the default provider
        # For now, just return success
        return {
            "success": True,
            "message": f"Switched to {provider}",
            "provider": provider
        }
    except Exception as e:
        logger.error(f"Error switching LLM provider: {e}")
        raise HTTPException(status_code=500, detail="Internal server error") 