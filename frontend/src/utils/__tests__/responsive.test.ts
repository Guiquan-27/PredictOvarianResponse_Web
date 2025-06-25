import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getBreakpoint, useBreakpoint } from '../responsive';
import { renderHook, act } from '@testing-library/react';

// 模拟window.matchMedia
const mockMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

describe('Responsive Utils', () => {
  beforeEach(() => {
    // 重置window.matchMedia模拟
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(mockMatchMedia),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getBreakpoint', () => {
    it('should return xs for width < 576', () => {
      expect(getBreakpoint(500)).toBe('xs');
      expect(getBreakpoint(575)).toBe('xs');
    });

    it('should return sm for width 576-767', () => {
      expect(getBreakpoint(576)).toBe('sm');
      expect(getBreakpoint(700)).toBe('sm');
      expect(getBreakpoint(767)).toBe('sm');
    });

    it('should return md for width 768-991', () => {
      expect(getBreakpoint(768)).toBe('md');
      expect(getBreakpoint(900)).toBe('md');
      expect(getBreakpoint(991)).toBe('md');
    });

    it('should return lg for width 992-1199', () => {
      expect(getBreakpoint(992)).toBe('lg');
      expect(getBreakpoint(1100)).toBe('lg');
      expect(getBreakpoint(1199)).toBe('lg');
    });

    it('should return xl for width >= 1200', () => {
      expect(getBreakpoint(1200)).toBe('xl');
      expect(getBreakpoint(1500)).toBe('xl');
      expect(getBreakpoint(2000)).toBe('xl');
    });

    it('should handle edge cases', () => {
      expect(getBreakpoint(0)).toBe('xs');
      expect(getBreakpoint(-100)).toBe('xs');
    });
  });

  describe('useBreakpoint', () => {
    it('should return current breakpoint based on window width', () => {
      // 模拟不同的屏幕尺寸
      const testCases = [
        { width: 500, expected: 'xs' },
        { width: 650, expected: 'sm' },
        { width: 850, expected: 'md' },
        { width: 1100, expected: 'lg' },
        { width: 1400, expected: 'xl' },
      ];

      testCases.forEach(({ width, expected }) => {
        // 设置window.innerWidth
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });

        const { result } = renderHook(() => useBreakpoint());
        expect(result.current).toBe(expected);
      });
    });

    it('should update breakpoint when window resizes', () => {
      // 初始设置较小屏幕
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      const { result } = renderHook(() => useBreakpoint());
      expect(result.current).toBe('xs');

      // 模拟窗口大小改变
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1000,
        });

        // 触发resize事件
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current).toBe('lg');
    });

    it('should add and remove resize listener', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useBreakpoint());

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('should handle server-side rendering (no window)', () => {
      // 暂时移除window对象模拟SSR环境
      const originalWindow = global.window;
      delete (global as any).window;

      const { result } = renderHook(() => useBreakpoint());
      
      // 在SSR环境下应该返回默认值
      expect(result.current).toBe('md'); // 假设默认值是md

      // 恢复window对象
      global.window = originalWindow;
    });

    it('should throttle resize events', () => {
      vi.useFakeTimers();

      const { result } = renderHook(() => useBreakpoint());

      // 初始值
      expect(result.current).toBe('xs');

      // 快速触发多次resize事件
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1000,
        });

        for (let i = 0; i < 10; i++) {
          window.dispatchEvent(new Event('resize'));
        }
      });

      // 在throttle期间不应该更新
      expect(result.current).toBe('xs');

      // 等待throttle延迟
      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current).toBe('lg');

      vi.useRealTimers();
    });
  });

  describe('breakpoint helpers', () => {
    it('should provide correct breakpoint constants', () => {
      const breakpoints = {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
      };

      // 验证断点常量是否正确
      expect(getBreakpoint(breakpoints.xs)).toBe('xs');
      expect(getBreakpoint(breakpoints.sm)).toBe('sm');
      expect(getBreakpoint(breakpoints.md)).toBe('md');
      expect(getBreakpoint(breakpoints.lg)).toBe('lg');
      expect(getBreakpoint(breakpoints.xl)).toBe('xl');
    });
  });
}); 