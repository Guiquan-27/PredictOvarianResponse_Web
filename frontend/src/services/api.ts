import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config';

// API 基础配置
const API_BASE_URL = API_CONFIG.BASE_URL;
const API_TIMEOUT = API_CONFIG.TIMEOUT;

// 创建 axios 实例
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', error.response?.status, error.message);
    
    // 统一错误处理
    const errorMessage = getErrorMessage(error);
    
    // 根据错误类型进行处理
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请检查网络连接');
    }
    
    if (!error.response) {
      throw new Error('网络连接失败，请检查网络状态');
    }
    
    switch (error.response.status) {
      case 400:
        throw new Error(`请求参数错误: ${errorMessage}`);
      case 404:
        throw new Error('请求的资源不存在');
      case 500:
        throw new Error(`服务器内部错误: ${errorMessage}`);
      case 503:
        throw new Error('服务暂时不可用，请稍后再试');
      default:
        throw new Error(errorMessage || '未知错误');
    }
  }
);

// 提取错误消息的辅助函数
function getErrorMessage(error: AxiosError): string {
  if (error.response?.data) {
    const data = error.response.data as any;
    return data.message || data.error || data.details || '未知错误';
  }
  return error.message || '网络请求失败';
}

// 重试机制配置
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      // 如果是最后一次重试，直接抛出错误
      if (i === maxRetries) {
        throw lastError;
      }
      
      // 只对特定错误进行重试
      if (shouldRetry(error as AxiosError)) {
        console.log(`请求失败，${delay}ms后进行第${i + 1}次重试...`);
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1))); // 指数退避
      } else {
        throw lastError;
      }
    }
  }
  
  throw lastError!;
};

// 判断是否应该重试
function shouldRetry(error: AxiosError): boolean {
  // 网络错误或5xx服务器错误才重试
  return (
    !error.response || 
    error.response.status >= 500 ||
    error.code === 'ECONNABORTED' ||
    error.code === 'NETWORK_ERROR'
  );
}

export default apiClient; 