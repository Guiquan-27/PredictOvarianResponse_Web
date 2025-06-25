import { useCallback, useEffect } from 'react';
import { usePredictionStore } from '../stores/predictionStore';
import { PredictionFormData } from '../types/prediction';
import { message } from 'antd';

/**
 * 预测功能的自定义Hook
 * 封装了表单管理、API调用、状态处理等逻辑
 */
export const usePrediction = () => {
  const {
    // 状态
    formData,
    formErrors,
    isFormValid,
    isPredicting,
    isLoading,
    predictionResult,
    error,
    healthStatus,
    predictionHistory,

    // Actions
    setFormData,
    updateFormField,
    setFormErrors,
    clearFormErrors,
    resetForm,
    submitPrediction,
    checkHealth,
    clearError,
    clearResults,
    addToHistory,
    clearHistory,
    removeFromHistory,
  } = usePredictionStore();

  // 处理表单提交
  const handleSubmit = useCallback(async () => {
    try {
      clearError();
      await submitPrediction();
      
      // 成功提示
      if (usePredictionStore.getState().predictionResult && !usePredictionStore.getState().error) {
        message.success('预测完成！');
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(errorMessage);
    }
  }, [submitPrediction, clearError]);

  // 处理健康检查
  const handleHealthCheck = useCallback(async () => {
    try {
      await checkHealth();
      const currentHealthStatus = usePredictionStore.getState().healthStatus;
      if (currentHealthStatus?.status === 'API is running') {
        message.success('API服务正常运行');
      }
    } catch (error) {
      message.error('健康检查失败');
    }
  }, [checkHealth]);

  // 批量更新表单数据
  const updateFormData = useCallback((data: Partial<PredictionFormData>) => {
    setFormData(data);
  }, [setFormData]);

  // 验证单个字段
  const validateField = useCallback((
    field: keyof PredictionFormData,
    value: any
  ): string | undefined => {
    if (value === undefined || value === null || value === '') {
      return '此字段为必填项';
    }

    // 数值范围验证
    const numericValidations: Record<string, { min: number; max: number; name: string }> = {
      Age: { min: 18, max: 50, name: '年龄' },
      Duration: { min: 0, max: 60, name: '治疗时长' },
      Weight: { min: 30, max: 150, name: '体重' },
      FSH: { min: 0, max: 50, name: 'FSH' },
      LH: { min: 0, max: 50, name: 'LH' },
      AMH: { min: 0, max: 20, name: 'AMH' },
      AFC: { min: 0, max: 50, name: 'AFC' },
      DBP: { min: 40, max: 120, name: '舒张压' },
      WBC: { min: 2, max: 20, name: '白细胞计数' },
      RBC: { min: 3, max: 7, name: '红细胞计数' },
      ALT: { min: 5, max: 200, name: 'ALT' },
      P: { min: 0.5, max: 5, name: '磷' },
      PLT: { min: 100, max: 800, name: '血小板计数' },
    };

    const validation = numericValidations[field];
    if (validation && typeof value === 'number') {
      if (value < validation.min || value > validation.max) {
        return `${validation.name}应在${validation.min}到${validation.max}之间`;
      }
    }

    return undefined;
  }, []);

  // 验证整个表单
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    
    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field as keyof PredictionFormData, value);
      if (error) {
        errors[field] = error;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, validateField, setFormErrors]);

  // 重置所有状态
  const resetAll = useCallback(() => {
    resetForm();
    clearError();
    clearResults();
  }, [resetForm, clearError, clearResults]);

  // 导入历史记录数据
  const loadHistoryData = useCallback((historyItem: typeof predictionHistory[0]) => {
    setFormData(historyItem.formData);
    message.success('已加载历史数据');
  }, [setFormData]);

  // 导出当前表单数据
  const exportFormData = useCallback(() => {
    if (!isFormValid) {
      message.warning('请先完善表单数据');
      return null;
    }
    
    const dataToExport = {
      timestamp: new Date().toISOString(),
      formData,
      predictionResult,
    };

    // 创建下载链接
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ovarian-prediction-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success('数据已导出');
    return dataToExport;
  }, [isFormValid, formData, predictionResult]);

  // 自动健康检查（组件挂载时）
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await checkHealth();
      } catch (error) {
        console.warn('自动健康检查失败:', error);
      }
    };

    checkApiHealth();
  }, [checkHealth]);

  // 错误提示（当有错误时自动显示）
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  return {
    // 状态
    formData,
    formErrors,
    isFormValid,
    isPredicting,
    isLoading,
    predictionResult,
    error,
    healthStatus,
    predictionHistory,

    // 表单操作
    updateFormField,
    updateFormData,
    resetForm: resetAll,
    validateField,
    validateForm,
    clearFormErrors,

    // API操作
    submitPrediction: handleSubmit,
    checkHealth: handleHealthCheck,

    // 状态管理
    clearError,
    clearResults,

    // 历史记录
    loadHistoryData,
    clearHistory,
    removeFromHistory,

    // 工具函数
    exportFormData,

    // 计算属性
    canSubmit: isFormValid && !isPredicting,
    hasResult: !!predictionResult,
    isApiHealthy: healthStatus?.status === 'API is running',
  };
};

export default usePrediction; 