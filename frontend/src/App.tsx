import React, { useState } from 'react';
import { ConfigProvider, Layout, Typography, Tabs, Card, Space } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CalendarOutlined, ContactsOutlined, HomeOutlined, BarChartOutlined } from '@ant-design/icons';

import PredictionWizard from './components/prediction/PredictionWizard';
import ContactInfo from './components/contact/ContactInfo';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { CONFIG } from './config';

import './App.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: CONFIG.API.MAX_RETRIES,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Main application theme
const appTheme = {
  token: {
    colorPrimary: '#437A8B', // Primary blue from Shiny app
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#C23248', // Red from Shiny app
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Card: {
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    Button: {
      borderRadius: 6,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 6,
    },
    Select: {
      borderRadius: 6,
    },
  },
};

const HomePage: React.FC = () => (
  <Card className="welcome-card">
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div className="welcome-header">
        <CalendarOutlined className="welcome-icon" />
        <Title level={2} style={{ margin: 0, color: '#437A8B' }}>
          IVF Ovarian Response Prediction System
        </Title>
      </div>
      
      <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
        Welcome to the advanced ovarian response prediction system. This tool uses machine learning 
        algorithms to predict Poor Ovarian Response (POR) and High Ovarian Response (HOR) based on 
        clinical parameters, helping clinicians optimize treatment strategies for assisted reproductive technology.
      </Paragraph>

      <div className="feature-grid">
        <Card className="feature-card" size="small">
          <BarChartOutlined style={{ fontSize: 24, color: '#437A8B', marginBottom: 8 }} />
          <Title level={4}>AI-Powered Predictions</Title>
          <Paragraph>
            Advanced XGBoost models trained on clinical data to provide accurate predictions
          </Paragraph>
        </Card>
        
        <Card className="feature-card" size="small">
          <CalendarOutlined style={{ fontSize: 24, color: '#437A8B', marginBottom: 8 }} />
          <Title level={4}>Treatment Strategies</Title>
          <Paragraph>
            Comprehensive analysis of ovarian stimulation strategies and protocol optimization
          </Paragraph>
        </Card>
        
        <Card className="feature-card" size="small">
          <HomeOutlined style={{ fontSize: 24, color: '#437A8B', marginBottom: 8 }} />
          <Title level={4}>Clinical Decision Support</Title>
          <Paragraph>
            Evidence-based recommendations to improve patient outcomes in reproductive medicine
          </Paragraph>
        </Card>
      </div>
    </Space>
  </Card>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('prediction');

  const tabItems = [
    {
      key: 'home',
      label: (
        <span>
          <HomeOutlined />
          Home
        </span>
      ),
      children: <HomePage />,
    },
    {
      key: 'prediction',
      label: (
        <span>
          <BarChartOutlined />
          Prediction
        </span>
      ),
      children: <PredictionWizard />,
    },
    {
      key: 'contact',
      label: (
        <span>
          <ContactsOutlined />
          Contact Us
        </span>
      ),
      children: <ContactInfo />,
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={appTheme}>
        <Layout className="app-layout">
          <Header />
          
          <Content className="app-content">
            <div className="content-container">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                size="large"
                className="main-tabs"
                tabBarStyle={{
                  marginBottom: 24,
                  borderBottom: '2px solid #f0f0f0',
                }}
              />
            </div>
          </Content>

          <Footer />
        </Layout>
      </ConfigProvider>
      
      {CONFIG.DEBUG.ENABLED && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default App;