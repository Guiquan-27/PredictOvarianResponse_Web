import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { PredictionFormData, PredictionType, PredictionResult, PredictionHistory } from '../types/prediction';

interface PredictionStore {
  // Form data
  formData: PredictionFormData;
  predictionType: PredictionType;
  
  // Prediction results
  currentResult: PredictionResult | null;
  
  // History
  history: PredictionHistory[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateFormData: (updates: Partial<PredictionFormData>) => void;
  setPredictionType: (type: PredictionType) => void;
  setResult: (result: PredictionResult) => void;
  addToHistory: (record: PredictionHistory) => void;
  clearHistory: () => void;
  resetForm: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  validateForm: () => boolean;
}

const initialFormData: PredictionFormData = {
  Age: undefined,
  Duration: undefined,
  Weight: undefined,
  FSH: undefined,
  LH: undefined,
  AMH: undefined,
  AFC: undefined,
  P: undefined,
  POIorDOR: false,
  PCOS: false,
  DBP: undefined,
  WBC: undefined,
  RBC: undefined,
  ALT: undefined,
  PLT: undefined,
};

export const usePredictionStore = create<PredictionStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        formData: initialFormData,
        predictionType: 'Both',
        currentResult: null,
        history: [],
        isLoading: false,
        error: null,

        // Actions
        updateFormData: (updates) =>
          set((state) => ({
            formData: { ...state.formData, ...updates },
            error: null, // Clear error when user makes changes
          })),

        setPredictionType: (type) =>
          set(() => ({
            predictionType: type,
            error: null,
          })),

        setResult: (result) =>
          set(() => ({
            currentResult: result,
            isLoading: false,
            error: null,
          })),

        addToHistory: (record) =>
          set((state) => ({
            history: [record, ...state.history.slice(0, 19)], // Keep only last 20 records
          })),

        clearHistory: () =>
          set(() => ({
            history: [],
          })),

        resetForm: () =>
          set(() => ({
            formData: initialFormData,
            predictionType: 'Both',
            currentResult: null,
            error: null,
          })),

        setLoading: (loading) =>
          set(() => ({
            isLoading: loading,
          })),

        setError: (error) =>
          set(() => ({
            error,
            isLoading: false,
          })),

        validateForm: () => {
          const { formData, predictionType } = get();
          
          // Core required fields (always needed)
          const coreFields: (keyof PredictionFormData)[] = [
            'Age', 'Duration', 'Weight', 'FSH', 'LH', 'AMH', 'AFC'
          ];
          
          // Additional fields based on prediction type
          const porFields: (keyof PredictionFormData)[] = [
            'DBP', 'WBC', 'RBC', 'ALT', 'P'
          ];
          
          const horFields: (keyof PredictionFormData)[] = [
            'PLT'
          ];
          
          // Determine required fields based on prediction type
          let requiredFields = [...coreFields];
          
          if (predictionType === 'POR' || predictionType === 'Both') {
            requiredFields.push(...porFields);
          }
          
          if (predictionType === 'HOR' || predictionType === 'Both') {
            requiredFields.push(...horFields);
          }
          
          // Validate all required fields
          return requiredFields.every(field => {
            const value = formData[field];
            
            // Boolean fields (POIorDOR, PCOS) are always valid as they have default values
            if (typeof value === 'boolean') {
              return true;
            }
            
            // Numeric fields must be defined and not null
            return value !== undefined && value !== null && String(value) !== '';
          });
        },
      }),
      {
        name: 'prediction-store',
        // Only persist form data and history, not loading states
        partialize: (state) => ({
          formData: state.formData,
          predictionType: state.predictionType,
          history: state.history,
        }),
      }
    ),
    {
      name: 'prediction-store',
    }
  )
);