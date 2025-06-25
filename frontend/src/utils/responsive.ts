import { useState, useEffect } from 'react';

// 断点定义（与 Ant Design 保持一致）
export const breakpoints = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1600,
  xxl: 1600,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// 通用断点获取函数（测试期望名 getBreakpoint）
export const getBreakpoint = (width: number | undefined = undefined): Breakpoint => {
  if (typeof window === 'undefined' && width === undefined) {
    // SSR 环境默认返回 md
    return 'md';
  }
  const w = typeof width === 'number' ? width : window.innerWidth;
  
  if (w < breakpoints.xs) return 'xs';
  if (w < breakpoints.sm) return 'sm';
  if (w < breakpoints.md) return 'md';
  if (w < breakpoints.lg) return 'lg';
  if (w < breakpoints.xl) return 'xl';
  return 'xxl';
};

// 兼容旧命名 getScreenSize -> 保持向后兼容
export const getScreenSize = (): Breakpoint => getBreakpoint();

// 检查是否为移动设备
export const isMobile = (): boolean => {
  return window.innerWidth < breakpoints.md;
};

// 检查是否为平板设备
export const isTablet = (): boolean => {
  const width = window.innerWidth;
  return width >= breakpoints.sm && width < breakpoints.lg;
};

// 检查是否为桌面设备
export const isDesktop = (): boolean => {
  return window.innerWidth >= breakpoints.lg;
};

// React Hook: 监听屏幕尺寸变化
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'lg'; // SSR 兼容
    return getScreenSize();
  });

  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window === 'undefined') return { width: 1200, height: 800 };
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const newSize = getScreenSize();
      const newWindowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      
      setScreenSize(newSize);
      setWindowSize(newWindowSize);
    };

    // 添加防抖以提高性能
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedHandleResize);
    
    // 初始化调用
    handleResize();

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    screenSize,
    windowSize,
    isMobile: screenSize === 'xs' || screenSize === 'sm',
    isTablet: screenSize === 'md',
    isDesktop: screenSize === 'lg' || screenSize === 'xl' || screenSize === 'xxl',
    isSmallScreen: screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md',
  };
};

// 根据屏幕尺寸返回不同的值
export const responsive = <T>(values: Partial<Record<Breakpoint, T>>): T | undefined => {
  const currentSize = getScreenSize();
  
  // 按优先级查找匹配的值
  const sizes: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = sizes.indexOf(currentSize);
  
  // 从当前尺寸开始，向下查找可用的值
  for (let i = currentIndex; i < sizes.length; i++) {
    if (values[sizes[i]] !== undefined) {
      return values[sizes[i]];
    }
  }
  
  // 如果向下没找到，向上查找
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (values[sizes[i]] !== undefined) {
      return values[sizes[i]];
    }
  }
  
  return undefined;
};

// 获取响应式的栅格布局配置
export const getResponsiveGridProps = (
  mobileSpan: number = 24,
  tabletSpan: number = 12,
  desktopSpan: number = 8
) => {
  return {
    xs: mobileSpan,
    sm: mobileSpan,
    md: tabletSpan,
    lg: desktopSpan,
    xl: desktopSpan,
    xxl: desktopSpan,
  };
};

// 获取响应式的间距配置
export const getResponsiveGutter = (): [number, number] => {
  const size = getScreenSize();
  
  switch (size) {
    case 'xs':
      return [8, 8];
    case 'sm':
      return [12, 12];
    case 'md':
      return [16, 16];
    case 'lg':
    case 'xl':
    case 'xxl':
    default:
      return [24, 24];
  }
};

// 医疗应用特定的响应式配置
export const medicalResponsive = {
  // 表单布局
  formLayout: {
    xs: { labelCol: { span: 24 }, wrapperCol: { span: 24 } },
    sm: { labelCol: { span: 24 }, wrapperCol: { span: 24 } },
    md: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
    lg: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
  },
  
  // 卡片栅格
  cardGrid: {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 8,
    xl: 6,
  },
  
  // 结果展示栅格
  resultGrid: {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 12,
    xl: 12,
  },
  
  // 侧边栏宽度
  siderWidth: {
    collapsed: 0,
    expanded: responsive({
      xs: 0,
      sm: 0,
      md: 200,
      lg: 240,
      xl: 280,
    }) || 240,
  },
};

// ADD: 极简 useBreakpoint Hook（测试只关心当前断点字符串）
export const useBreakpoint = (): Breakpoint => {
  const getCurrent = () => getBreakpoint();
  const [bp, setBp] = useState<Breakpoint>(getCurrent);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let throttleId: number | undefined;
    const resizeHandler = () => {
      // 节流：100ms
      if (throttleId) return;
      throttleId = window.setTimeout(() => {
        throttleId = undefined;
        setBp(getCurrent());
      }, 100);
    };

    window.addEventListener('resize', resizeHandler);
    return () => {
      if (throttleId) clearTimeout(throttleId);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return bp;
}; 