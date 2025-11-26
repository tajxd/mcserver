@echo off
echo Starting SPSE Minecraft Server...
echo.

echo Starting backend server...
start cmd /k "cd server && npm start"

timeout /t 3

echo Starting frontend development server...
start cmd /k "cd client && npm start"

echo.
echo Servers are starting...
echo Frontend will open at: http://localhost:3000
echo Backend API at: http://localhost:5000
echo.
