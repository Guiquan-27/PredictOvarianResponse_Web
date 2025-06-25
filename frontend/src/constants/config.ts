// API 配置
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  ENDPOINTS: {
    PREDICT: '/predict',
    HEALTH: '/health',
  },
} as const;

// 应用配置
export const APP_CONFIG = {
  TITLE: import.meta.env.VITE_APP_TITLE || '卵巢反应预测工具',
  VERSION: import.meta.env.VITE_APP_VERSION || '0.1.0',
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true',
} as const;

// 表单配置
export const FORM_CONFIG = {
  DEBOUNCE_DELAY: 300,
  VALIDATION_DELAY: 500,
} as const;

// 图表配置
export const CHART_CONFIG = {
  COLORS: {
    PRIMARY: '#1890ff',
    SUCCESS: '#52c41a',
    WARNING: '#faad14',
    ERROR: '#f5222d',
    LOW_RISK: '#52c41a',
    MEDIUM_RISK: '#faad14',
    HIGH_RISK: '#f5222d',
  },
  ANIMATION_DURATION: 300,
} as const; 