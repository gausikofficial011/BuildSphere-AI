@echo off
echo ==========================================
echo Starting BuildSphere AI Servers Setup
echo ==========================================

echo.
echo [1/4] Installing Backend Dependencies...
cd backend
python -m pip install -r requirements.txt

echo.
echo [2/4] Starting Backend Server...
:: Opens a new terminal window specifically for the backend
start "BuildSphere Backend" cmd /k "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo [3/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install

echo.
echo [4/4] Starting Frontend Server...
:: Opens a new terminal window specifically for the frontend
start "BuildSphere Frontend" cmd /k "npm run dev"

echo.
echo ==========================================
echo ALL DONE! 
echo Your website will be available at: http://localhost:5173
echo ==========================================
pause
