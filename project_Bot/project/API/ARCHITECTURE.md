# API Architecture Guide

## 📁 File Structure & Flow

```
API/
├── 1. Configuration Files
│   ├── .env.example          # Environment variables template
│   ├── requirements.txt      # Python dependencies
│   └── setup.py             # Package configuration
│
├── 2. Entry Points
│   ├── run.py               # Main server startup script
│   └── install.sh/bat       # Installation scripts
│
├── 3. Core Application
│   └── src/
│       ├── main.py          # FastAPI application setup
│       ├── models/          # Data structures
│       ├── routes/          # API endpoints
│       └── agents/          # AI agent system
```

---

## 🔧 1. CONFIGURATION FILES

### `.env.example` - Environment Template
```bash
OPENAI_API_KEY=your_openai_api_key_here
ENVIRONMENT=development
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
HOST=127.0.0.1
PORT=8000
```

**Purpose**: Template for environment variables
**Usage**: Copy to `.env` and add your OpenAI API key

### `requirements.txt` - Python Dependencies
```
fastapi==0.104.1          # Web framework
uvicorn==0.24.0          # ASGI server
langchain==0.1.0         # LangChain framework
langchain-openai==0.0.2  # OpenAI integration
langgraph==0.0.20        # Graph-based workflows
pydantic==2.5.0          # Data validation
python-dotenv==1.0.0     # Environment variables
```

**Purpose**: Defines all Python packages needed
**Usage**: `pip install -r requirements.txt`

### `setup.py` - Package Configuration
**Purpose**: Defines the package metadata and dependencies
**Usage**: Alternative installation method with `pip install -e .`

---

## 🚀 2. ENTRY POINTS

### `run.py` - Main Server Startup
```python
#!/usr/bin/env python3
import uvicorn
from src.main import app

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    
    print(f"🚀 Starting Agentic Travel API on {host}:{port}")
    
    uvicorn.run(
        app,
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
```

**Purpose**: 
- Entry point to start the server
- Loads environment variables
- Configures uvicorn ASGI server
- Provides startup information

**Usage**: `python run.py`

### `install.sh` / `install.bat` - Installation Scripts
**Purpose**: Automated setup scripts for different operating systems
**Features**:
- Creates virtual environment
- Installs dependencies
- Sets up environment file
- Provides usage instructions

---

## 🏗️ 3. CORE APPLICATION

### `src/main.py` - FastAPI Application Setup
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .routes.chat import router as chat_router

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Agentic AI Travel Assistant API",
    description="LangChain + LangGraph powered travel AI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(CORSMiddleware, ...)

# Include routers
app.include_router(chat_router, prefix="/api", tags=["chat"])
```

**Purpose**:
- Creates the main FastAPI application
- Configures CORS for frontend communication
- Loads environment variables
- Sets up API documentation
- Includes route handlers

**Key Features**:
- Health check endpoint (`/health`)
- Automatic API documentation (`/docs`)
- CORS configuration for React frontend

---

## 📊 4. DATA MODELS

### `src/models/__init__.py`
**Purpose**: Makes the models directory a Python package

### `src/models/agent.py` - Data Structures
```python
from pydantic import BaseModel
from enum import Enum

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
```

**Purpose**:
- Defines data structures using Pydantic
- Ensures type safety and validation
- Provides API request/response models
- Defines agent types and properties

---

## 🛣️ 5. API ROUTES

### `src/routes/__init__.py`
**Purpose**: Makes the routes directory a Python package

### `src/routes/chat.py` - Chat Endpoints
```python
from fastapi import APIRouter, HTTPException
from ..agents.agent_registry import AgentRegistry
from ..agents.langgraph_workflow import TravelAgentWorkflow

router = APIRouter()
agent_registry = AgentRegistry()
workflow = TravelAgentWorkflow(agent_registry)

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # Process message through LangGraph workflow
    result = await workflow.process_message(
        message=request.message,
        context={"user_id": request.user_id}
    )
    # Return structured response
    return ChatResponse(...)

@router.get("/agents")
async def get_agents():
    # Return all available agents
    
