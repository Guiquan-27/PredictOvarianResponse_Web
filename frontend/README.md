# 卵巢反应预测工具 - 前端应用

基于 React + TypeScript + Ant Design 构建的医疗预测工具前端应用。

## 技术栈

- **框架**: React 18 + TypeScript 5
- **构建工具**: Vite
- **UI 组件库**: Ant Design 5
- **状态管理**: Zustand + React Query
- **表单处理**: React Hook Form + Zod
- **图表可视化**: Recharts
- **代码质量**: ESLint + Prettier + Husky
- **测试框架**: Vitest + React Testing Library + Playwright

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装依赖

```bash
cd frontend
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动，支持热重载。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行 ESLint 检查
- `npm run lint:fix` - 自动修复 ESLint 错误
- `npm run test` - 运行单元测试
- `npm run test:ui` - 运行测试 UI
- `npm run test:coverage` - 生成测试覆盖率报告
- `npm run test:e2e` - 运行端到端测试
- `npm run type-check` - TypeScript 类型检查
- `npm run storybook` - 启动 Storybook

## 项目结构

```
src/
├── components/          # 通用组件
│   ├── ui/             # 基础 UI 组件
│   ├── forms/          # 表单组件
│   └── charts/         # 图表组件
├── pages/              # 页面组件
├── hooks/              # 自定义 Hooks
├── services/           # API 服务
├── stores/             # 状态管理
├── types/              # TypeScript 类型定义
├── utils/              # 工具函数
├── constants/          # 常量定义
├── App.tsx             # 根组件
└── main.tsx            # 应用入口
```

## API 集成

应用通过代理配置与后端 API 通信：

- 开发环境: `http://127.0.0.1:8000`
- API 代理路径: `/api/*` → 后端服务

## 浏览器支持

- Chrome >= 88
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 开发规范

### 代码风格

项目使用 ESLint + Prettier 进行代码格式化，配置了 Git hooks 进行提交前检查。

### 组件开发

- 使用函数组件 + Hooks
- 优先使用 TypeScript 进行类型定义
- 遵循 Ant Design 设计规范
- 编写对应的单元测试

### 提交规范

使用 Conventional Commits 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

## 部署

### 环境变量配置

创建 `.env.production` 文件：

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_API_TIMEOUT=30000
VITE_APP_TITLE=卵巢反应预测工具
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=false
```

### 构建部署

```bash
npm run build
```

构建产物在 `dist/` 目录，可以部署到任何静态文件服务器。

## 许可证

本项目仅供医疗专业人员研究和临床辅助使用。 