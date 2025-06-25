import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiClient } from '../api';
import axios from 'axios';

// 模拟axios
vi.mock('axios');
const mockAxios = vi.mocked(axios);

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should create instance with correct config', () => {
    expect(mockAxios.create).toHaveBeenCalledWith({
      baseURL: 'http://127.0.0.1:8000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should handle request interceptor', () => {
    const mockCreate = vi.fn().mockReturnValue({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    });
    mockAxios.create = mockCreate;

    const instance = mockCreate();
    expect(instance.interceptors.request.use).toHaveBeenCalled();
    expect(instance.interceptors.response.use).toHaveBeenCalled();
  });

  it('should handle response interceptor success', () => {
    const mockCreate = vi.fn().mockReturnValue({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    });
    mockAxios.create = mockCreate;

    const instance = mockCreate();
    const responseInterceptor = instance.interceptors.response.use.mock.calls[0][0];
    
    const response = { data: { test: 'data' } };
    expect(responseInterceptor(response)).toBe(response);
  });

  it('should handle response interceptor error', async () => {
    const mockCreate = vi.fn().mockReturnValue({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    });
    mockAxios.create = mockCreate;

    const instance = mockCreate();
    const errorInterceptor = instance.interceptors.response.use.mock.calls[0][1];
    
    const error = {
      response: { status: 500 },
      message: 'Network Error',
    };

    await expect(errorInterceptor(error)).rejects.toThrow('Network Error');
  });

  it('should handle timeout error', async () => {
    const mockCreate = vi.fn().mockReturnValue({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    });
    mockAxios.create = mockCreate;

    const instance = mockCreate();
    const errorInterceptor = instance.interceptors.response.use.mock.calls[0][1];
    
    const error = {
      code: 'ECONNABORTED',
      message: 'timeout',
    };

    await expect(errorInterceptor(error)).rejects.toThrow('请求超时，请检查网络连接');
  });

  it('should handle network error', async () => {
    const mockCreate = vi.fn().mockReturnValue({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    });
    mockAxios.create = mockCreate;

    const instance = mockCreate();
    const errorInterceptor = instance.interceptors.response.use.mock.calls[0][1];
    
    const error = {
      message: 'Network Error',
    };

    await expect(errorInterceptor(error)).rejects.toThrow('网络连接失败，请检查网络设置');
  });
}); 