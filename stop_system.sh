#!/bin/bash

echo "🛑 Stopping Ovarian Response Prediction System..."

# Kill processes by PID if files exist
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if kill $BACKEND_PID 2>/dev/null; then
        echo "✅ Backend server stopped (PID: $BACKEND_PID)"
    else
        echo "⚠️  Backend server was not running or already stopped"
    fi
    rm -f logs/backend.pid
fi

if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if kill $FRONTEND_PID 2>/dev/null; then
        echo "✅ Frontend server stopped (PID: $FRONTEND_PID)"
    else
        echo "⚠️  Frontend server was not running or already stopped"
    fi
    rm -f logs/frontend.pid
fi

# Kill any remaining processes
echo "🧹 Cleaning up any remaining processes..."
pkill -f "python3.*simple_api" 2>/dev/null && echo "✅ Killed remaining Python API processes"
pkill -f "npm.*dev" 2>/dev/null && echo "✅ Killed remaining npm dev processes"
pkill -f "vite" 2>/dev/null && echo "✅ Killed remaining vite processes"

# Wait a moment for processes to fully terminate
sleep 2

echo ""
echo "🏁 System stopped successfully!"
echo ""
echo "To restart the system, run: ./start_system.sh"