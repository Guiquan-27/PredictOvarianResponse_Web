#!/bin/bash

echo "🚀 Starting Ovarian Response Prediction System..."

# Check if in correct directory
if [ ! -f "CLAUDE.md" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Create logs directory
mkdir -p logs

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "python3.*simple_api" 2>/dev/null || true
pkill -f "npm.*dev" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2

# Start backend API server
echo "📡 Starting backend API server on port 8080..."
python3 simple_api.py > logs/backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend server to start..."
sleep 3

# Check if backend is running
if curl -s http://localhost:8080/health > /dev/null; then
    echo "✅ Backend server started successfully (PID: $BACKEND_PID)"
else
    echo "❌ Backend server failed to start"
    echo "Backend log:"
    cat logs/backend.log
    exit 1
fi

# Start frontend development server
echo "🌐 Starting frontend development server..."
cd frontend

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend server
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
echo "⏳ Waiting for frontend server to start..."
sleep 5

# Check frontend server
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend server started successfully (PID: $FRONTEND_PID)"
else
    echo "❌ Frontend server failed to start"
    echo "Frontend log:"
    cat logs/frontend.log
    # Kill backend if frontend fails
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Save process IDs
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid

echo ""
echo "🎉 System started successfully!"
echo ""
echo "📱 Frontend Interface: http://localhost:3000"
echo "🔌 Backend API: http://localhost:8080"
echo "📊 Health Check: http://localhost:8080/health"
echo ""
echo "📝 Log files:"
echo "   Backend log: logs/backend.log"
echo "   Frontend log: logs/frontend.log"
echo ""
echo "🛑 To stop the system: ./stop_system.sh"
echo ""

# Test the system
echo "🧪 Testing system integration..."
API_RESPONSE=$(curl -s http://localhost:8080/health)
if [[ $API_RESPONSE == *"API is running"* ]]; then
    echo "✅ API health check passed"
else
    echo "⚠️  API health check failed"
fi

echo ""
echo "Press Ctrl+C to view logs, or run ./stop_system.sh to stop services"

# Follow logs
tail -f logs/backend.log logs/frontend.log