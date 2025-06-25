import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import dayjs from 'dayjs';
import 'dayjs/locale/en';

import App from './App';
import { APP_CONFIG } from '@/constants/config';
import './styles/global.css';

// Configure dayjs English language
dayjs.locale('en');

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 6,
      fontWeight: 600,
    },
    Input: {
      borderRadius: 6,
      fontSize: 14,
    },
    Card: {
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    Menu: {
      itemBorderRadius: 6,
    },
    Steps: {
      fontSize: 14,
    },
  },
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ color: '#f5222d', marginBottom: '16px' }}>
            Application Error
          </h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Sorry, the application encountered an unexpected error. Please refresh the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Refresh Page
          </button>
          {APP_CONFIG.DEV_MODE && this.state.error && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary>Error Details (Development Mode)</summary>
              <pre style={{ marginTop: '10px', fontSize: '12px' }}>
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Render Application
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ConfigProvider locale={enUS} theme={theme}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ConfigProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Enable React Query DevTools in development mode
if (APP_CONFIG.DEV_MODE) {
  import('@tanstack/react-query-devtools').then(() => {
    // Optionally add developer tools
    console.log('React Query DevTools available');
  });
} 