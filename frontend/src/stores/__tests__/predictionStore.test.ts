import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { usePredictionStore } from '../predictionStore';
import type { PredictionRequest, PredictionResponse, PredictionRecord } from '../../types/prediction';

// 模拟localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

describe('PredictionStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 重置store状态
    usePredictionStore.setState({
      formData: null,
      prediction: null,
      isLoading: false,
      error: null,
      history: [],
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = usePredictionStore.getState();
      
      expect(state.formData).toBeNull();
      expect(state.prediction).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.history).toEqual([]);
    });
  });

  describe('setFormData', () => {
    it('should update form data', () => {
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

      usePredictionStore.getState().setFormData(mockFormData);
      
      expect(usePredictionStore.getState().formData).toEqual(mockFormData);
    });

    it('should clear error when setting new form data', () => {
      usePredictionStore.setState({ error: 'Previous error' });
      
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

      usePredictionStore.getState().setFormData(mockFormData);
      
      expect(usePredictionStore.getState().error).toBeNull();
    });
  });

  describe('setPrediction', () => {
    it('should update prediction result', () => {
      const mockPrediction: PredictionResponse = {
        prediction: {
          POR_probability: 0.15,
          HOR_probability: 0.25,
        },
        status: 'success',
        timestamp: '2024-01-15T10:30:00Z',
      };

      usePredictionStore.getState().setPrediction(mockPrediction);
      
      expect(usePredictionStore.getState().prediction).toEqual(mockPrediction);
    });
  });

  describe('setLoading', () => {
    it('should update loading state', () => {
      usePredictionStore.getState().setLoading(true);
      
      expect(usePredictionStore.getState().isLoading).toBe(true);
    });

    it('should clear error when setting loading to true', () => {
      usePredictionStore.setState({ error: 'Previous error' });
      
      usePredictionStore.getState().setLoading(true);
      
      expect(usePredictionStore.getState().error).toBeNull();
    });
  });

  describe('setError', () => {
    it('should update error state', () => {
      const errorMessage = 'Test error';
      
      usePredictionStore.getState().setError(errorMessage);
      
      expect(usePredictionStore.getState().error).toBe(errorMessage);
    });

    it('should clear loading when setting error', () => {
      usePredictionStore.setState({ isLoading: true });
      
      usePredictionStore.getState().setError('Test error');
      
      expect(usePredictionStore.getState().isLoading).toBe(false);
    });
  });

  describe('addToHistory', () => {
    it('should add prediction record to history', () => {
      const mockRecord: PredictionRecord = {
        id: '1',
        timestamp: '2024-01-15T10:30:00Z',
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

      usePredictionStore.getState().addToHistory(mockRecord);
      
      expect(usePredictionStore.getState().history).toContain(mockRecord);
    });

    it('should persist history to localStorage', () => {
      const mockRecord: PredictionRecord = {
        id: '1',
        timestamp: '2024-01-15T10:30:00Z',
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

      usePredictionStore.getState().addToHistory(mockRecord);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'prediction_history',
        JSON.stringify([mockRecord])
      );
    });
  });

  describe('removeFromHistory', () => {
    it('should remove record from history by id', () => {
      const mockRecord: PredictionRecord = {
        id: '1',
        timestamp: '2024-01-15T10:30:00Z',
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

      usePredictionStore.setState({ history: [mockRecord] });
      
      usePredictionStore.getState().removeFromHistory('1');
      
      expect(usePredictionStore.getState().history).toEqual([]);
    });

    it('should persist updated history to localStorage', () => {
      const mockRecord: PredictionRecord = {
        id: '1',
        timestamp: '2024-01-15T10:30:00Z',
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

      usePredictionStore.setState({ history: [mockRecord] });
      
      usePredictionStore.getState().removeFromHistory('1');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'prediction_history',
        JSON.stringify([])
      );
    });
  });

  describe('clearHistory', () => {
    it('should clear all history', () => {
      const mockHistory: PredictionRecord[] = [
        {
          id: '1',
          timestamp: '2024-01-15T10:30:00Z',
          formData: {} as PredictionRequest,
          prediction: {} as PredictionResponse,
        },
        {
          id: '2',
          timestamp: '2024-01-15T11:30:00Z',
          formData: {} as PredictionRequest,
          prediction: {} as PredictionResponse,
        },
      ];

      usePredictionStore.setState({ history: mockHistory });
      
      usePredictionStore.getState().clearHistory();
      
      expect(usePredictionStore.getState().history).toEqual([]);
    });

    it('should remove history from localStorage', () => {
      usePredictionStore.getState().clearHistory();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('prediction_history');
    });
  });

  describe('loadHistory', () => {
    it('should load history from localStorage', () => {
      const mockHistory: PredictionRecord[] = [
        {
          id: '1',
          timestamp: '2024-01-15T10:30:00Z',
          formData: {} as PredictionRequest,
          prediction: {} as PredictionResponse,
        },
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory));
      
      usePredictionStore.getState().loadHistory();
      
      expect(usePredictionStore.getState().history).toEqual(mockHistory);
    });

    it('should handle invalid localStorage data', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      usePredictionStore.getState().loadHistory();
      
      expect(usePredictionStore.getState().history).toEqual([]);
    });

    it('should handle empty localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      usePredictionStore.getState().loadHistory();
      
      expect(usePredictionStore.getState().history).toEqual([]);
    });
  });

  describe('resetStore', () => {
    it('should reset store to initial state', () => {
      // 设置一些状态
      usePredictionStore.setState({
        formData: {} as PredictionRequest,
        prediction: {} as PredictionResponse,
        isLoading: true,
        error: 'Some error',
        history: [{} as PredictionRecord],
      });

      usePredictionStore.getState().resetStore();
      
      const state = usePredictionStore.getState();
      expect(state.formData).toBeNull();
      expect(state.prediction).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.history).toEqual([]);
    });
  });
}); 