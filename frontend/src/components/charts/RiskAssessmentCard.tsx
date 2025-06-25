import React from 'react';
import {
  Card,
  Progress,
  Typography,
  Space,
  Row,
  Col,
  Tag,
  Tooltip,
} from 'antd';
import {
  WarningOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

import { RiskLevel } from '../../utils/api';
import { useResponsive } from '../../utils/responsive';

const { Text, Title } = Typography;

interface RiskAssessment {
  level: RiskLevel;
  probability: number;
  description: string;
  color: string;
}

interface RiskAssessmentCardProps {
  title: string;
  subtitle: string;
  assessment: RiskAssessment;
  normalProb: number;
}

const RiskAssessmentCard: React.FC<RiskAssessmentCardProps> = ({
  title,
  subtitle,
  assessment,
  normalProb,
}) => {
  const { isMobile } = useResponsive();

  // 获取风险级别对应的图标和样式
  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return <WarningOutlined style={{ color: '#ff4d4f' }} />;
      case 'medium':
        return <InfoCircleOutlined style={{ color: '#faad14' }} />;
      case 'low':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default:
        return <QuestionCircleOutlined />;
    }
  };

  // 获取风险级别的背景色
  const getRiskBgColor = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return '#fff2f0';
      case 'medium':
        return '#fffbe6';
      case 'low':
        return '#f6ffed';
      default:
        return '#f5f5f5';
    }
  };

  // 获取风险级别的说明文本
  const getRiskDescription = (level: RiskLevel, type: 'por' | 'hor') => {
    if (type === 'por') {
      switch (level) {
        case 'high':
          return '卵巢对促排卵药物反应可能较差，可能需要调整治疗方案';
        case 'medium':
          return '卵巢反应处于中等水平，建议密切监测';
        case 'low':
          return '卵巢反应良好，预期能够获得理想的治疗效果';
        default:
          return '';
      }
    } else {
      switch (level) {
        case 'high':
          return '卵巢可能对促排卵药物过度反应，需警惕OHSS风险';
        case 'medium':
          return '卵巢反应处于中等水平，需适度调整药物剂量';
        case 'low':
          return '卵巢过度反应风险较低，可按标准方案进行';
        default:
          return '';
      }
    }
  };

  const isPor = title.includes('低反应');
  const riskType = isPor ? 'por' : 'hor';
  const riskDescription = getRiskDescription(assessment.level, riskType);

  return (
    <Card
      size="small"
      style={{
        background: getRiskBgColor(assessment.level),
        border: `2px solid ${assessment.color}`,
        borderRadius: '12px',
      }}
    >
      {/* 卡片头部 */}
      <div style={{ marginBottom: '16px' }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Space>
            {getRiskIcon(assessment.level)}
            <Title level={4} style={{ margin: 0, fontSize: isMobile ? '16px' : '18px' }}>
              {title}
            </Title>
          </Space>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {subtitle}
          </Text>
        </Space>
      </div>

      {/* 概率展示 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px' }}>
              <Text strong style={{ fontSize: isMobile ? '24px' : '28px', color: assessment.color }}>
                {(assessment.probability * 100).toFixed(1)}%
              </Text>
            </div>
            <Tag 
              color={assessment.level === 'high' ? 'error' : assessment.level === 'medium' ? 'warning' : 'success'}
              style={{ 
                fontSize: '14px',
                padding: '4px 12px',
                borderRadius: '16px',
              }}
            >
              {assessment.description}
            </Tag>
          </div>
        </Col>
        
        <Col xs={24} sm={12}>
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Text>风险概率</Text>
              <Tooltip title="基于机器学习模型预测的概率值">
                <QuestionCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </div>
          </div>
          <Progress
            percent={assessment.probability * 100}
            strokeColor={assessment.color}
            trailColor="#f0f0f0"
            strokeWidth={8}
            showInfo={false}
            style={{ marginBottom: '8px' }}
          />
          
          <div style={{ marginBottom: '8px' }}>
            <Text>正常概率</Text>
          </div>
          <Progress
            percent={normalProb * 100}
            strokeColor="#52c41a"
            trailColor="#f0f0f0"
            strokeWidth={6}
            showInfo={false}
          />
        </Col>
      </Row>

      {/* 详细说明 */}
      <div style={{ 
        marginTop: '16px',
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '8px',
        border: '1px solid #f0f0f0',
      }}>
        <Text style={{ 
          fontSize: '13px',
          lineHeight: '1.5',
          color: '#666',
        }}>
          {riskDescription}
        </Text>
      </div>

      {/* 阈值说明 */}
      <div style={{ marginTop: '12px' }}>
        <Text type="secondary" style={{ fontSize: '11px' }}>
          风险评估标准: 
          <Tag color="success" style={{ margin: '0 4px' }}>
            低风险 &lt;30%
          </Tag>
          <Tag color="warning" style={{ margin: '0 4px' }}>
            中等风险 30-70%
          </Tag>
          <Tag color="error" style={{ margin: '0 4px' }}>
            高风险 &gt;70%
          </Tag>
        </Text>
      </div>
    </Card>
  );
};

export default RiskAssessmentCard; 