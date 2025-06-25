import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { predictionService } from '../predictionService';
import { apiClient } from '../api';
import type { PredictionRequest, PredictionResponse } from '../../types/prediction';

// 模拟API客户端
vi.mock('../api');
const mockApiClient = vi.mocked(apiClient);

describe('PredictionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('predict', () => {
    const mockRequest: PredictionRequest = {
      Age: 30,
      Duration: 12,
      Weight: 60,
      FSH: 8.5,
      LH: 4.2,
      AMH: 2.1,
      AFC: 12,
      DBP: 80,
      WBC: 6.5,
      RBC: 4.2,
      ALT: 25,
      P: 1.2,
      PLT: 250,
      POIorDOR: 0,
      PCOS: 0,
    };

    const mockResponse: PredictionResponse = {
      prediction: {
        POR_probability: 0.15,
        HOR_probability: 0.25,
      },
      status: 'success',
      timestamp: '2024-01-15T10:30:00Z',
    };

    it('should make successful prediction request', async () => {
      mockApiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await predictionService.predict(mockRequest);

      expect(mockApiClient.post).toHaveBeenCalledWith('/predict', mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should validate request data before sending', async () => {
      const invalidRequest = { ...mockRequest, Age: -1 };
      
      await expect(predictionService.predict(invalidRequest as any))
        .rejects.toThrow('输入数据验证失败');
    });

    it('should handle API errors gracefully', async () => {
      mockApiClient.post.mockRejectedValue(new Error('API Error'));

      await expect(predictionService.predict(mockRequest))
        .rejects.toThrow('预测请求失败');
    });

    it('should transform data correctly', async () => {
      mockApiClient.post.mockResolvedValue({ data: mockResponse });

      await predictionService.predict(mockRequest);

      const expectedPayload = {
        ...mockRequest,
        // 验证数据转换逻辑
      };

      expect(mockApiClient.post).toHaveBeenCalledWith('/predict', expectedPayload);
    });
  });

  describe('healthCheck', () => {
    it('should return true for healthy API', async () => {
      mockApiClient.get.mockResolvedValue({ 
        data: { status: 'healthy', timestamp: new Date().toISOString() }
      });

      const result = await predictionService.healthCheck();

      expect(mockApiClient.get).toHaveBeenCalledWith('/health');
      expect(result).toBe(true);
    });

    it('should return false for unhealthy API', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Health check failed'));

      const result = await predictionService.healthCheck();

      expect(result).toBe(false);
    });
  });

  describe('validatePredictionData', () => {
    it('should validate correct data', () => {
      const validData: PredictionRequest = {
        Age: 30,
        Duration: 12,
        Weight: 60,
        FSH: 8.5,
        LH: 4.2,
        AMH: 2.1,
        AFC: 12,
        DBP: 80,
        WBC: 6.5,
        RBC: 4.2,
        ALT: 25,
        P: 1.2,
        PLT: 250,
        POIorDOR: 0,
        PCOS: 0,
      };

      expect(() => predictionService.validatePredictionData(validData)).not.toThrow();
    });

    it('should reject data with missing fields', () => {
      const invalidData = { Age: 30 } as any;

      expect(() => predictionService.validatePredictionData(invalidData))
        .toThrow('输入数据验证失败');
    });

    it('should reject data with invalid ranges', () => {
      const invalidData: PredictionRequest = {
        Age: -1, // 无效年龄
        Duration: 12,
        Weight: 60,
        FSH: 8.5,
        LH: 4.2,
        AMH: 2.1,
        AFC: 12,
        DBP: 80,
        WBC: 6.5,
        RBC: 4.2,
        ALT: 25,
        P: 1.2,
        PLT: 250,
        POIorDOR: 0,
        PCOS: 0,
      };

      expect(() => predictionService.validatePredictionData(invalidData))
        .toThrow('输入数据验证失败');
    });

    it('should validate individual field constraints', () => {
      const testCases = [
        { field: 'Age', value: 0, shouldFail: true },
        { field: 'Age', value: 18, shouldFail: false },
        { field: 'Age', value: 45, shouldFail: false },
        { field: 'Age', value: 50, shouldFail: true },
        { field: 'Weight', value: 30, shouldFail: true },
        { field: 'Weight', value: 50, shouldFail: false },
        { field: 'Weight', value: 150, shouldFail: false },
        { field: 'FSH', value: -1, shouldFail: true },
        { field: 'FSH', value: 50, shouldFail: true },
      ];

      testCases.forEach(({ field, value, shouldFail }) => {
        const data = {
          Age: 30,
          Duration: 12,
          Weight: 60,
          FSH: 8.5,
          LH: 4.2,
          AMH: 2.1,
          AFC: 12,
          DBP: 80,
          WBC: 6.5,
          RBC: 4.2,
          ALT: 25,
          P: 1.2,
          PLT: 250,
          POIorDOR: 0,
          PCOS: 0,
          [field]: value,
        };

        if (shouldFail) {
          expect(() => predictionService.validatePredictionData(data))
            .toThrow(`输入数据验证失败`);
        } else {
          expect(() => predictionService.validatePredictionData(data))
            .not.toThrow();
        }
      });
    });
  });
}); 