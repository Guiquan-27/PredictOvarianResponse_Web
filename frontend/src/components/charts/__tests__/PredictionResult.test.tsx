import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PredictionResult } from '../PredictionResult';
import type { PredictionResponse } from '../../../types/prediction';

// 模拟antd的message
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    },
  };
});

// 模拟Recharts组件
vi.mock('recharts', () => ({
  BarChart: vi.fn(({ children }) => <div data-testid="bar-chart">{children}</div>),
  Bar: vi.fn(() => <div data-testid="bar" />),
  XAxis: vi.fn(() => <div data-testid="x-axis" />),
  YAxis: vi.fn(() => <div data-testid="y-axis" />),
  CartesianGrid: vi.fn(() => <div data-testid="cartesian-grid" />),
  Tooltip: vi.fn(() => <div data-testid="tooltip" />),
  Legend: vi.fn(() => <div data-testid="legend" />),
  PieChart: vi.fn(({ children }) => <div data-testid="pie-chart">{children}</div>),
  Pie: vi.fn(() => <div data-testid="pie" />),
  Cell: vi.fn(() => <div data-testid="cell" />),
  ResponsiveContainer: vi.fn(({ children }) => (
    <div data-testid="responsive-container">{children}</div>
  )),
}));

describe('PredictionResult', () => {
  const user = userEvent.setup();

  const mockPrediction: PredictionResponse = {
    prediction: {
      POR_probability: 0.15,
      HOR_probability: 0.25,
    },
    status: 'success',
    timestamp: '2024-01-15T10:30:00Z',
  };

  const mockOnExport = vi.fn();
  const mockOnPrint = vi.fn();

  const defaultProps = {
    prediction: mockPrediction,
    onExport: mockOnExport,
    onPrint: mockOnPrint,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // 模拟window.print
    global.window.print = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('rendering', () => {
    it('should render prediction results', () => {
      render(<PredictionResult {...defaultProps} />);

      expect(screen.getByText(/预测结果/)).toBeInTheDocument();
      expect(screen.getByText(/低反应风险/)).toBeInTheDocument();
      expect(screen.getByText(/高反应风险/)).toBeInTheDocument();
      expect(screen.getByText(/15%/)).toBeInTheDocument();
      expect(screen.getByText(/25%/)).toBeInTheDocument();
    });

    it('should render risk assessment cards', () => {
      render(<PredictionResult {...defaultProps} />);

      expect(screen.getByTestId('por-risk-card')).toBeInTheDocument();
      expect(screen.getByTestId('hor-risk-card')).toBeInTheDocument();
    });

    it('should render charts', () => {
      render(<PredictionResult {...defaultProps} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('should show timestamp', () => {
      render(<PredictionResult {...defaultProps} />);

      expect(screen.getByText(/预测时间/)).toBeInTheDocument();
      expect(screen.getByText(/2024-01-15 10:30:00/)).toBeInTheDocument();
    });
  });

  describe('risk assessment', () => {
    it('should show low risk for POR < 30%', () => {
      const lowRiskPrediction = {
        ...mockPrediction,
        prediction: {
          POR_probability: 0.2,
          HOR_probability: 0.1,
        },
      };

      render(<PredictionResult {...defaultProps} prediction={lowRiskPrediction} />);

      expect(screen.getByText(/低风险/)).toBeInTheDocument();
      expect(screen.getByTestId('risk-level-low')).toBeInTheDocument();
    });

    it('should show medium risk for POR 30-70%', () => {
      const mediumRiskPrediction = {
        ...mockPrediction,
        prediction: {
          POR_probability: 0.5,
          HOR_probability: 0.4,
        },
      };

      render(<PredictionResult {...defaultProps} prediction={mediumRiskPrediction} />);

      expect(screen.getByText(/中等风险/)).toBeInTheDocument();
      expect(screen.getByTestId('risk-level-medium')).toBeInTheDocument();
    });

    it('should show high risk for POR > 70%', () => {
      const highRiskPrediction = {
        ...mockPrediction,
        prediction: {
          POR_probability: 0.8,
          HOR_probability: 0.9,
        },
      };

      render(<PredictionResult {...defaultProps} prediction={highRiskPrediction} />);

      expect(screen.getByText(/高风险/)).toBeInTheDocument();
      expect(screen.getByTestId('risk-level-high')).toBeInTheDocument();
    });
  });

  describe('clinical recommendations', () => {
    it('should show recommendations for low risk', () => {
      const lowRiskPrediction = {
        ...mockPrediction,
        prediction: {
          POR_probability: 0.2,
          HOR_probability: 0.1,
        },
      };

      render(<PredictionResult {...defaultProps} prediction={lowRiskPrediction} />);

      expect(screen.getByText(/建议使用标准促排卵方案/)).toBeInTheDocument();
    });

    it('should show recommendations for high POR risk', () => {
      const highPORRisk = {
        ...mockPrediction,
        prediction: {
          POR_probability: 0.8,
          HOR_probability: 0.1,
        },
      };

      render(<PredictionResult {...defaultProps} prediction={highPORRisk} />);

      expect(screen.getByText(/考虑增加促排药物剂量/)).toBeInTheDocument();
    });

    it('should show recommendations for high HOR risk', () => {
      const highHORRisk = {
        ...mockPrediction,
        prediction: {
          POR_probability: 0.1,
          HOR_probability: 0.8,
        },
      };

      render(<PredictionResult {...defaultProps} prediction={highHORRisk} />);

      expect(screen.getByText(/注意预防卵巢过度刺激综合征/)).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('should call onExport when export button is clicked', async () => {
      render(<PredictionResult {...defaultProps} />);

      const exportButton = screen.getByRole('button', { name: /导出结果/ });
      await user.click(exportButton);

      expect(mockOnExport).toHaveBeenCalledWith({
        prediction: mockPrediction,
        timestamp: expect.any(String),
      });
    });

    it('should call onPrint when print button is clicked', async () => {
      render(<PredictionResult {...defaultProps} />);

      const printButton = screen.getByRole('button', { name: /打印报告/ });
      await user.click(printButton);

      expect(mockOnPrint).toHaveBeenCalled();
    });

    it('should call window.print when print button is clicked', async () => {
      render(<PredictionResult {...defaultProps} />);

      const printButton = screen.getByRole('button', { name: /打印报告/ });
      await user.click(printButton);

      expect(global.window.print).toHaveBeenCalled();
    });
  });

  describe('chart interactions', () => {
    it('should render chart tooltip on hover', () => {
      render(<PredictionResult {...defaultProps} />);

      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('should render chart legend', () => {
      render(<PredictionResult {...defaultProps} />);

      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should handle missing prediction data gracefully', () => {
      const emptyPrediction = {
        ...mockPrediction,
        prediction: null as any,
      };

      render(<PredictionResult {...defaultProps} prediction={emptyPrediction} />);

      expect(screen.getByText(/数据错误/)).toBeInTheDocument();
    });

    it('should handle invalid probability values', () => {
      const invalidPrediction = {
        ...mockPrediction,
        prediction: {
          POR_probability: -0.1,
          HOR_probability: 1.5,
        },
      };

      render(<PredictionResult {...defaultProps} prediction={invalidPrediction} />);

      expect(screen.getByText(/数据异常/)).toBeInTheDocument();
    });
  });

  describe('responsive design', () => {
    it('should render charts in responsive containers', () => {
      render(<PredictionResult {...defaultProps} />);

      const responsiveContainers = screen.getAllByTestId('responsive-container');
      expect(responsiveContainers.length).toBeGreaterThan(0);
    });

    it('should adapt layout for mobile devices', () => {
      // 模拟移动设备视口
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<PredictionResult {...defaultProps} />);

      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<PredictionResult {...defaultProps} />);

      expect(screen.getByRole('region', { name: /预测结果/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /导出结果/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /打印报告/ })).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(<PredictionResult {...defaultProps} />);

      const exportButton = screen.getByRole('button', { name: /导出结果/ });
      const printButton = screen.getByRole('button', { name: /打印报告/ });

      exportButton.focus();
      expect(document.activeElement).toBe(exportButton);

      await user.tab();
      expect(document.activeElement).toBe(printButton);
    });

    it('should provide screen reader friendly content', () => {
      render(<PredictionResult {...defaultProps} />);

      expect(screen.getByText(/低反应概率为15%/)).toBeInTheDocument();
      expect(screen.getByText(/高反应概率为25%/)).toBeInTheDocument();
    });
  });

  describe('data formatting', () => {
    it('should format percentages correctly', () => {
      render(<PredictionResult {...defaultProps} />);

      expect(screen.getByText('15%')).toBeInTheDocument();
      expect(screen.getByText('25%')).toBeInTheDocument();
    });

    it('should format timestamp correctly', () => {
      render(<PredictionResult {...defaultProps} />);

      expect(screen.getByText(/2024-01-15 10:30:00/)).toBeInTheDocument();
    });

    it('should handle edge case percentages', () => {
      const edgeCasePrediction = {
        ...mockPrediction,
        prediction: {
          POR_probability: 0.001,
          HOR_probability: 0.999,
        },
      };

      render(<PredictionResult {...defaultProps} prediction={edgeCasePrediction} />);

      expect(screen.getByText('0.1%')).toBeInTheDocument();
      expect(screen.getByText('99.9%')).toBeInTheDocument();
    });
  });
}); 