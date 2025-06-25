import { rest } from 'msw';
import type { PredictionRequest, PredictionResponse } from '../types/prediction';

export const handlers = [
  // 预测API
  rest.post<PredictionRequest>('/predict', (req, res, ctx) => {
    const { Age, FSH, LH, AMH, AFC } = req.body;

    // 模拟预测逻辑
    const calculatePORProbability = (age: number, fsh: number, amh: number) => {
      // 简化的预测逻辑（实际应用中会使用机器学习模型）
      let score = 0;
      
      if (age > 35) score += 0.2;
      if (fsh > 10) score += 0.3;
      if (amh < 1.5) score += 0.4;
      
      return Math.min(score, 0.9);
    };

    const calculateHORProbability = (age: number, afc: number, amh: number) => {
      let score = 0;
      
      if (age < 30) score += 0.1;
      if (afc > 15) score += 0.3;
      if (amh > 3.0) score += 0.3;
      
      return Math.min(score, 0.9);
    };

    const porProbability = calculatePORProbability(Age, FSH, AMH);
    const horProbability = calculateHORProbability(Age, AFC, AMH);

    const response: PredictionResponse = {
      prediction: {
        POR_probability: porProbability,
        HOR_probability: horProbability,
      },
      status: 'success',
      timestamp: new Date().toISOString(),
    };

    return res(ctx.status(200), ctx.json(response));
  }),

  // 健康检查API
  rest.get('/health', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: '24h',
      })
    );
  }),

  // 错误场景模拟
  rest.post('/predict-error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        error: 'Internal Server Error',
        message: '预测服务暂时不可用',
      })
    );
  }),

  // 超时场景模拟
  rest.post('/predict-timeout', (req, res, ctx) => {
    return res(ctx.delay(35000)); // 超过30秒超时
  }),

  // 验证错误场景模拟
  rest.post('/predict-validation-error', (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        error: 'Validation Error',
        message: '输入数据验证失败',
        details: {
          Age: '年龄必须在18-45岁之间',
          FSH: 'FSH值必须大于0',
        },
      })
    );
  }),

  // 网络错误场景模拟
  rest.post('/predict-network-error', (req, res, ctx) => {
    return res.networkError('Network connection failed');
  }),
];

// 用于特定测试场景的handlers
export const errorHandlers = [
  rest.post('/predict', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        error: 'Service Unavailable',
        message: 'AI prediction service is temporarily unavailable',
      })
    );
  }),

  rest.get('/health', (req, res, ctx) => {
    return res(
      ctx.status(503),
      ctx.json({
        status: 'unhealthy',
        error: 'Database connection failed',
      })
    );
  }),
];

export const timeoutHandlers = [
  rest.post('/predict', (req, res, ctx) => {
    return res(ctx.delay('infinite'));
  }),
];

export const validationErrorHandlers = [
  rest.post('/predict', (req, res, ctx) => {
    return res(
      ctx.status(422),
      ctx.json({
        error: 'Validation Failed',
        message: '输入数据验证失败',
        errors: [
          { field: 'Age', message: '年龄必须在18-45岁之间' },
          { field: 'FSH', message: 'FSH值必须大于0且小于50' },
          { field: 'AMH', message: 'AMH值不能为空' },
        ],
      })
    );
  }),
]; 