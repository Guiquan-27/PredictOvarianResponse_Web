// 患者数据类型
export interface PatientData {
  Age: number;
  Duration: number;
  Weight: number;
  FSH: number;
  LH: number;
  AMH: number;
  AFC: number;
  DBP: number;
  WBC: number;
  RBC: number;
  ALT: number;
  P: number;
  PLT: number;
  POIorDOR: 1 | 2; // 1=Yes, 2=No
  PCOS: 1 | 2; // 1=Yes, 2=No
}

// 预测结果类型
export interface PredictionResult {
  status: 'success' | 'error';
  por_prediction: {
    poor_response_prob: number;
    normal_response_prob: number;
  };
  hor_prediction: {
    high_response_prob: number;
    normal_response_prob: number;
  };
  message?: string;
}

// 健康检查结果类型
export interface HealthStatus {
  status: string;
  timestamp: string;
  model_status: string;
}

// API 错误类型
export interface ApiError {
  error: string;
  status?: 'error';
  message?: string;
  details?: string;
}

// 风险级别类型
export type RiskLevel = 'low' | 'medium' | 'high';

// 预测历史记录类型
export interface PredictionHistory {
  id: string;
  timestamp: string;
  patientData: PatientData;
  result: PredictionResult;
  notes?: string;
}

// 表单验证错误类型
export interface FormErrors {
  [key: string]: string | undefined;
}

// API 响应基础类型
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
} 