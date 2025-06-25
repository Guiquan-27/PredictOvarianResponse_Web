import React from 'react';
import { Layout, Menu, Typography, Space, Divider } from 'antd';
import { 
  MedicineBoxOutlined, 
  ExperimentOutlined, 
  FileTextOutlined, 
  InfoCircleOutlined,
  HistoryOutlined 
} from '@ant-design/icons';
import { APP_CONFIG } from '@/constants/config';
import { useResponsive, medicalResponsive } from '@/utils/responsive';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
  selectedKey?: string;
  onMenuSelect?: (key: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  selectedKey = 'prediction',
  onMenuSelect 
}) => {
  const { isMobile, isTablet } = useResponsive();
  const menuItems = [
    {
      key: 'prediction',
      icon: <ExperimentOutlined />,
      label: '预测分析',
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: '历史记录',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined />,
      label: '关于项目',
    },
    {
      key: 'model-info',
      icon: <FileTextOutlined />,
      label: '模型说明',
    },
    {
      key: 'disclaimer',
      icon: <FileTextOutlined />,
      label: '免责声明',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 头部导航 */}
      <Header
        style={{
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Space size="middle">
          <MedicineBoxOutlined
            style={{ 
              fontSize: '28px', 
              color: '#1890ff',
              padding: '4px',
              background: '#f0f8ff',
              borderRadius: '6px'
            }}
          />
          <div>
            <Title 
              level={3} 
              style={{ 
                margin: 0, 
                color: '#262626',
                fontWeight: 600 
              }}
            >
              {APP_CONFIG.TITLE}
            </Title>
            <Text 
              type="secondary" 
              style={{ 
                fontSize: '12px',
                display: 'block',
                marginTop: '-4px'
              }}
            >
              临床决策支持系统
            </Text>
          </div>
        </Space>
        
        <Space>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            版本 {APP_CONFIG.VERSION}
          </Text>
        </Space>
      </Header>

      <Layout>
        {/* 侧边导航 */}
        <Sider
          width={medicalResponsive.siderWidth.expanded}
          style={{
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
          }}
          breakpoint="lg"
          collapsedWidth="0"
          trigger={null}
          hidden={isMobile}
        >
          <div style={{ padding: '16px 0' }}>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              style={{ border: 'none' }}
              items={menuItems}
              onSelect={({ key }) => onMenuSelect?.(key)}
            />
          </div>
        </Sider>

        {/* 主内容区域 */}
        <Layout style={{ background: '#f5f5f5' }}>
          <Content
            style={{
              margin: isMobile ? '12px' : isTablet ? '16px' : '24px',
              minHeight: 'calc(100vh - 64px - 48px - 70px)', // 减去header、margin、footer高度
            }}
          >
            {children}
          </Content>

          {/* 底部信息 */}
          <Footer 
            style={{ 
              textAlign: 'center',
              background: '#fff',
              borderTop: '1px solid #f0f0f0',
              padding: '16px 50px'
            }}
          >
            <Space direction="vertical" size="small">
              <Text type="secondary" style={{ fontSize: '13px' }}>
                卵巢反应预测工具 ©2024 - 仅供医疗专业人员使用
              </Text>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                本系统基于机器学习模型，结果仅供参考，不能替代临床医师的专业判断
              </Text>
              <Divider type="vertical" />
              <Text type="secondary" style={{ fontSize: '11px' }}>
                请确保在具备相关资质的医疗环境下使用
              </Text>
            </Space>
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 