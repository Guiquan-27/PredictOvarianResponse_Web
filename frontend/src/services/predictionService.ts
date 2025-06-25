import { apiClient, retryRequest } from './api';
import { PatientData, PredictionResult, HealthStatus } from '../types/api';
import { PredictionFormData } from '../types/prediction';

/**
 * 预测服务类
 * 负责与后端预测API的交互
 */
export class PredictionService {
  
  /**
   * 获取API健康状态
   */
  static async getHealthStatus(): Promise<HealthStatus> {
    try {
      const response = await retryRequest(
        () => apiClient.get<HealthStatus>('/health'),
        2, // 最多重试2次
        500 // 500ms延迟
      );
      return response.data;
    } catch (error) {
      throw new Error(`健康检查失败: ${(error as Error).message}`);
    }
  }

  /**
   * 将前端表单数据转换为API请求格式
   */
  private static transformFormDataToApiFormat(formData: PredictionFormData): PatientData {
    return {
      Age: formData.Age,
      Duration: formData.Duration,
      Weight: formData.Weight,
      FSH: formData.FSH,
      LH: formData.LH,
      AMH: formData.AMH,
      AFC: formData.AFC,
      DBP: formData.DBP,
      WBC: formData.WBC,
      RBC: formData.RBC,
      ALT: formData.ALT,
      P: formData.P,
      PLT: formData.PLT,
      // 布尔值转换为数字：true -> 1 (Yes), false -> 2 (No)
      POIorDOR: formData.POIorDOR ? 1 : 2,
      PCOS: formData.PCOS ? 1 : 2,
    };
  }

  /**
   * 验证表单数据
   */
  private static validateFormData(formData: PredictionFormData): void {
    const requiredFields: (keyof PredictionFormData)[] = [
      'Age', 'Duration', 'Weight', 'FSH', 'LH', 'AMH', 'AFC',
      'DBP', 'WBC', 'RBC', 'ALT', 'P', 'PLT', 'POIorDOR', 'PCOS'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = formData[field];
      if (typeof value === 'boolean') return false; // boolean values are always valid
      return value === undefined || value === null || String(value) === '';
    });

    if (missingFields.length > 0) {
      throw new Error(`缺少必填字段: ${missingFields.join(', ')}`);
    }

    // 数值范围验证
    const numericFields = [
      { field: 'Age', min: 18, max: 50 },
      { field: 'Duration', min: 0, max: 60 },
      { field: 'Weight', min: 30, max: 150 },
      { field: 'FSH', min: 0, max: 50 },
      { field: 'LH', min: 0, max: 50 },
      { field: 'AMH', min: 0, max: 20 },
      { field: 'AFC', min: 0, max: 50 },
      { field: 'DBP', min: 40, max: 120 },
      { field: 'WBC', min: 2, max: 20 },
      { field: 'RBC', min: 3, max: 7 },
      { field: 'ALT', min: 5, max: 200 },
      { field: 'P', min: 0.5, max: 5 },
      { field: 'PLT', min: 100, max: 800 },
    ] as const;

    for (const { field, min, max } of numericFields) {
      const value = formData[field] as number;
      if (typeof value === 'number' && (value < min || value > max)) {
        throw new Error(`${field} 的值应在 ${min} 到 ${max} 之间`);
      }
    }
  }

  /**
   * 发送预测请求
   */
  static async predict(formData: PredictionFormData): Promise<PredictionResult> {
    try {
      // 验证输入数据
      this.validateFormData(formData);

      // 转换数据格式
      const apiData = this.transformFormDataToApiFormat(formData);

      console.log('发送预测请求:', apiData);

      // 发送请求
      const response = await retryRequest(
        () => apiClient.post<PredictionResult>('/predict', apiData),
        3, // 最多重试3次
        1000 // 1秒延迟
      );

      const result = response.data;

      // 验证响应数据
      if (!result || result.status !== 'success') {
        throw new Error(result?.message || '预测请求失败');
      }

      if (!result.por_prediction || !result.hor_prediction) {
        throw new Error('响应数据格式错误：缺少预测结果');
      }

      console.log('预测结果:', result);
      return result;

    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('预测请求失败:', errorMessage);
      
      // 重新抛出更友好的错误信息
      if (errorMessage.includes('400')) {
        throw new Error('请求参数有误，请检查输入数据');
      } else if (errorMessage.includes('503')) {
        throw new Error('预测服务暂时不可用，请稍后再试');
      } else if (errorMessage.includes('500')) {
        throw new Error('服务器处理错误，请联系管理员');
      } else if (errorMessage.includes('timeout') || errorMessage.includes('超时')) {
        throw new Error('请求超时，请检查网络连接后重试');
      } else {
        throw new Error(errorMessage || '预测请求失败，请重试');
      }
    }
  }

  /**
   * 取消请求（如果需要的话）
   */
  static createCancelToken() {
    return apiClient.getUri(); // 可以使用 AbortController 来实现取消功能
  }
}

// 导出便捷函数
export const { predict, getHealthStatus } = PredictionService; 