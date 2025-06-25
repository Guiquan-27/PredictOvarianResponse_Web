import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import { CopyrightOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter className="app-footer">
      <div className="footer-content">
        <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center' }}>
          <Space split={<Divider type="vertical" />} size="large">
            <Space size="small">
              <CopyrightOutlined />
              <Text>2024 Zhejiang University Women's Hospital</Text>
            </Space>
            
            <Space size="small">
              <MailOutlined />
              <Link href="mailto:contact@example.com">contact@example.com</Link>
            </Space>
            
            <Space size="small">
              <GlobalOutlined />
              <Link href="https://www.zju.edu.cn" target="_blank">
                www.zju.edu.cn
              </Link>
            </Space>
          </Space>
          
          <Text type="secondary" style={{ fontSize: 12 }}>
            This system is for research and clinical decision support purposes only. 
            Always consult with qualified medical professionals.
          </Text>
        </Space>
      </div>
    </AntFooter>
  );
};

export default Footer;