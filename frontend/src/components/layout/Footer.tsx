import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import { CopyrightOutlined, GlobalOutlined, SafetyOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter className="app-footer">
      <div className="footer-content">
        <Space direction="vertical" size={12} style={{ width: '100%', textAlign: 'center' }}>
          <Space split={<Divider type="vertical" />} size="large" wrap>
            <Space size="small">
              <CopyrightOutlined />
              <Text>2024 Zhejiang University Women's Hospital</Text>
            </Space>

            <Space size="small">
              <GlobalOutlined />
              <Link href="https://www.zju.edu.cn" target="_blank" rel="noopener noreferrer">
                www.zju.edu.cn
              </Link>
            </Space>
          </Space>

          <Space size="small">
            <SafetyOutlined style={{ color: 'rgba(255,255,255,0.25)' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              For research and clinical decision support only. Always consult qualified medical professionals.
            </Text>
          </Space>
        </Space>
      </div>
    </AntFooter>
  );
};

export default Footer;