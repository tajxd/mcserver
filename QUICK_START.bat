@echo off
chcp 65001 > nul
color 0A
cls

echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║         SPŠE Minecraft Server - Rýchly Start                      ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

echo Inštrukcie:
echo.
echo 1. Otvorite dva nové príkazové riadky (Command Prompt)
echo.
echo 2. V PRVOM príkazovom riadku napíšte:
echo    cd /d "%cd%\server"
echo    npm start
echo.
echo 3. V DRUHOM príkazovom riadku napíšte:
echo    cd /d "%cd%\client"
echo    npm start
echo.
echo ───────────────────────────────────────────────────────────────────
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Admin Panel Prihlasovanie:
echo   Používateľ: Admin
echo   Heslo: mcserver256i
echo.
echo ───────────────────────────────────────────────────────────────────
echo.
pause
