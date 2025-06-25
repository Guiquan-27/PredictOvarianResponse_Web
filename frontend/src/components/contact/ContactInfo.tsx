import React from 'react';
import {
  Card,
  Row,
  Col,
  Space,
  Typography,
  Button,
  Divider,
  Image,
  Tag,
} from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text, Link } = Typography;

const ContactInfo: React.FC = () => {
  return (
    <div className="contact-info">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <Card className="contact-header">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={12}>
              <Space direction="vertical" size="middle">
                <div>
                  <Title level={2} style={{ color: '#437A8B', marginBottom: 8 }}>
                    Contact Information
                  </Title>
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    Get in touch with our research team for questions, support, or collaboration opportunities.
                  </Text>
                </div>
                
                <Space direction="vertical" size="small">
                  <Tag color="processing" icon={<TeamOutlined />}>
                    Research & Development
                  </Tag>
                  <Tag color="success" icon={<TeamOutlined />}>
                    Clinical Support
                  </Tag>
                </Space>
              </Space>
            </Col>
            
            <Col xs={24} md={12}>
              <div className="institution-logos" style={{ textAlign: 'center' }}>
                <Space direction="vertical" size="middle">
                  <div>
                    <Title level={4} style={{ color: '#437A8B' }}>
                      Zhejiang University
                    </Title>
                    <Text type="secondary">Women's Hospital</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    School of Medicine
                  </Text>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          {/* Primary Contact */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <MailOutlined style={{ color: '#437A8B' }} />
                  <span>Primary Contact</span>
                </Space>
              }
              className="contact-card"
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Title level={4}>Research Team</Title>
                  <Paragraph>
                    For questions about the prediction system, technical support, 
                    or research collaboration inquiries.
                  </Paragraph>
                </div>
                
                <Space direction="vertical" size="small">
                  <div>
                    <MailOutlined style={{ marginRight: 8, color: '#437A8B' }} />
                    <Link href="mailto:frank_sjtu@hotmail.com">
                      frank_sjtu@hotmail.com
                    </Link>
                  </div>
                </Space>
                
                <Button 
                  type="primary" 
                  icon={<MailOutlined />}
                  href="mailto:frank_sjtu@hotmail.com"
                  style={{ marginTop: 16 }}
                >
                  Send Email
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Clinical Support */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <TeamOutlined style={{ color: '#52c41a' }} />
                  <span>Clinical Support</span>
                </Space>
              }
              className="contact-card"
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Title level={4}>Clinical Team</Title>
                  <Paragraph>
                    For clinical questions, interpretation of results, 
                    or implementation guidance.
                  </Paragraph>
                </div>
                
                <Space direction="vertical" size="small">
                  <div>
                    <MailOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                    <Link href="mailto:frank_sjtu@hotmail.com">
                      frank_sjtu@hotmail.com
                    </Link>
                  </div>
                </Space>
                
                <Button 
                  type="default" 
                  icon={<MailOutlined />}
                  href="mailto:frank_sjtu@hotmail.com"
                  style={{ marginTop: 16 }}
                >
                  Contact Clinical Team
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Institution Information */}
        <Card 
          title={
            <Space>
              <EnvironmentOutlined style={{ color: '#faad14' }} />
              <span>Institution Information</span>
            </Space>
          }
        >
          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={3} style={{ color: '#437A8B', marginBottom: 8 }}>
                  Zhejiang University Women's Hospital
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  School of Medicine
                </Text>
              </div>
              
              <Row gutter={[32, 24]} justify="center">
                <Col xs={24} sm={12} md={8}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <EnvironmentOutlined style={{ fontSize: 20, color: '#faad14' }} />
                    <Text style={{ textAlign: 'center', display: 'block' }}>
                      No. 1 Xueshi Road, Shangcheng District<br />
                      Hangzhou, Zhejiang Province, 310006<br />
                      People's Republic of China
                    </Text>
                  </Space>
                </Col>
                
                <Col xs={24} sm={12} md={8}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <GlobalOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                    <Link href="https://www.womanhospital.cn/" target="_blank" style={{ fontSize: 16 }}>
                      www.womanhospital.cn
                    </Link>
                    <Button 
                      type="primary" 
                      icon={<GlobalOutlined />}
                      href="https://www.womanhospital.cn/"
                      target="_blank"
                      style={{ marginTop: 8 }}
                    >
                      Visit Hospital Website
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Space>
          </div>
        </Card>

      </Space>
    </div>
  );
};

export default ContactInfo;