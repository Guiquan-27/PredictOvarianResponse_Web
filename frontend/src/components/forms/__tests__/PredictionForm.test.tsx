import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PredictionForm } from '../PredictionForm';
import type { PredictionRequest } from '../../../types/prediction';

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

describe('PredictionForm', () => {
  const mockOnSubmit = vi.fn();
  const user = userEvent.setup();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    loading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('rendering', () => {
    it('should render all form fields', () => {
      render(<PredictionForm {...defaultProps} />);

      // 基础信息字段
      expect(screen.getByLabelText(/年龄/)).toBeInTheDocument();
      expect(screen.getByLabelText(/治疗时长/)).toBeInTheDocument();
      expect(screen.getByLabelText(/体重/)).toBeInTheDocument();

      // 激素水平字段
      expect(screen.getByLabelText(/FSH/)).toBeInTheDocument();
      expect(screen.getByLabelText(/LH/)).toBeInTheDocument();
      expect(screen.getByLabelText(/AMH/)).toBeInTheDocument();
      expect(screen.getByLabelText(/AFC/)).toBeInTheDocument();

      // 血液检查字段
      expect(screen.getByLabelText(/舒张压/)).toBeInTheDocument();
      expect(screen.getByLabelText(/白细胞计数/)).toBeInTheDocument();
      expect(screen.getByLabelText(/红细胞计数/)).toBeInTheDocument();
      expect(screen.getByLabelText(/丙氨酸转氨酶/)).toBeInTheDocument();
      expect(screen.getByLabelText(/血磷/)).toBeInTheDocument();
      expect(screen.getByLabelText(/血小板计数/)).toBeInTheDocument();

      // 病史字段
      expect(screen.getByLabelText(/POI\/DOR/)).toBeInTheDocument();
      expect(screen.getByLabelText(/PCOS/)).toBeInTheDocument();

      // 按钮
      expect(screen.getByRole('button', { name: /开始预测/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /重置表单/ })).toBeInTheDocument();
    });

    it('should show loading state when loading prop is true', () => {
      render(<PredictionForm {...defaultProps} loading={true} />);

      const submitButton = screen.getByRole('button', { name: /预测中/ });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('should display initial values when provided', () => {
      const initialValues: PredictionRequest = {
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

      render(<PredictionForm {...defaultProps} initialValues={initialValues} />);

      expect(screen.getByDisplayValue('30')).toBeInTheDocument(); // Age
      expect(screen.getByDisplayValue('12')).toBeInTheDocument(); // Duration
      expect(screen.getByDisplayValue('60')).toBeInTheDocument(); // Weight
    });
  });

  describe('form validation', () => {
    it('should show validation errors for empty required fields', async () => {
      render(<PredictionForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /开始预测/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/请输入年龄/)).toBeInTheDocument();
      });
    });

    it('should validate age range', async () => {
      render(<PredictionForm {...defaultProps} />);

      const ageInput = screen.getByLabelText(/年龄/);
      await user.clear(ageInput);
      await user.type(ageInput, '10'); // 小于最小值18

      const submitButton = screen.getByRole('button', { name: /开始预测/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/年龄必须在18-45岁之间/)).toBeInTheDocument();
      });
    });

    it('should validate numeric inputs', async () => {
      render(<PredictionForm {...defaultProps} />);

      const fshInput = screen.getByLabelText(/FSH/);
      await user.clear(fshInput);
      await user.type(fshInput, '-5'); // 负数

      const submitButton = screen.getByRole('button', { name: /开始预测/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/FSH值必须大于0/)).toBeInTheDocument();
      });
    });

    it('should show field help text', () => {
      render(<PredictionForm {...defaultProps} />);

      expect(screen.getByText(/患者当前实际年龄，范围18-45岁/)).toBeInTheDocument();
      expect(screen.getByText(/月经周期第2-3天检测/)).toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('should call onSubmit with valid form data', async () => {
      render(<PredictionForm {...defaultProps} />);

      // 填写所有必需字段
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

      const submitButton = screen.getByRole('button', { name: /开始预测/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
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
        });
      });
    });

    it('should not submit with invalid data', async () => {
      render(<PredictionForm {...defaultProps} />);

      // 只填写部分字段
      await user.type(screen.getByLabelText(/年龄/), '30');

      const submitButton = screen.getByRole('button', { name: /开始预测/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('form actions', () => {
    it('should reset form when reset button is clicked', async () => {
      render(<PredictionForm {...defaultProps} />);

      // 填写一些数据
      const ageInput = screen.getByLabelText(/年龄/);
      await user.type(ageInput, '30');
      expect(ageInput).toHaveValue(30);

      // 点击重置按钮
      const resetButton = screen.getByRole('button', { name: /重置表单/ });
      await user.click(resetButton);

      // 验证表单被重置
      expect(ageInput).toHaveValue(null);
    });

    it('should disable form when loading', () => {
      render(<PredictionForm {...defaultProps} loading={true} />);

      const ageInput = screen.getByLabelText(/年龄/);
      const submitButton = screen.getByRole('button', { name: /预测中/ });
      const resetButton = screen.getByRole('button', { name: /重置表单/ });

      expect(ageInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
      expect(resetButton).toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<PredictionForm {...defaultProps} />);

      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByLabelText(/年龄/)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/FSH/)).toHaveAttribute('aria-required', 'true');
    });

    it('should support keyboard navigation', async () => {
      render(<PredictionForm {...defaultProps} />);

      const ageInput = screen.getByLabelText(/年龄/);
      ageInput.focus();

      expect(document.activeElement).toBe(ageInput);

      // 按Tab键应该移动到下一个字段
      await user.tab();
      expect(document.activeElement).toBe(screen.getByLabelText(/治疗时长/));
    });

    it('should announce validation errors to screen readers', async () => {
      render(<PredictionForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /开始预测/ });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/请输入年龄/);
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle very large numbers', async () => {
      render(<PredictionForm {...defaultProps} />);

      const ageInput = screen.getByLabelText(/年龄/);
      await user.type(ageInput, '999999');

      const submitButton = screen.getByRole('button', { name: /开始预测/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/年龄必须在18-45岁之间/)).toBeInTheDocument();
      });
    });

    it('should handle decimal inputs correctly', async () => {
      render(<PredictionForm {...defaultProps} />);

      const fshInput = screen.getByLabelText(/FSH/);
      await user.type(fshInput, '8.75');

      expect(fshInput).toHaveValue(8.75);
    });

    it('should prevent invalid characters in numeric fields', async () => {
      render(<PredictionForm {...defaultProps} />);

      const ageInput = screen.getByLabelText(/年龄/);
      await user.type(ageInput, 'abc123');

      // 应该只保留数字部分
      expect(ageInput).toHaveValue(123);
    });
  });
}); 