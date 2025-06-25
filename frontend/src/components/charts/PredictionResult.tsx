import React from 'react';
import {
  Card,
  Typography,
  Space,
  Button,
} from 'antd';
import {
  DownloadOutlined,
  PrinterOutlined,
} from '@ant-design/icons';

import { PredictionResult as PredictionResultType } from '../../types/api';

const { Text, Title } = Typography;

interface PredictionResultProps {
  result: PredictionResultType;
  onExport?: () => void;
  onPrint?: () => void;
  timestamp?: string;
}

const PredictionResult: React.FC<PredictionResultProps> = ({
  result,
  onExport,
  onPrint,
  timestamp
}) => {

  // 格式化概率为3位小数
  const formatProbability = (prob: number) => prob.toFixed(3);

  // 获取预测结果（Yes/No）
  const getPredictionResult = (porProb: number, horProb: number) => {
    const porResult = porProb > 0.5 ? 'Yes' : 'No';
    const horResult = horProb > 0.5 ? 'Yes' : 'No';
    return { porResult, horResult };
  };

  const { porResult, horResult } = getPredictionResult(
    result.por_prediction.poor_response_prob,
    result.hor_prediction.high_response_prob
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <Card>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div 
            style={{ 
              backgroundColor: '#d4eff5', 
              color: '#437A8B', 
              padding: '12px 24px', 
              borderRadius: '8px',
              marginBottom: '24px'
            }}
          >
            <Title level={3} style={{ margin: 0, color: '#437A8B' }}>
              Prediction Results of Abnormal Ovarian Response
            </Title>
          </div>
        </div>

        {/* 预测结果内容 */}
        <div style={{ marginBottom: '32px' }}>
          <Text style={{ fontSize: '18px', color: 'black', fontWeight: 'normal' }}>
            The results of POR and HOR predictions are as following:
          </Text>

          <div style={{ marginTop: '16px', marginLeft: '24px' }}>
            <ul style={{ fontSize: '18px', color: 'black', lineHeight: '1.8' }}>
              <li>
                <Text strong>Predicted POR: </Text>
                <Text style={{ color: '#437A8B', fontWeight: 'bold' }}>
                  {porResult}
                </Text>
              </li>
              <li>
                <Text strong>Predicted risk of POR: </Text>
                <Text style={{ color: '#437A8B', fontWeight: 'bold' }}>
                  No ({formatProbability(result.por_prediction.normal_response_prob)}), Yes ({formatProbability(result.por_prediction.poor_response_prob)})
                </Text>
              </li>
              <li>
                <Text strong>Predicted HOR: </Text>
                <Text style={{ color: '#437A8B', fontWeight: 'bold' }}>
                  {horResult}
                </Text>
              </li>
              <li>
                <Text strong>Predicted risk of HOR: </Text>
                <Text style={{ color: '#437A8B', fontWeight: 'bold' }}>
                  No ({formatProbability(result.hor_prediction.normal_response_prob)}), Yes ({formatProbability(result.hor_prediction.high_response_prob)})
                </Text>
              </li>
            </ul>
          </div>
        </div>

        {/* 操作按钮 */}
        <div style={{ textAlign: 'center' }}>
          <Space size="large">
            {onExport && (
              <Button 
                icon={<DownloadOutlined />} 
                onClick={onExport}
                size="large"
              >
                Export Results
              </Button>
            )}
            {onPrint && (
              <Button 
                icon={<PrinterOutlined />} 
                onClick={onPrint}
                size="large"
              >
                Print Report
              </Button>
            )}
          </Space>
        </div>

        {timestamp && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Generated on: {new Date(timestamp).toLocaleString()}
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PredictionResult;