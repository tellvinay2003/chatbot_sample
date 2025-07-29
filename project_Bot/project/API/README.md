# Agentic AI Travel Assistant API

A sophisticated backend API powered by LangChain + LangGraph for intelligent travel assistance with specialized AI agents.

## 🚀 Features

- **6 Specialized AI Agents** with unique personalities and expertise
- **LangGraph Workflows** for intelligent message routing
- **OpenAI GPT-4** integration for natural language processing
- **FastAPI** with automatic documentation
- **Real-time Agent Coordination** with context management
- **RESTful API** for frontend integration

## 🤖 AI Agents

### 1. **Travel Orchestrator** (Main Coordinator)
- Routes requests to appropriate specialists
- Handles general travel queries
- Coordinates multi-agent responses

### 2. **Itinerary Planner**
- Creates detailed day-by-day itineraries
- Optimizes routes and timing
- Balances activities with rest periods

### 3. **Booking Specialist**
- Handles flight, hotel, and activity bookings
- Provides availability and pricing information
- Explains booking policies and terms

### 4. **Suggestion Engine**
- Offers personalized recommendations
- Discovers hidden gems and local favorites
- Tailors suggestions to user preferences

### 5. **Seasonal Analyst**
- Analyzes weather patterns and seasonal trends
- Recommends optimal travel timing
- Considers crowd levels and local events

### 6. **Offers Manager**
- Finds travel deals and promotions
- Tracks pricing trends
- Suggests money-saving strategies

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- OpenAI API Key

### Setup

1. **Clone and navigate to API directory**
   ```bash
   cd API
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Run the server (Method 1 - Recommended)**
   ```bash
   python run.py
   ```

   **Alternative Method 2:**
   ```bash
   python -m src.main
   ```

### Quick Setup (Automated)

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
source venv/bin/activate
python run.py
```

**Windows:**
```cmd
install.bat
venv\Scripts\activate.bat
python run.py
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

### Interactive Documentation
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Main Endpoints

#### Chat Endpoint
```http
POST /api/chat
Content-Type: application/json

{
  "message": "Plan a 5-day trip to Tokyo",
  "user_id": "user123",
  "session_id": "session456"
}
```

**Response:**
```json
{
  "message": {
    "id": "msg_123",
    "content": "🗺️ **Itinerary Planner Active**\n\nI'll create a detailed 5-day Tokyo itinerary...",
    "sender": "agent",
    "agent_id": "itinerary-planner",
    "timestamp": "2024-01-01T12:00:00Z",
    "metadata": {
      "intent": "itinerary",
      "confidence": 0.95,
      "agent_type": "itinerary-planner"
    }
  },
  "active_agents": [...],
  "session_id": "session456"
}
```

#### Get All Agents
```http
GET /api/agents
```

#### Get Active Agents
```http
GET /api/agents/active
```

#### Activate/Deactivate Agent
```http
POST /api/agents/{agent_id}/activate
POST /api/agents/{agent_id}/deactivate
```

## 🧠 LangGraph Workflow

The API uses LangGraph to create intelligent workflows:

1. **Intent Analysis** - Analyzes user message to determine intent
2. **Agent Routing** - Routes to appropriate specialist agent
3. **Message Processing** - Processes with selected agent
4. **Response Generation** - Returns formatted response

### Workflow States
- `intent_analysis` - Determines user intent
- `route_agent` - Selects appropriate agent
- `process_message` - Processes with specialist
- `orchestrator_fallback` - Falls back to orchestrator

## 🔧 Configuration

### Environment Variables
```bash
OPENAI_API_KEY=your_openai_api_key_here
ENVIRONMENT=development
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
HOST=0.0.0.0
PORT=8000
```

### Agent Configuration
Each agent can be customized in their respective files:
- System prompts
- Temperature settings
- Max tokens
- Specialization areas

## 🚀 Deployment

### Production Setup
1. Set environment to production
2. Configure proper CORS origins
3. Use production WSGI server (Gunicorn)
4. Set up proper logging
5. Configure environment variables

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "-m", "src.main"]
```

## 🧪 Testing

### Manual Testing
Use the interactive docs at `/docs` to test endpoints manually.

### Example Queries
- "Plan a 3-day trip to Paris"
- "Book a hotel in Tokyo for next month"
- "What's the best time to visit Thailand?"
- "Find me flight deals to Europe"
- "Recommend restaurants in Rome"

## 🔍 Monitoring

### Health Check
```http
GET /health
```

### Logs
The application logs all requests and agent interactions for debugging and monitoring.

## 🤝 Integration

### Frontend Integration
The API is designed to work with the React frontend in the `Client/` directory. The frontend automatically detects when the API is available and switches from simulation to real AI responses.

### Custom Integration
Use the REST API endpoints to integrate with any frontend framework or application.

## 📝 License

MIT License - see LICENSE file for details.