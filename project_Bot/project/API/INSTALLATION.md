# Python Installation Guide

## 📋 Required Python Libraries

To run this LangChain + LangGraph chatbot application on a fresh machine, you need to install these Python packages:

### Core Dependencies:
```bash
pip install fastapi==0.104.1
pip install uvicorn[standard]==0.24.0
pip install langchain==0.1.0
pip install langchain-openai==0.0.2
pip install langchain-anthropic==0.1.0
pip install langchain-google-genai==0.0.5
pip install langchain-cohere==0.1.0
pip install langgraph==0.0.20
pip install pydantic==2.5.0
pip install python-dotenv==1.0.0
pip install httpx==0.25.2
pip install python-multipart==0.0.6
pip install openai==1.3.0
```

## 🚀 Quick Installation Methods

### Method 1: Using requirements.txt (Recommended)
```bash
cd API
pip install -r requirements.txt
```

### Method 2: One-line installation
```bash
pip install fastapi==0.104.1 uvicorn[standard]==0.24.0 langchain==0.1.0 langchain-openai==0.0.2 langchain-anthropic==0.1.0 langchain-google-genai==0.0.5 langchain-cohere==0.1.0 langgraph==0.0.20 pydantic==2.5.0 python-dotenv==1.0.0 httpx==0.25.2 python-multipart==0.0.6 openai==1.3.0
```

### Method 3: Using virtual environment (Best Practice)
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
cd API
pip install -r requirements.txt
```

## 📦 What Each Library Does:

| Library | Purpose |
|---------|---------|
| `fastapi` | Web framework for building APIs |
| `uvicorn` | ASGI server to run FastAPI |
| `langchain` | Core LangChain framework |
| `langchain-openai` | OpenAI integration for LangChain |
| `langchain-anthropic` | Anthropic Claude integration |
| `langchain-google-genai` | Google Gemini integration |
| `langchain-cohere` | Cohere AI integration |
| `langgraph` | Graph-based workflow orchestration |
| `pydantic` | Data validation and serialization |
| `python-dotenv` | Environment variable management |
| `httpx` | HTTP client for async requests |
| `python-multipart` | File upload support |
| `openai` | Direct OpenAI API client |

## 🔧 Prerequisites

Before installing, make sure you have:
- **Python 3.8+** installed
- **pip** package manager
- **Virtual environment** (recommended)

## ⚙️ Environment Setup

After installing packages, create a `.env` file:
```bash
cd API
cp .env.example .env
```

Add your API keys to `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
COHERE_API_KEY=your_cohere_api_key_here
```

## 🚀 Start the Server

```bash
cd API
python run.py
```

The API will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

## 🐛 Troubleshooting

### Common Issues:

1. **Python version too old**:
   ```bash
   python --version  # Should be 3.8+
   ```

2. **Permission errors**:
   ```bash
   pip install --user -r requirements.txt
   ```

3. **Virtual environment issues**:
   ```bash
   deactivate
   rm -rf venv
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   ```

4. **Package conflicts**:
   ```bash
   pip install --upgrade pip
   pip install --force-reinstall -r requirements.txt
   ```

## ✅ Verification

Test if everything is working:
```bash
python -c "import fastapi, langchain, langgraph; print('✅ All packages installed successfully!')"
```

That's it! Your Python environment should be ready to run the LangChain + LangGraph chatbot! 🤖✨