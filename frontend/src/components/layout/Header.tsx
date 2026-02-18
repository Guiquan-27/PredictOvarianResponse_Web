import React from 'react';
import { Layout, Space } from 'antd';
import { ExperimentOutlined, BulbOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  return (
    <AntHeader className="app-header">
      <div className="header-content">
        <div className="header-left">
          <Space align="center" size={14}>
            <div className="logo-container">
              <ExperimentOutlined className="logo-icon" />
            </div>
            <div className="header-text">
              <div className="header-title">
                IVF Ovarian Response Prediction
              </div>
              <div className="header-subtitle">
                AI-Powered Clinical Decision Support
              </div>
            </div>
          </Space>
        </div>

        <div className="header-right">
          <Space size={12}>
            <div className="api-status-badge">
              <span className="api-status-dot" />
              System Online
            </div>
            <span className="ml-tag ant-tag">
              <BulbOutlined style={{ marginRight: 4 }} />
              ML-Powered
            </span>
          </Space>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;