# 卵巢反应预测系统 (Ovarian Response Prediction System)

基于机器学习的卵巢反应预测工具，帮助医生评估IVF治疗中患者的卵巢反应风险。

## 🚀 快速开始

### 启动整个系统
```bash
./start_system.sh
```

### 手动启动

1. **启动后端API服务**
```bash
cd backend
python3 simple_api.py
```

2. **启动前端开发服务器**
```bash
cd frontend
npm install
npm run dev
```

## 📱 访问应用

- **前端界面**: http://localhost:3000
- **后端API**: http://localhost:8000
- **API健康检查**: http://localhost:8000/health

## 🏗️ 项目结构

```
├── backend/                 # 后端API服务
│   └── simple_api.py       # Python API服务器
├── frontend/               # React前端应用
│   ├── src/               # 源代码
│   ├── dist/              # 构建输出
│   └── package.json       # 依赖配置
├── scripts/               # 脚本和工具
│   └── legacy_shiny_app/  # 旧版Shiny应用
├── docs/                  # 文档
├── CLAUDE.md             # Claude Code 使用指南
├── README.md             # 项目说明
└── start_system.sh       # 系统启动脚本
```

## 📋 功能特性

- 🔬 **智能预测**: 基于临床参数预测卵巢反应风险
- 📊 **可视化分析**: 直观的风险评估图表
- 📱 **响应式设计**: 支持各种设备访问
- 🏥 **临床建议**: 基于预测结果提供治疗建议
- 📋 **历史记录**: 保存和管理预测历史

## 💻 技术栈

### 前端
- React 18 + TypeScript
- Ant Design 5 UI组件库
- Vite 构建工具
- Zustand 状态管理

### 后端
- Python 3 HTTP服务器
- JSON数据交换
- CORS跨域支持

## 🔧 开发

### 前端开发
```bash
cd frontend
npm run dev          # 开发服务器
npm run build        # 生产构建
npm run test         # 运行测试
```

### 后端开发
```bash
cd backend
python3 simple_api.py  # 启动API服务器
```

## 📊 API接口

### 健康检查
```
GET /health
```

### 预测接口
```
POST /predict
Content-Type: application/json

{
  "Age": 32,
  "AMH": 2.1,
  "AFC": 12,
  "FSH": 7.2,
  "PCOS": 1,
  "POIorDOR": 2,
  ...
}
```

## 🎯 使用说明

1. 打开浏览器访问 http://localhost:3000
2. 填写患者临床参数
3. 点击"开始预测"按钮
4. 查看预测结果和临床建议
5. 可导出或打印预测报告

## 🔒 免责声明

此预测结果仅供医疗专业人员参考，不应作为诊断或治疗的唯一依据。请结合患者的完整病史、体格检查和其他相关检查结果进行综合判断。

## 📄 许可证

本项目仅供学术研究使用。