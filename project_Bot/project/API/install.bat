@echo off
echo 🔧 Setting up Agentic Travel API...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo ⬆️ Upgrading pip...
python -m pip install --upgrade pip

REM Install requirements
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Copy environment file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️ Please edit .env and add your OPENAI_API_KEY
)

echo ✅ Setup complete!
echo.
echo 🚀 To start the server:
echo    venv\Scripts\activate.bat
echo    python run.py
echo.
echo 📚 API Documentation will be available at: http://localhost:8000/docs
pause