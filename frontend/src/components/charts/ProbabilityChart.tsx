import React, { useMemo } from 'react';
import {
  Row,
  Col,
  Typography,
  Space,
  Card,
  Tag,
} from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from 'recharts';

import { PredictionResult } from '../../types/api';
import { useResponsive } from '../../utils/responsive';

const { Text, Title } = Typography;

interface ProbabilityChartProps {
  result: PredictionResult;
}

const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ result }) => {
  const { isMobile } = useResponsive();

  // 准备柱状图数据
  const barData = useMemo(() => [
    {
      name: '低反应风险',
      abnormal: result.por_prediction.poor_response_prob * 100,
      normal: result.por_prediction.normal_response_prob * 100,
      abnormalColor: result.por_prediction.poor_response_prob >= 0.7 ? '#ff4d4f' : 
                    result.por_prediction.poor_response_prob >= 0.3 ? '#faad14' : '#52c41a',
    },
    {
      name: '高反应风险',
      abnormal: result.hor_prediction.high_response_prob * 100,
      normal: result.hor_prediction.normal_response_prob * 100,
      abnormalColor: result.hor_prediction.high_response_prob >= 0.7 ? '#ff4d4f' : 
                    result.hor_prediction.high_response_prob >= 0.3 ? '#faad14' : '#52c41a',
    },
  ], [result]);

  // 准备饼图数据 - POR
  const porPieData = useMemo(() => [
    {
      name: '低反应风险',
      value: result.por_prediction.poor_response_prob * 100,
      color: result.por_prediction.poor_response_prob >= 0.7 ? '#ff4d4f' : 
             result.por_prediction.poor_response_prob >= 0.3 ? '#faad14' : '#52c41a',
    },
    {
      name: '正常反应',
      value: result.por_prediction.normal_response_prob * 100,
      color: '#e6f7ff',
    },
  ], [result]);

  // 准备饼图数据 - HOR
  const horPieData = useMemo(() => [
    {
      name: '高反应风险',
      value: result.hor_prediction.high_response_prob * 100,
      color: result.hor_prediction.high_response_prob >= 0.7 ? '#ff4d4f' : 
             result.hor_prediction.high_response_prob >= 0.3 ? '#faad14' : '#52c41a',
    },
    {
      name: '正常反应',
      value: result.hor_prediction.normal_response_prob * 100,
      color: '#e6f7ff',
    },
  ], [result]);

  // 准备径向条形图数据
  const radialData = useMemo(() => [
    {
      name: 'POR',
      value: result.por_prediction.poor_response_prob * 100,
      fill: result.por_prediction.poor_response_prob >= 0.7 ? '#ff4d4f' : 
            result.por_prediction.poor_response_prob >= 0.3 ? '#faad14' : '#52c41a',
    },
    {
      name: 'HOR',
      value: result.hor_prediction.high_response_prob * 100,
      fill: result.hor_prediction.high_response_prob >= 0.7 ? '#ff4d4f' : 
            result.hor_prediction.high_response_prob >= 0.3 ? '#faad14' : '#52c41a',
    },
  ], [result]);

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'white',
          padding: '12px',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <Text strong>{label}</Text>
          {payload.map((entry: any, index: number) => (
            <div key={index} style={{ margin: '4px 0' }}>
              <Text style={{ color: entry.color }}>
                {entry.name}: {entry.value.toFixed(1)}%
              </Text>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // 自定义饼图标签
  const renderPieLabel = ({ name, value }: any) => {
    if (value < 5) return ''; // 小于5%不显示标签
    return `${value.toFixed(1)}%`;
  };

  return (
    <div style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        {/* 对比柱状图 */}
        <Col xs={24} lg={12}>
          <Card size="small" title="风险概率对比" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  height={isMobile ? 60 : 30}
                />
                <YAxis fontSize={12} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend fontSize={12} />
                <Bar 
                  dataKey="abnormal" 
                  name="风险概率" 
                  fill="#ff7875"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="normal" 
                  name="正常概率" 
                  fill="#95de64"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 径向进度图 */}
        <Col xs={24} lg={12}>
          <Card size="small" title="风险指标雷达" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="40%" 
                outerRadius="80%" 
                data={radialData}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill="#8884d8"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  iconSize={12}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* POR饼图 */}
        <Col xs={24} lg={12}>
          <Card 
            size="small" 
            title={
              <Space>
                <span>低反应风险分布</span>
                <Tag color={result.por_prediction.poor_response_prob >= 0.7 ? 'error' : 
                           result.por_prediction.poor_response_prob >= 0.3 ? 'warning' : 'success'}>
                  {result.por_prediction.poor_response_prob >= 0.7 ? '高风险' : 
                   result.por_prediction.poor_response_prob >= 0.3 ? '中风险' : '低风险'}
                </Tag>
              </Space>
            }
            style={{ height: '300px' }}
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={porPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={renderPieLabel}
                >
                  {porPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend fontSize={12} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* HOR饼图 */}
        <Col xs={24} lg={12}>
          <Card 
            size="small" 
            title={
              <Space>
                <span>高反应风险分布</span>
                <Tag color={result.hor_prediction.high_response_prob >= 0.7 ? 'error' : 
                           result.hor_prediction.high_response_prob >= 0.3 ? 'warning' : 'success'}>
                  {result.hor_prediction.high_response_prob >= 0.7 ? '高风险' : 
                   result.hor_prediction.high_response_prob >= 0.3 ? '中风险' : '低风险'}
                </Tag>
              </Space>
            }
            style={{ height: '300px' }}
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={horPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={renderPieLabel}
                >
                  {horPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend fontSize={12} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 图表说明 */}
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#f5f5f5', 
        borderRadius: '6px' 
      }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          <strong>图表说明：</strong>
          以上图表从不同角度展示预测结果的概率分布。
          柱状图用于对比两种风险类型；
          径向图显示风险强度；
          饼图展示具体的概率分布比例。
          颜色编码：绿色表示低风险，黄色表示中等风险，红色表示高风险。
        </Text>
      </div>
    </div>
  );
};

export default ProbabilityChart; 