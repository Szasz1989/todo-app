#!/bin/bash

# Quick Start Script for Todo App
# Makes it easy to start the entire stack

echo "🚀 Starting Todo App..."
echo ""
echo "This will start:"
echo "  📦 MongoDB Database"
echo "  🚀 Express Server (port 5000)"
echo "  ⚛️  React Client (port 5173)"
echo ""

# Build and start all services
docker-compose up --build

# Note: Use Ctrl+C to stop all services

