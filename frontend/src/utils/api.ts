import { PredictionResult } from '../types/api';
import { PREDICTION_THRESHOLDS } from '../config';

/**
 * 风险等级类型
 */
export type RiskLevel = 'low' | 'medium' | 'high';

/**
 * 风险评估结果
 */
export interface RiskAssessment {
  por: {
    level: RiskLevel;
    probability: number;
    description: string;
    color: string;
  };
  hor: {
    level: RiskLevel;
    probability: number;
    description: string;
    color: string;
  };
  recommendation: string;
}

/**
 * 根据概率值评估风险等级
 */
export function assessRiskLevel(probability: number): {
  level: RiskLevel;
  color: string;
  description: string;
} {
  if (probability >= PREDICTION_THRESHOLDS.HIGH_RISK) {
    return {
      level: 'high',
      color: '#ff4d4f',
      description: '高风险',
    };
  } else if (probability >= PREDICTION_THRESHOLDS.MEDIUM_RISK) {
    return {
      level: 'medium',
      color: '#faad14',
      description: '中等风险',
    };
  } else {
    return {
      level: 'low',
      color: '#52c41a',
      description: '低风险',
    };
  }
}

/**
 * 分析预测结果并生成风险评估
 */
export function analyzePredictionResult(result: PredictionResult): RiskAssessment {
  const porAssessment = assessRiskLevel(result.por_prediction.poor_response_prob);
  const horAssessment = assessRiskLevel(result.hor_prediction.high_response_prob);

  // 生成建议
  let recommendation = '';
  
  if (porAssessment.level === 'high') {
    recommendation += '建议调整促排卵方案，增加药物剂量或选择更敏感的药物。';
  } else if (porAssessment.level === 'low') {
    recommendation += '卵巢反应良好，可按标准方案进行。';
  } else {
    recommendation += '建议密切监测卵巢反应，必要时调整用药。';
  }

  if (horAssessment.level === 'high') {
    recommendation += ' 同时需警惕过度刺激综合征风险，建议降低药物剂量。';
  }

  return {
    por: {
      level: porAssessment.level,
      probability: result.por_prediction.poor_response_prob,
      description: porAssessment.description,
      color: porAssessment.color,
    },
    hor: {
      level: horAssessment.level,
      probability: result.hor_prediction.high_response_prob,
      description: horAssessment.description,
      color: horAssessment.color,
    },
    recommendation,
  };
}

/**
 * 格式化概率为百分比字符串
 */
export function formatProbability(probability: number, decimals: number = 1): string {
  return `${(probability * 100).toFixed(decimals)}%`;
}

/**
 * 格式化日期时间
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * 格式化API错误消息
 */
export function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }
  
  return '未知错误';
}

/**
 * 验证预测结果数据的完整性
 */
export function validatePredictionResult(result: any): result is PredictionResult {
  return (
    result &&
    typeof result === 'object' &&
    result.status === 'success' &&
    result.por_prediction &&
    typeof result.por_prediction.poor_response_prob === 'number' &&
    typeof result.por_prediction.normal_response_prob === 'number' &&
    result.hor_prediction &&
    typeof result.hor_prediction.high_response_prob === 'number' &&
    typeof result.hor_prediction.normal_response_prob === 'number'
  );
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 检查是否为有效的数值
 */
export function isValidNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * 安全解析JSON
 */
export function safeParseJSON<T = any>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch {
    return false;
  }
} 