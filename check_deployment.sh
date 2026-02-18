#!/bin/bash

echo "========================================="
echo "部署状态检查"
echo "========================================="
echo ""

# 检查前端
echo "1. 检查 Vercel 前端..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://predict-ovarian-response-web.vercel.app/)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "   ✅ 前端正常 (HTTP $FRONTEND_STATUS)"
else
    echo "   ❌ 前端异常 (HTTP $FRONTEND_STATUS)"
fi
echo ""

# 检查后端
echo "2. 检查 Railway 后端..."
BACKEND_URL="https://predictovarianresponseweb-production.up.railway.app"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health")
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "   ✅ 后端正常 (HTTP $BACKEND_STATUS)"
    echo "   后端响应:"
    curl -s "$BACKEND_URL/health" | python3 -m json.tool
else
    echo "   ❌ 后端异常 (HTTP $BACKEND_STATUS)"
    echo "   错误详情:"
    curl -s "$BACKEND_URL/health" | python3 -m json.tool 2>/dev/null || echo "   无法连接到后端"
fi
echo ""

# 解决建议
echo "========================================="
echo "解决建议"
echo "========================================="
if [ "$BACKEND_STATUS" != "200" ]; then
    echo ""
    echo "后端服务未运行，请按以下步骤操作："
    echo ""
    echo "1. 登录 Railway: https://railway.app"
    echo "2. 找到项目: predictovarianresponseweb-production"
    echo "3. 检查服务状态:"
    echo "   - 如果显示 'Sleeping'，点击 'Restart'"
    echo "   - 如果项目不存在，需要重新部署"
    echo ""
    echo "重新部署步骤："
    echo "   a. New Project → Deploy from GitHub"
    echo "   b. 选择你的仓库"
    echo "   c. Railway 会自动使用 railway.json 配置"
    echo "   d. 等待部署完成（约 2-3 分钟）"
    echo ""
    echo "或者使用本地开发:"
    echo "   ./start_system.sh"
    echo "   访问: http://localhost:3000"
    echo ""
else
    echo "✅ 所有服务正常运行!"
fi

echo "========================================="
