@echo off

REM Quick Start Script for Todo App (Windows)
REM Makes it easy to start the entire stack

echo.
echo 🚀 Starting Todo App...
echo.
echo This will start:
echo   📦 MongoDB Database
echo   🚀 Express Server (port 5000)
echo   ⚛️  React Client (port 5173)
echo.
echo Press Ctrl+C to stop all services
echo.

REM Build and start all services
docker-compose up --build

