import React, { useState } from 'react';
import { ConfigProvider, Layout, Typography, Tabs, Space, theme } from 'antd';
import {
  ContactsOutlined,
  HomeOutlined,
  BarChartOutlined,
  ExperimentOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';

import PredictionWizard from './components/prediction/PredictionWizard';
import ContactInfo from './components/contact/ContactInfo';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import './App.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

// Ant Design light theme configuration
const appTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#0ea5e9',
    colorSuccess: '#34d399',
    colorWarning: '#fbbf24',
    colorError: '#f87171',
    colorInfo: '#38bdf8',
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#e8e8e8',
    colorText: '#1a1a1a',
    colorTextSecondary: '#595959',
    colorTextTertiary: '#8c8c8c',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    Card: {
      borderRadius: 12,
      colorBgContainer: '#ffffff',
    },
    Button: {
      borderRadius: 8,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 8,
      colorBgContainer: '#ffffff',
    },
    Select: {
      borderRadius: 8,
      colorBgContainer: '#ffffff',
    },
    InputNumber: {
      borderRadius: 8,
      colorBgContainer: '#ffffff',
    },
    Table: {
      colorBgContainer: '#ffffff',
      headerBg: '#fafafa',
    },
    Tabs: {
      colorBgContainer: 'transparent',
    },
    Steps: {
      colorPrimary: '#0ea5e9',
    },
  },
};

// Feature data
const features = [
  {
    icon: <BarChartOutlined />,
    colorClass: 'blue',
    title: 'AI-Powered Predictions',
    desc: 'XGBoost models trained on clinical data deliver accurate POR & HOR risk assessment.',
  },
  {
    icon: <DatabaseOutlined />,
    colorClass: 'purple',
    title: 'Evidence-Based Protocols',
    desc: 'Comprehensive ovarian stimulation strategy analysis and protocol optimization.',
  },
  {
    icon: <SafetyCertificateOutlined />,
    colorClass: 'green',
    title: 'Clinical Decision Support',
    desc: 'Actionable recommendations to improve patient outcomes in reproductive medicine.',
  },
];

const HomePage: React.FC = () => (
  <Space direction="vertical" size={24} style={{ width: '100%' }}>
    {/* Hero Section */}
    <div className="welcome-hero animate-fade-in-up">
      <div className="hero-badge">
        <ExperimentOutlined />
        Machine Learning · Reproductive Medicine
      </div>

      <Title className="hero-title">
        Predict Ovarian Response<br />
        with <span className="hero-title-accent">Precision AI</span>
      </Title>

      <Paragraph className="hero-description">
        An advanced clinical decision support system using XGBoost models to predict
        Poor Ovarian Response (POR) and High Ovarian Response (HOR) — helping clinicians
        optimize IVF treatment strategies with confidence.
      </Paragraph>

      <div className="hero-stats">
        <div className="hero-stat">
          <span className="hero-stat-value">2</span>
          <span className="hero-stat-label">Prediction Models</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-value">15</span>
          <span className="hero-stat-label">Clinical Parameters</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-value">XGB</span>
          <span className="hero-stat-label">Algorithm</span>
        </div>
      </div>
    </div>

    {/* Feature Cards */}
    <div className="feature-grid">
      {features.map((f, i) => (
        <div
          key={f.title}
          className={`feature-card-new animate-fade-in-up animate-fade-in-up-delay-${i + 1}`}
        >
          <div className={`feature-icon-wrapper ${f.colorClass}`}>
            {f.icon}
          </div>
          <h3 className="feature-card-title">{f.title}</h3>
          <p className="feature-card-desc">{f.desc}</p>
        </div>
      ))}
    </div>
  </Space>
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
                marginBottom: 0,
              }}
            />
          </div>
        </Content>

        <Footer />
      </Layout>
    </ConfigProvider>
  );
};

export default App;