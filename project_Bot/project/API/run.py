#!/usr/bin/env python3
"""
Main entry point for running the Agentic Travel API server
"""
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    import uvicorn
    from src.main import app
    
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    
    print("🚀 Starting Agentic Travel API Server")
    print("=" * 50)
    print(f"📍 Server URL: http://{host}:{port}")
    print(f"📚 API Documentation: http://{host}:{port}/docs")
    print(f"🔄 Health Check: http://{host}:{port}/health")
    print(f"🌐 Frontend should connect to: http://localhost:{port}")
    print("=" * 50)
    print("💡 Make sure to:")
    print("   1. Set your OPENAI_API_KEY in .env file")
    print("   2. Install requirements: pip install -r requirements.txt")
    print("   3. Start frontend: npm run dev")
    print("=" * 50)
    
    try:
        uvicorn.run(
            "src.main:app",
            host=host,
            port=port,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)