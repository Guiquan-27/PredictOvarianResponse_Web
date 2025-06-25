import React from 'react';
import { Layout, Typography, Space, Tag } from 'antd';
import { ExperimentOutlined, BulbOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

const Header: React.FC = () => {
  return (
    <AntHeader className="app-header">
      <div className="header-content">
        <div className="header-left">
          <Space align="center" size="middle">
            <div className="logo-container">
              <ExperimentOutlined className="logo-icon" />
            </div>
            <div className="header-text">
              <Title level={3} className="header-title">
                IVF Ovarian Response Prediction System
              </Title>
              <Text className="header-subtitle">
                AI-Powered Clinical Decision Support
              </Text>
            </div>
          </Space>
        </div>
        
        <div className="header-right">
          <Space size="middle">
            <Tag color="processing" icon={<BulbOutlined />}>
              ML-Powered
            </Tag>
            <div className="institution-logo">
              <img 
                src="/hospital_logo.png" 
                alt="Hospital Logo" 
                style={{ 
                  height: '40px', 
                  width: 'auto',
                  maxWidth: '120px',
                  objectFit: 'contain'
                }} 
              />
            </div>
          </Space>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;