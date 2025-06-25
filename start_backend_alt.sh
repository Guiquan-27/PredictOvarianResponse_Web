#!/bin/bash

echo "🚀 启动后端API服务器..."

# 尝试不同的端口
for port in 8000 8001 8002 8003 8004; do
    echo "尝试端口 $port..."
    if ! nc -z localhost $port 2>/dev/null; then
        echo "端口 $port 可用，启动服务器..."
        cd backend
        python3 -c "
from http.server import HTTPServer
import simple_api
httpd = HTTPServer(('127.0.0.1', $port), simple_api.PredictionHandler)
print(f'✅ 后端服务器启动成功: http://127.0.0.1:$port')
print(f'📊 健康检查: http://127.0.0.1:$port/health')
httpd.serve_forever()
        " &
        echo "后端服务器已在端口 $port 启动"
        break
    fi
done