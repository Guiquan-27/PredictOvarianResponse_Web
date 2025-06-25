import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PredictionPage } from '../../pages/PredictionPage';
import { server } from '../../mocks/server';
import { errorHandlers, validationErrorHandlers } from '../../mocks/handlers';
import type { PredictionRequest } from '../../types/prediction';

// 导入MSW服务器设置
import '../../mocks/server';

// 模拟localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

// 模拟window.print
global.window.print = vi.fn();

// 模拟URL.createObjectURL
global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('预测流程集成测试', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const fillValidForm = async () => {
    await user.type(screen.getByLabelText(/年龄/), '30');
    await user.type(screen.getByLabelText(/治疗时长/), '12');
    await user.type(screen.getByLabelText(/体重/), '60');
    await user.type(screen.getByLabelText(/FSH/), '8.5');
    await user.type(screen.getByLabelText(/LH/), '4.2');
    await user.type(screen.getByLabelText(/AMH/), '2.1');
    await user.type(screen.getByLabelText(/AFC/), '12');
    await user.type(screen.getByLabelText(/舒张压/), '80');
    await user.type(screen.getByLabelText(/白细胞计数/), '6.5');
    await user.type(screen.getByLabelText(/红细胞计数/), '4.2');
    await user.type(screen.getByLabelText(/丙氨酸转氨酶/), '25');
    await user.type(screen.getByLabelText(/血磷/), '1.2');
    await user.type(screen.getByLabelText(/血小板计数/), '250');
  };

  describe('成功预测流程', () => {
    it('应该完成完整的预测流程', async () => {
      render(<PredictionPage />);

      // 1. 验证表单渲染
      expect(screen.getByText(/卵巢反应预测/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /开始预测/ })).toBeInTheDocument();

      // 2. 填写表单
      await fillValidForm();

      // 3. 提交表单
      await user.click(screen.getByRole('button', { name: /开始预测/ }));

      // 4. 验证加载状态
      expect(screen.getByText(/预测中/)).toBeInTheDocument();

      // 5. 等待结果显示
      await waitFor(() => {
        expect(screen.getByText(/预测结果/)).toBeInTheDocument();
      });

      // 6. 验证结果内容
      expect(screen.getByText(/低反应风险/)).toBeInTheDocument();
      expect(screen.getByText(/高反应风险/)).toBeInTheDocument();
      
      // 验证百分比显示
      expect(screen.getByText(/%/)).toBeInTheDocument();

      // 7. 验证图表显示
      expect(screen.getByTestId('prediction-chart')).toBeInTheDocument();

      // 8. 验证操作按钮
      expect(screen.getByRole('button', { name: /导出结果/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /打印报告/ })).toBeInTheDocument();
    });

    it('应该正确保存到历史记录', async () => {
      render(<PredictionPage />);

      await fillValidForm();
      await user.click(screen.getByRole('button', { name: /开始预测/ }));

      await waitFor(() => {
        expect(screen.getByText(/预测结果/)).toBeInTheDocument();
      });

      // 切换到历史记录标签
      await user.click(screen.getByRole('tab', { name: /历史记录/ }));

      // 验证历史记录保存
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'prediction_history',
        expect.stringContaining('Age')
      );

      await waitFor(() => {
        expect(screen.getByTestId('history-item')).toBeInTheDocument();
      });
    });

    it('应该支持导出功能', async () => {
      render(<PredictionPage />);

      await fillValidForm();
      await user.click(screen.getByRole('button', { name: /开始预测/ }));

      await waitFor(() => {
        expect(screen.getByText(/预测结果/)).toBeInTheDocument();
      });

      // 点击导出按钮
      await user.click(screen.getByRole('button', { name: /导出结果/ }));

      // 验证下载功能触发
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('应该支持打印功能', async () => {
      render(<PredictionPage />);

      await fillValidForm();
      await user.click(screen.getByRole('button', { name: /开始预测/ }));

      await waitFor(() => {
        expect(screen.getByText(/预测结果/)).toBeInTheDocument();
      });

      // 点击打印按钮
      await user.click(screen.getByRole('button', { name: /打印报告/ }));

      // 验证打印功能触发
      expect(global.window.print).toHaveBeenCalled();
    });
  });

  describe('错误处理流程', () => {
    it('应该处理API错误', async () => {
      // 使用错误处理器
      server.use(...errorHandlers);

      render(<PredictionPage />);

      await fillValidForm();
      await user.click(screen.getByRole('button', { name: /开始预测/ }));

      // 验证错误信息显示
      await waitFor(() => {
        expect(screen.getByText(/预测请求失败/)).toBeInTheDocument();
      });

      // 验证不显示结果
      expect(screen.queryByText(/预测结果/)).not.toBeInTheDocument();
    });

    it('应该处理表单验证错误', async () => {
      render(<PredictionPage />);

      // 只填写部分字段
      await user.type(screen.getByLabelText(/年龄/), '30');

      await user.click(screen.getByRole('button', { name: /开始预测/ }));

      // 验证验证错误显示
      await waitFor(() => {
        expect(screen.getByText(/请输入治疗时长/)).toBeInTheDocument();
      });
    });

    it('应该处理网络错误', async () => {
      // 模拟网络错误
      server.use(
        rest.post('/predict', (req, res) => {
          return res.networkError('Failed to connect');
        })
      );

      render(<PredictionPage />);

      await fillValidForm();
      await user.click(screen.getByRole('button', { name: /开始预测/ }));

      await waitFor(() => {
        expect(screen.getByText(/网络连接失败/)).toBeInTheDocument();
      });
    });
  });

  describe('表单交互', () => {
    it('应该支持表单重置', async () => {
      render(<PredictionPage />);

      // 填写一些数据
      await user.type(screen.getByLabelText(/年龄/), '30');
      await user.type(screen.getByLabelText(/体重/), '60');

      // 点击重置按钮
      await user.click(screen.getByRole('button', { name: /重置表单/ }));

      // 验证表单被清空
      expect(screen.getByLabelText(/年龄/)).toHaveValue(null);
      expect(screen.getByLabelText(/体重/)).toHaveValue(null);
    });

    it('应该显示表单验证提示', async () => {
      render(<PredictionPage />);

      // 输入无效数据
      await user.type(screen.getByLabelText(/年龄/), '10'); // 小于最小值
      await user.type(screen.getByLabelText(/FSH/), '-5'); // 负数

      await user.click(screen.getByRole('button', { name: /开始预测/ }));

      // 验证错误信息
      await waitFor(() => {
        expect(screen.getByText(/年龄必须在18-45岁之间/)).toBeInTheDocument();
        expect(screen.getByText(/FSH值必须大于0/)).toBeInTheDocument();
      });
    });
  });

  describe('历史记录管理', () => {
    it('应该显示历史记录列表', async () => {
      // 模拟已有历史记录
      localStorageMock.getItem.mockReturnValue(JSON.stringify([
        {
          id: '1',
          timestamp: '2024-01-15T10:30:00Z',
          formData: {} as PredictionRequest,
          prediction: {
            prediction: { POR_probability: 0.15, HOR_probability: 0.25 },
            status: 'success',
            timestamp: '2024-01-15T10:30:00Z'
          }
        }
      ]));

      render(<PredictionPage />);

      // 切换到历史记录标签
      await user.click(screen.getByRole('tab', { name: /历史记录/ }));

      // 验证历史记录显示
      await waitFor(() => {
        expect(screen.getByTestId('history-item')).toBeInTheDocument();
      });
    });

    it('应该支持删除历史记录', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([
        {
          id: '1',
          timestamp: '2024-01-15T10:30:00Z',
          formData: {} as PredictionRequest,
          prediction: {
            prediction: { POR_probability: 0.15, HOR_probability: 0.25 },
            status: 'success',
            timestamp: '2024-01-15T10:30:00Z'
          }
        }
      ]));

      render(<PredictionPage />);

      await user.click(screen.getByRole('tab', { name: /历史记录/ }));

      // 点击删除按钮
      await user.click(screen.getByRole('button', { name: /删除/ }));
      await user.click(screen.getByRole('button', { name: /确认删除/ }));

      // 验证删除操作
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'prediction_history',
        '[]'
      );
    });

    it('应该显示空状态', async () => {
      localStorageMock.getItem.mockReturnValue('[]');

      render(<PredictionPage />);

      await user.click(screen.getByRole('tab', { name: /历史记录/ }));

      await waitFor(() => {
        expect(screen.getByText(/暂无预测记录/)).toBeInTheDocument();
      });
    });
  });

  describe('响应式布局', () => {
    it('应该在移动端正确显示', () => {
      // 设置移动端视口
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<PredictionPage />);

      // 验证移动端布局元素
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument();
    });

    it('应该在桌面端正确显示', () => {
      // 设置桌面端视口
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      render(<PredictionPage />);

      // 验证桌面端布局元素
      expect(screen.getByTestId('desktop-layout')).toBeInTheDocument();
    });
  });
}); 