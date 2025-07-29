from pydantic import BaseModel
from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime

class AgentType(str, Enum):
    ORCHESTRATOR = "orchestrator"
    ITINERARY = "itinerary"
    BOOKING = "booking"
    SUGGESTIONS = "suggestions"
    SEASONAL = "seasonal"
    OFFERS = "offers"

class Agent(BaseModel):
    id: str
    name: str
    type: AgentType
    description: str
    specialization: List[str]
    color: str
    icon: str
    active: bool = False

class Message(BaseModel):
    id: str
    content: str
    sender: str  # 'user' or 'agent'
    agent_id: Optional[str] = None
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: Message
    active_agents: List[Agent]
    session_id: str

class LLMProvider(BaseModel):
    name: str
    available: bool
    models: List[str]
    status: str

class LLMProvidersResponse(BaseModel):
    providers: Dict[str, LLMProvider]
    default: str 