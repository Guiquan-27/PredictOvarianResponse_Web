import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePrediction } from '../usePrediction';
import { predictionService } from '../../services/predictionService';
import { usePredictionStore } from '../../stores/predictionStore';
import type { PredictionRequest, PredictionResponse } from '../../types/prediction';

// 模拟依赖
vi.mock('../../services/predictionService');
vi.mock('../../stores/predictionStore');

const mockPredictionService = vi.mocked(predictionService);
const mockStore = {
  formData: null,
  prediction: null,
  isLoading: false,
  error: null,
  history: [],
  setFormData: vi.fn(),
  setPrediction: vi.fn(),
  setLoading: vi.fn(),
  setError: vi.fn(),
  addToHistory: vi.fn(),
  removeFromHistory: vi.fn(),
  clearHistory: vi.fn(),
  loadHistory: vi.fn(),
  resetStore: vi.fn(),
};

describe('usePrediction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePredictionStore as any).mockReturnValue(mockStore);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('submitPrediction', () => {
    const mockFormData: PredictionRequest = {
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

    it('should handle successful prediction', async () => {
      mockPredictionService.predict.mockResolvedValue(mockResponse);
      
      const { result } = renderHook(() => usePrediction());

      await act(async () => {
        await result.current.submitPrediction(mockFormData);
      });

      expect(mockStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockStore.setFormData).toHaveBeenCalledWith(mockFormData);
      expect(mockPredictionService.predict).toHaveBeenCalledWith(mockFormData);
      expect(mockStore.setPrediction).toHaveBeenCalledWith(mockResponse);
      expect(mockStore.addToHistory).toHaveBeenCalled();
      expect(mockStore.setLoading).toHaveBeenCalledWith(false);
    });

    it('should handle prediction errors', async () => {
      const errorMessage = 'Prediction failed';
      mockPredictionService.predict.mockRejectedValue(new Error(errorMessage));
      
      const { result } = renderHook(() => usePrediction());

      await act(async () => {
        await result.current.submitPrediction(mockFormData);
      });

      expect(mockStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockStore.setError).toHaveBeenCalledWith(`预测请求失败: ${errorMessage}`);
      expect(mockStore.setLoading).toHaveBeenCalledWith(false);
    });

    it('should validate form data before submission', async () => {
      const invalidFormData = { ...mockFormData, Age: -1 };
      
      const { result } = renderHook(() => usePrediction());

      await act(async () => {
        await result.current.submitPrediction(invalidFormData as any);
      });

      expect(mockStore.setError).toHaveBeenCalledWith(
        expect.stringContaining('数据验证失败')
      );
      expect(mockPredictionService.predict).not.toHaveBeenCalled();
    });
  });

  describe('validateForm', () => {
    it('should return true for valid form data', () => {
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

      const { result } = renderHook(() => usePrediction());
      
      expect(result.current.validateForm(validData)).toBe(true);
    });

    it('should return false for invalid form data', () => {
      const invalidData = { Age: 30 } as any;

      const { result } = renderHook(() => usePrediction());
      
      expect(result.current.validateForm(invalidData)).toBe(false);
    });
  });

  describe('exportData', () => {
    it('should export prediction data as JSON', () => {
      const mockData = {
        formData: {
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
        },
        prediction: {
          prediction: {
            POR_probability: 0.15,
            HOR_probability: 0.25,
          },
          status: 'success',
          timestamp: '2024-01-15T10:30:00Z',
        },
      };

      // 模拟 URL.createObjectURL 和 document.createElement
      const mockUrl = 'blob:mock-url';
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      
      global.URL.createObjectURL = vi.fn().mockReturnValue(mockUrl);
      global.URL.revokeObjectURL = vi.fn();
      global.document.createElement = vi.fn().mockReturnValue(mockLink);
      global.document.body.appendChild = vi.fn();
      global.document.body.removeChild = vi.fn();

      const { result } = renderHook(() => usePrediction());

      act(() => {
        result.current.exportData(mockData);
      });

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
    });
  });

  describe('importData', () => {
    it('should import valid JSON data', () => {
      const mockData = {
        formData: {
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
        },
        prediction: null,
      };

      const jsonString = JSON.stringify(mockData);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const file = new File([blob], 'test.json', { type: 'application/json' });

      const { result } = renderHook(() => usePrediction());

      act(() => {
        result.current.importData(file);
      });

      // 由于 FileReader 是异步的，我们需要等待
      return waitFor(() => {
        expect(mockStore.setFormData).toHaveBeenCalledWith(mockData.formData);
      });
    });

    it('should handle invalid JSON files', async () => {
      const invalidJsonString = 'invalid json';
      const blob = new Blob([invalidJsonString], { type: 'application/json' });
      const file = new File([blob], 'test.json', { type: 'application/json' });

      const { result } = renderHook(() => usePrediction());

      act(() => {
        result.current.importData(file);
      });

      await waitFor(() => {
        expect(mockStore.setError).toHaveBeenCalledWith(
          expect.stringContaining('文件格式错误')
        );
      });
    });

    it('should reject non-JSON files', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });

      const { result } = renderHook(() => usePrediction());

      act(() => {
        result.current.importData(file);
      });

      expect(mockStore.setError).toHaveBeenCalledWith('请选择 JSON 格式的文件');
    });
  });

  describe('checkHealth', () => {
    it('should return health status', async () => {
      mockPredictionService.healthCheck.mockResolvedValue(true);

      const { result } = renderHook(() => usePrediction());

      let healthStatus: boolean | null = null;
      await act(async () => {
        healthStatus = await result.current.checkHealth();
      });

      expect(mockPredictionService.healthCheck).toHaveBeenCalled();
      expect(healthStatus).toBe(true);
    });

    it('should handle health check errors', async () => {
      mockPredictionService.healthCheck.mockRejectedValue(new Error('Health check failed'));

      const { result } = renderHook(() => usePrediction());

      let healthStatus: boolean | null = null;
      await act(async () => {
        healthStatus = await result.current.checkHealth();
      });

      expect(healthStatus).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      const { result } = renderHook(() => usePrediction());

      act(() => {
        result.current.clearError();
      });

      expect(mockStore.setError).toHaveBeenCalledWith(null);
    });
  });

  describe('resetPrediction', () => {
    it('should reset prediction state', () => {
      const { result } = renderHook(() => usePrediction());

      act(() => {
        result.current.resetPrediction();
      });

      expect(mockStore.setPrediction).toHaveBeenCalledWith(null);
      expect(mockStore.setError).toHaveBeenCalledWith(null);
    });
  });
}); 