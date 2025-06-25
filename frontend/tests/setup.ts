import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// 扩展 Vitest 的 expect 函数
expect.extend(matchers);

// 每个测试后清理
afterEach(() => {
  cleanup();
});

// 模拟环境变量
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// 模拟 ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// 模拟 IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
} as any;

// 模拟 scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
});

// 模拟 import.meta.env
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: 'http://127.0.0.1:8000',
        VITE_API_TIMEOUT: '30000',
        VITE_APP_TITLE: '卵巢反应预测工具',
        VITE_APP_VERSION: '0.1.0',
        VITE_DEV_MODE: 'true',
      },
    },
  },
}); 