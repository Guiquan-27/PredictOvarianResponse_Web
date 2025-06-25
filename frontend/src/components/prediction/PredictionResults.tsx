import React from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Space,
  Typography,
  Tag,
  Alert,
  Descriptions,
  Divider,
} from 'antd';
import {
  TrophyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  HeartOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

import { PredictionFormData, PredictionType } from '../../types/prediction';

const { Title, Text, Paragraph } = Typography;

interface PredictionResultsProps {
  result: any;
  predictionType: PredictionType;
  patientData: PredictionFormData;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({
  result,
  predictionType,
  patientData,
}) => {
  if (!result || result.status !== 'success') {
    return (
      <Alert
        message="No prediction results available"
        description="Please submit valid patient data to get predictions."
        type="warning"
        showIcon
      />
    );
  }

  const getRiskLevel = (probability: number) => {
    if (probability >= 0.7) return { level: 'high', color: '#ff4d4f', text: 'High Risk' };
    if (probability >= 0.3) return { level: 'medium', color: '#faad14', text: 'Medium Risk' };
    return { level: 'low', color: '#52c41a', text: 'Low Risk' };
  };

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  const renderPORResults = () => {
    if (!result.por_prediction) return null;

    const poorProb = result.por_prediction.poor_response_prob;
    const normalProb = result.por_prediction.normal_response_prob;
    const poorRisk = getRiskLevel(poorProb);
    const classification = poorProb > 0.5 ? 'Poor Response' : 'Normal Response';

    return (
      <Card 
        title={
          <Space>
            <WarningOutlined style={{ color: '#faad14' }} />
            <span>Poor Ovarian Response (POR) Prediction</span>
          </Space>
        }
        className="prediction-card"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card className="risk-card" size="small">
              <Statistic
                title="Poor Response Probability"
                value={poorProb}
                formatter={(value) => formatPercentage(value as number)}
                prefix={<WarningOutlined />}
                valueStyle={{ color: poorRisk.color }}
              />
              <Progress
                percent={poorProb * 100}
                strokeColor={poorRisk.color}
                showInfo={false}
                size="small"
              />
              <Tag color={poorRisk.color} style={{ marginTop: 8 }}>
                {poorRisk.text}
              </Tag>
            </Card>
          </Col>
          
          <Col xs={24} sm={12}>
            <Card className="risk-card" size="small">
              <Statistic
                title="Normal Response Probability"
                value={normalProb}
                formatter={(value) => formatPercentage(value as number)}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress
                percent={normalProb * 100}
                strokeColor="#52c41a"
                showInfo={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>

        <Divider />

        <Alert
          message={`Predicted Classification: ${classification}`}
          description={
            poorProb > 0.5
              ? "The patient is predicted to have poor ovarian response. Consider adjusting the stimulation protocol."
              : "The patient is predicted to have normal ovarian response. Standard protocols may be appropriate."
          }
          type={poorProb > 0.5 ? "warning" : "success"}
          showIcon
        />
      </Card>
    );
  };

  const renderHORResults = () => {
    if (!result.hor_prediction) return null;

    const highProb = result.hor_prediction.high_response_prob;
    const normalProb = result.hor_prediction.normal_response_prob;
    const highRisk = getRiskLevel(highProb);
    const classification = highProb > 0.5 ? 'High Response' : 'Normal Response';

    return (
      <Card 
        title={
          <Space>
            <TrophyOutlined style={{ color: '#ff4d4f' }} />
            <span>High Ovarian Response (HOR) Prediction</span>
          </Space>
        }
        className="prediction-card"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card className="risk-card" size="small">
              <Statistic
                title="High Response Probability"
                value={highProb}
                formatter={(value) => formatPercentage(value as number)}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: highRisk.color }}
              />
              <Progress
                percent={highProb * 100}
                strokeColor={highRisk.color}
                showInfo={false}
                size="small"
              />
              <Tag color={highRisk.color} style={{ marginTop: 8 }}>
                {highRisk.text}
              </Tag>
            </Card>
          </Col>
          
          <Col xs={24} sm={12}>
            <Card className="risk-card" size="small">
              <Statistic
                title="Normal Response Probability"
                value={normalProb}
                formatter={(value) => formatPercentage(value as number)}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress
                percent={normalProb * 100}
                strokeColor="#52c41a"
                showInfo={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>

        <Divider />

        <Alert
          message={`Predicted Classification: ${classification}`}
          description={
            highProb > 0.5
              ? "The patient is predicted to have high ovarian response. Consider OHSS prevention strategies."
              : "The patient is predicted to have normal ovarian response. Standard protocols may be appropriate."
          }
          type={highProb > 0.5 ? "warning" : "success"}
          showIcon
        />
      </Card>
    );
  };

  const renderPatientSummary = () => (
    <Card 
      title={
        <Space>
          <HeartOutlined style={{ color: '#437A8B' }} />
          <span>Patient Summary</span>
        </Space>
      }
      size="small"
    >
      <Descriptions size="small" column={2}>
        <Descriptions.Item label="Age">{patientData.Age} years</Descriptions.Item>
        <Descriptions.Item label="AMH">{patientData.AMH} ng/mL</Descriptions.Item>
        <Descriptions.Item label="AFC">{patientData.AFC}</Descriptions.Item>
        <Descriptions.Item label="FSH">{patientData.FSH} IU/L</Descriptions.Item>
        <Descriptions.Item label="Weight">{patientData.Weight} kg</Descriptions.Item>
        <Descriptions.Item label="Duration">{patientData.Duration} months</Descriptions.Item>
      </Descriptions>
    </Card>
  );

  const renderClinicalRecommendations = () => {
    const porRisk = result.por_prediction ? getRiskLevel(result.por_prediction.poor_response_prob) : null;
    const horRisk = result.hor_prediction ? getRiskLevel(result.hor_prediction.high_response_prob) : null;

    const recommendations = [];

    if (porRisk && porRisk.level === 'high') {
      recommendations.push("Consider higher starting dose of gonadotropins");
      recommendations.push("Consider LH supplementation");
      recommendations.push("Monitor response closely and adjust protocol as needed");
    }

    if (horRisk && horRisk.level === 'high') {
      recommendations.push("Consider lower starting dose to prevent OHSS");
      recommendations.push("Monitor for early signs of ovarian hyperstimulation");
      recommendations.push("Consider GnRH agonist trigger instead of hCG");
    }

    if (recommendations.length === 0) {
      recommendations.push("Standard stimulation protocols may be appropriate");
      recommendations.push("Monitor response and adjust as clinically indicated");
    }

    return (
      <Card 
        title={
          <Space>
            <InfoCircleOutlined style={{ color: '#1890ff' }} />
            <span>Clinical Recommendations</span>
          </Space>
        }
        size="small"
      >
        <ul style={{ marginBottom: 0 }}>
          {recommendations.map((rec, index) => (
            <li key={index} style={{ marginBottom: 8 }}>
              <Text>{rec}</Text>
            </li>
          ))}
        </ul>
        
        <Alert
          message="Important Notice"
          description="These recommendations are AI-generated suggestions based on statistical models. Always consult with qualified medical professionals and consider the complete clinical picture when making treatment decisions."
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Card>
    );
  };

  return (
    <div className="prediction-results">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="results-header">
          <Title level={3} style={{ color: '#437A8B', marginBottom: 8 }}>
            <BarChartOutlined style={{ marginRight: 8 }} />
            Prediction Results
          </Title>
          <Text type="secondary">
            AI-powered ovarian response predictions based on clinical parameters
          </Text>
        </div>

        {renderPatientSummary()}

        <Row gutter={[16, 16]}>
          {(predictionType === 'POR' || predictionType === 'Both') && (
            <Col xs={24} lg={12}>
              {renderPORResults()}
            </Col>
          )}
          
          {(predictionType === 'HOR' || predictionType === 'Both') && (
            <Col xs={24} lg={12}>
              {renderHORResults()}
            </Col>
          )}
        </Row>

        {renderClinicalRecommendations()}
      </Space>
    </div>
  );
};

export default PredictionResults;