/**
 * 应用配置
 */

// API 配置
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  MAX_RETRIES: Number(import.meta.env.VITE_MAX_RETRIES) || 3,
} as const;

// 应用信息
export const APP_CONFIG = {
  TITLE: import.meta.env.VITE_APP_TITLE || '卵巢反应预测系统',
  VERSION: import.meta.env.VITE_APP_VERSION || '0.1.0',
  DESCRIPTION: '基于机器学习的卵巢反应预测工具',
} as const;

// 调试配置
export const DEBUG_CONFIG = {
  ENABLED: import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV,
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
} as const;

// 表单配置
export const FORM_CONFIG = {
  AUTO_SAVE: true,
  AUTO_SAVE_INTERVAL: 30000, // 30秒
  MAX_HISTORY_ITEMS: 20,
} as const;

// API 端点
export const API_ENDPOINTS = {
  PREDICT: '/predict',
  HEALTH: '/health',
} as const;

// 预测结果阈值配置
export const PREDICTION_THRESHOLDS = {
  HIGH_RISK: 0.7,
  MEDIUM_RISK: 0.3,
  LOW_RISK: 0.0,
} as const;

// 导出所有配置
export const CONFIG = {
  API: API_CONFIG,
  APP: APP_CONFIG,
  DEBUG: DEBUG_CONFIG,
  FORM: FORM_CONFIG,
  ENDPOINTS: API_ENDPOINTS,
  THRESHOLDS: PREDICTION_THRESHOLDS,
} as const;

export default CONFIG; 