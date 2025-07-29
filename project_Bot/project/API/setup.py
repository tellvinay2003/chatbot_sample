from setuptools import setup, find_packages

setup(
    name="agentic-travel-api",
    version="1.0.0",
    description="Agentic AI Travel Assistant API with LangChain + LangGraph",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.104.1",
        "uvicorn[standard]==0.24.0",
        "langchain==0.1.0",
        "langchain-openai==0.0.2",
        "langgraph==0.0.20",
        "pydantic==2.5.0",
        "python-dotenv==1.0.0",
        "httpx==0.25.2",
        "python-multipart==0.0.6",
    ],
    python_requires=">=3.8",
)