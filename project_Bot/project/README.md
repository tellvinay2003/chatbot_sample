# Agentic AI ChatBot with LangChain + LangGraph

A sophisticated AI chatbot system built with React, TypeScript, and Tailwind CSS, powered by real LangChain + LangGraph backend.

## 🚀 Features

- **Real LangChain + LangGraph Integration** - No simulation, 100% real AI
- **6 Specialized AI Agents** - Each with unique personalities and expertise
- **Intelligent Routing** - LangGraph workflows route messages to appropriate agents
- **Modern Chat Interface** - Clean, responsive React TypeScript frontend
- **OpenAI GPT-4 Powered** - Real AI responses via LangChain

## 🤖 AI Agents

- **Travel Orchestrator** - Main coordinator and router
- **Itinerary Planner** - Trip planning and scheduling
- **Booking Specialist** - Reservations and availability
- **Suggestion Engine** - Personalized recommendations
- **Seasonal Analyst** - Weather and timing optimization
- **Offers Manager** - Deals and promotions

## 🛠️ Quick Start

### Prerequisites
- Node.js (v18+)
- Python 3.8+
- OpenAI API Key

### 1. Start the Backend (Required)
```bash
cd API
pip install -r requirements.txt
cp .env.example .env
# Add your OPENAI_API_KEY to .env
python run.py
```

### 2. Start the Frontend
```bash
npm install
npm run dev
```

## 🎯 Try These Messages

- "Plan a 5-day trip to Tokyo"
- "Book a hotel in Paris"
- "What's the best time to visit Thailand?"
- "Find me flight deals to Europe"
- "Recommend restaurants in Rome"

## 📁 Project Structure

```
├── API/                    # Python LangChain + LangGraph backend
│   ├── src/agents/        # Real AI agents with LangChain
│   ├── src/routes/        # FastAPI routes
│   └── requirements.txt   # Python dependencies
├── src/
│   ├── components/        # React components
│   ├── services/         # API service
│   └── types/            # TypeScript types
└── package.json          # Node.js dependencies
```

## 🔧 Technology Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS
- Lucide React Icons
- Vite

**Backend:**
- FastAPI
- LangChain + LangGraph
- OpenAI GPT-4
- Python 3.8+

## 📝 License

MIT License