@router.post("/agents/{agent_id}/activate")
async def activate_agent(agent_id: str):
    # Activate specific agent
```

**Purpose**:
- Handles all chat-related API endpoints
- Processes messages through LangGraph workflow
- Manages agent activation/deactivation
- Returns structured responses to frontend

**Key Endpoints**:
- `POST /api/chat` - Main chat processing
- `GET /api/agents` - Get all agents
- `GET /api/agents/active` - Get active agents
- `POST /api/agents/{id}/activate` - Activate agent

---

## 🤖 6. AI AGENT SYSTEM

### `src/agents/__init__.py`
**Purpose**: Makes the agents directory a Python package

### `src/agents/agent_registry.py` - Agent Management
```python
class AgentRegistry:
    def __init__(self):
        self.agents: Dict[str, Agent] = {}
        self._initialize_agents()
    
    def _initialize_agents(self):
        # Creates 6 specialized agents:
        # - Travel Orchestrator (main coordinator)
        # - Itinerary Planner (trip planning)
        # - Booking Specialist (reservations)
        # - Suggestion Engine (recommendations)
        # - Seasonal Analyst (weather/timing)
        # - Offers Manager (deals/promotions)
    
    def get_agent(self, agent_id: str) -> Optional[Agent]:
        # Get specific agent by ID
    
    def activate_agent(self, agent_id: str) -> bool:
        # Activate agent for processing
```

**Purpose**:
- Manages all AI agents in the system
- Provides agent metadata and configuration
- Handles agent activation/deactivation
- Defines agent specializations and personalities

**Features**:
- 6 specialized agents with unique roles
- Agent activation tracking
- Color coding and icons for UI
- Specialization areas for each agent

### `src/agents/langgraph_workflow.py` - LangGraph Workflows
```python
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

class WorkflowState(TypedDict):
    message: str
    context: Dict[str, Any]
    intent: str
    agent_id: str
    response: str
    confidence: float

class TravelAgentWorkflow:
    def __init__(self, agent_registry: AgentRegistry):
        self.agent_registry = agent_registry
        self.llm = ChatOpenAI(model="gpt-4")
        self.workflow = self._create_workflow()
    
    def _create_workflow(self) -> StateGraph:
        workflow = StateGraph(WorkflowState)
        
        # Add workflow nodes
        workflow.add_node("intent_analysis", self._analyze_intent)
        workflow.add_node("route_agent", self._route_to_agent)
        workflow.add_node("process_message", self._process_with_agent)
        workflow.add_node("orchestrator_fallback", self._orchestrator_response)
        
        # Define workflow flow
        workflow.set_entry_point("intent_analysis")
        workflow.add_edge("intent_analysis", "route_agent")
        workflow.add_conditional_edges("route_agent", ...)
        
        return workflow.compile()
```

**Purpose**:
- Implements real LangGraph workflows
- Routes messages to appropriate agents
- Processes messages with OpenAI GPT-4
- Manages conversation state and context

**Workflow Steps**:
1. **Intent Analysis** - Classifies user message intent
2. **Agent Routing** - Selects best specialist agent
3. **Message Processing** - Generates response with GPT-4
4. **Orchestrator Fallback** - Handles general queries

**Key Features**:
- Real LangGraph StateGraph implementation
- OpenAI GPT-4 integration
- Intelligent intent classification
- Specialized system prompts for each agent
- Error handling and fallbacks

---

## 🔄 EXECUTION FLOW

1. **Startup**: `run.py` → `main.py` → FastAPI app starts
2. **Request**: Frontend sends message to `/api/chat`
3. **Processing**: `chat.py` → `langgraph_workflow.py` → OpenAI GPT-4
4. **Response**: Structured response back to frontend
5. **Agent Management**: Registry tracks active agents

## 🎯 KEY TECHNOLOGIES

- **FastAPI**: Modern Python web framework
- **LangChain**: AI application framework
- **LangGraph**: Workflow orchestration
- **OpenAI GPT-4**: Language model
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

This architecture provides a scalable, maintainable AI system with real LangChain + LangGraph workflows!