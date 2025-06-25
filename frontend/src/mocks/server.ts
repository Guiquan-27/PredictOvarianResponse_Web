import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// 设置测试服务器
export const server = setupServer(...handlers);

// 建立API模拟在所有测试之前
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// 每个测试后重置处理器到初始状态
afterEach(() => server.resetHandlers());

// 所有测试完成后清理
afterAll(() => server.close()); 