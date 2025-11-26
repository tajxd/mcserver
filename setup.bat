@echo off
echo ========================================
echo SPSE Minecraft Server Setup
echo ========================================
echo.

REM Backend setup
echo [1/4] Installing backend dependencies...
cd server
call npm install
cd..

echo.
echo [2/4] Installing frontend dependencies...
cd client
call npm install
cd..

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the server:
echo   1. Open terminal 1 and run: cd server && npm start
echo   2. Open terminal 2 and run: cd client && npm start
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Admin Panel:
echo   Username: Admin
echo   Password: mcserver256i
echo.
pause
