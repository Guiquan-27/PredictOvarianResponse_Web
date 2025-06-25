/**
 * Prediction-related type definitions
 */

// Prediction type selection
export type PredictionType = 'POR' | 'HOR' | 'Both';

// Prediction form data type
export interface PredictionFormData {
  // Basic information
  Age?: number;           // Age in years
  Duration?: number;      // Duration of infertility in months
  Weight?: number;        // Weight in kg
  
  // Hormonal parameters
  FSH?: number;          // Basal FSH (IU/L)
  LH?: number;           // Basal LH (IU/L)
  AMH?: number;          // AMH (ng/mL)
  AFC?: number;          // Basal AFC (count)
  P?: number;            // Basal Progesterone (ng/mL)
  
  // Clinical conditions
  POIorDOR?: boolean;    // POI or DOR (Yes/No)
  PCOS?: boolean;        // PCOS diagnosis (Yes/No)
  
  // Laboratory parameters
  DBP?: number;          // Diastolic Blood Pressure (mmHg)
  WBC?: number;          // White Blood Cell count (×10⁹/L)
  RBC?: number;          // Red Blood Cell count (×10¹²/L)
  ALT?: number;          // Alanine Aminotransferase (IU/L)
  PLT?: number;          // Platelet count (×10⁹/L)
}

// Prediction result type
export interface PredictionResult {
  status: 'success' | 'error';
  message?: string;
  
  // POR prediction result
  por_prediction?: {
    poor_response_prob: number;
    normal_response_prob: number;
  };
  
  // HOR prediction result
  hor_prediction?: {
    high_response_prob: number;
    normal_response_prob: number;
  };
  
  timestamp?: string;
}

// Treatment strategy type
export interface TreatmentStrategy {
  id: string;
  protocol: string;
  fshDose: string;
  rfsh: string;
  lh: string;
  porAvoidance: number;
  horAvoidance: number;
  overallScore: number;
  recommendation: string;
}

// Strategy analysis configuration
export interface StrategyConfig {
  analysisMode: 'full' | 'specific';
  protocol?: string;
  fshDose?: string;
  rfsh?: string;
  lh?: string;
}

// Prediction history record type
export interface PredictionHistory {
  id: string;
  timestamp: string;
  formData: PredictionFormData;
  result: PredictionResult;
  predictionType: PredictionType;
  strategies?: TreatmentStrategy[];
}

// Form validation status
export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// Export data format
export interface ExportData {
  patientData: PredictionFormData;
  predictions: PredictionResult;
  strategies?: TreatmentStrategy[];
  timestamp: string;
  predictionType: PredictionType;
  systemInfo: {
    version: string;
    model: string;
  };
}

// Risk level assessment
export interface RiskLevel {
  level: 'low' | 'medium' | 'high';
  color: string;
  text: string;
}

// Clinical recommendation
export interface ClinicalRecommendation {
  category: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

// Form field metadata (for validation and UI)
export interface FormFieldMeta {
  key: keyof PredictionFormData;
  label: string;
  unit?: string;
  type: 'number' | 'boolean';
  min?: number;
  max?: number;
  step?: number;
  required: boolean;
  helpText?: string;
  placeholder?: string;
}

// Form group for organizing fields
export interface FormGroup {
  title: string;
  description: string;
  icon?: string;
  fields: FormFieldMeta[];
}

// API request type (matches backend expectations)
export interface PredictionRequest {
  Age: number;
  Duration: number;
  Weight: number;
  FSH: number;
  LH: number;
  AMH: number;
  AFC: number;
  DBP?: number;
  WBC?: number;
  RBC?: number;
  ALT?: number;
  P?: number;
  PLT?: number;
  POIorDOR: number; // 1 for Yes, 2 for No
  PCOS?: number;    // 1 for Yes, 2 for No
}

// Form errors type
export type FormErrors = {
  [K in keyof PredictionFormData]?: string;
};

// Form state type
export interface FormState {
  data: Partial<PredictionFormData>;
  errors: FormErrors;
  isSubmitting: boolean;
  isValid: boolean;
}