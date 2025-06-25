import React, { useState } from 'react';
import {
  Card,
  Radio,
  Select,
  Button,
  Table,
  Space,
  Typography,
  Alert,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Tooltip,
} from 'antd';
import {
  DownloadOutlined,
  SettingOutlined,
  ScanOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

import { PredictionFormData, PredictionType } from '../../types/prediction';

const { Title, Text } = Typography;
const { Option } = Select;

interface StrategyAnalysisProps {
  predictionResult: any;
  patientData: PredictionFormData;
  predictionType: PredictionType;
}

interface TreatmentStrategy {
  id: string;
  protocol: string;
  fshDose: string;
  rfsh: string;
  lh: string;
  porAvoidance: number;
  horAvoidance: number;
  overallScore: number;
  recommendation: string;
}

const StrategyAnalysis: React.FC<StrategyAnalysisProps> = ({
  predictionResult,
  patientData,
  predictionType,
}) => {
  const [analysisMode, setAnalysisMode] = useState<'full' | 'specific'>('full');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('');
  const [selectedFSHDose, setSelectedFSHDose] = useState<string>('');
  const [selectedRFSH, setSelectedRFSH] = useState<string>('');
  const [selectedLH, setSelectedLH] = useState<string>('');
  const [strategies, setStrategies] = useState<TreatmentStrategy[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const protocolOptions = [
    { value: 'long', label: 'Long Protocol' },
    { value: 'ultra-long', label: 'Ultra-long Protocol' },
    { value: 'short', label: 'Short Protocol' },
    { value: 'antagonist', label: 'Antagonist Protocol' },
    { value: 'mild-natural', label: 'Mild/Natural Protocol' },
    { value: 'ppos', label: 'PPOS Protocol' },
    { value: 'other', label: 'Other' },
  ];

  const fshDoseOptions = [
    { value: '≤100', label: '≤100 IU' },
    { value: '150', label: '150 IU' },
    { value: '200', label: '200 IU' },
    { value: '225', label: '225 IU' },
    { value: '≥300', label: '≥300 IU' },
    { value: 'none', label: 'None' },
  ];

  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'none', label: 'None' },
  ];

  // Simulate comprehensive strategy analysis (in real app, this would call the backend)
  const generateStrategies = (): TreatmentStrategy[] => {
    const strategies: TreatmentStrategy[] = [];
    
    // Generate combinations based on patient characteristics
    const porRisk = predictionResult?.por_prediction?.poor_response_prob || 0;
    const horRisk = predictionResult?.hor_prediction?.high_response_prob || 0;
    
    // Strategy 1: Conservative approach for high HOR risk
    if (horRisk > 0.5) {
      strategies.push({
        id: '1',
        protocol: 'Antagonist Protocol',
        fshDose: '150 IU',
        rfsh: 'Yes',
        lh: 'No',
        porAvoidance: 0.85,
        horAvoidance: 0.92,
        overallScore: 0.88,
        recommendation: 'Recommended for OHSS prevention',
      });
    }
    
    // Strategy 2: Aggressive approach for high POR risk
    if (porRisk > 0.5) {
      strategies.push({
        id: '2',
        protocol: 'Short Protocol',
        fshDose: '225 IU',
        rfsh: 'Yes',
        lh: 'Yes',
        porAvoidance: 0.78,
        horAvoidance: 0.65,
        overallScore: 0.72,
        recommendation: 'Recommended for poor responders',
      });
    }
    
    // Strategy 3: Balanced approach
    strategies.push({
      id: '3',
      protocol: 'Long Protocol',
      fshDose: '200 IU',
      rfsh: 'Yes',
      lh: 'No',
      porAvoidance: 0.82,
      horAvoidance: 0.88,
      overallScore: 0.85,
      recommendation: 'Balanced standard approach',
    });
    
    // Strategy 4: PCOS-specific (if applicable)
    if (patientData.PCOS) {
      strategies.push({
        id: '4',
        protocol: 'PPOS Protocol',
        fshDose: '150 IU',
        rfsh: 'Yes',
        lh: 'No',
        porAvoidance: 0.80,
        horAvoidance: 0.95,
        overallScore: 0.88,
        recommendation: 'Optimized for PCOS patients',
      });
    }
    
    // Strategy 5: Mild stimulation for older patients
    if (patientData.Age && patientData.Age > 38) {
      strategies.push({
        id: '5',
        protocol: 'Mild/Natural Protocol',
        fshDose: '≤100 IU',
        rfsh: 'No',
        lh: 'Yes',
        porAvoidance: 0.70,
        horAvoidance: 0.98,
        overallScore: 0.84,
        recommendation: 'Gentle approach for advanced age',
      });
    }
    
    return strategies.sort((a, b) => b.overallScore - a.overallScore);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (analysisMode === 'full') {
      // Generate comprehensive analysis
      const allStrategies = generateStrategies();
      setStrategies(allStrategies);
    } else {
      // Generate specific strategy analysis
      const specificStrategy: TreatmentStrategy = {
        id: 'specific',
        protocol: selectedProtocol,
        fshDose: selectedFSHDose,
        rfsh: selectedRFSH,
        lh: selectedLH,
        porAvoidance: Math.random() * 0.3 + 0.7, // Random between 0.7-1.0
        horAvoidance: Math.random() * 0.3 + 0.7,
        overallScore: Math.random() * 0.3 + 0.7,
        recommendation: 'Custom strategy analysis',
      };
      setStrategies([specificStrategy]);
    }
    
    setIsAnalyzing(false);
  };

  const handleDownloadStrategies = (type: 'por' | 'hor' | 'combined') => {
    const filename = `Top_10_Suggested_Ovarian_Stimulation_Strategies_${type.toUpperCase()}.csv`;
    
    // Create CSV content
    const headers = ['Protocol', 'FSH Dose', 'rFSH', 'LH', 'POR Avoidance', 'HOR Avoidance', 'Overall Score', 'Recommendation'];
    const csvContent = [
      headers.join(','),
      ...strategies.map(strategy => [
        strategy.protocol,
        strategy.fshDose,
        strategy.rfsh,
        strategy.lh,
        (strategy.porAvoidance * 100).toFixed(1) + '%',
        (strategy.horAvoidance * 100).toFixed(1) + '%',
        (strategy.overallScore * 100).toFixed(1) + '%',
        `"${strategy.recommendation}"`,
      ].join(','))
    ].join('\n');
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const columns = [
    {
      title: 'Protocol',
      dataIndex: 'protocol',
      key: 'protocol',
      width: 150,
    },
    {
      title: 'FSH Dose',
      dataIndex: 'fshDose',
      key: 'fshDose',
      width: 100,
    },
    {
      title: 'rFSH',
      dataIndex: 'rfsh',
      key: 'rfsh',
      width: 80,
    },
    {
      title: 'LH',
      dataIndex: 'lh',
      key: 'lh',
      width: 80,
    },
    {
      title: 'POR Avoidance',
      dataIndex: 'porAvoidance',
      key: 'porAvoidance',
      width: 120,
      render: (value: number) => (
        <Space>
          <Progress
            type="circle"
            size={40}
            percent={value * 100}
            format={percent => `${percent?.toFixed(0)}%`}
            strokeColor={value > 0.8 ? '#52c41a' : value > 0.6 ? '#faad14' : '#ff4d4f'}
          />
        </Space>
      ),
    },
    {
      title: 'HOR Avoidance',
      dataIndex: 'horAvoidance',
      key: 'horAvoidance',
      width: 120,
      render: (value: number) => (
        <Space>
          <Progress
            type="circle"
            size={40}
            percent={value * 100}
            format={percent => `${percent?.toFixed(0)}%`}
            strokeColor={value > 0.8 ? '#52c41a' : value > 0.6 ? '#faad14' : '#ff4d4f'}
          />
        </Space>
      ),
    },
    {
      title: 'Overall Score',
      dataIndex: 'overallScore',
      key: 'overallScore',
      width: 120,
      render: (value: number) => (
        <Statistic
          value={value * 100}
          precision={1}
          suffix="%"
          valueStyle={{ 
            fontSize: 14,
            color: value > 0.8 ? '#52c41a' : value > 0.6 ? '#faad14' : '#ff4d4f'
          }}
        />
      ),
      sorter: (a: TreatmentStrategy, b: TreatmentStrategy) => a.overallScore - b.overallScore,
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Recommendation',
      dataIndex: 'recommendation',
      key: 'recommendation',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <Tag color="blue">{text}</Tag>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="strategy-analysis">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="analysis-header">
          <Title level={3} style={{ color: '#437A8B', marginBottom: 8 }}>
            <SettingOutlined style={{ marginRight: 8 }} />
            Treatment Strategy Analysis
          </Title>
          <Text type="secondary">
            AI-powered analysis of ovarian stimulation strategies based on prediction results
          </Text>
        </div>

        {/* Analysis Mode Selection */}
        <Card title="Analysis Configuration" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>Analysis Mode:</Text>
              <Radio.Group 
                value={analysisMode} 
                onChange={(e) => setAnalysisMode(e.target.value)}
                style={{ marginLeft: 16 }}
              >
                <Radio value="full">
                  <Space>
                    <ScanOutlined />
                    Full Scanning (All 83 combinations)
                  </Space>
                </Radio>
                <Radio value="specific">
                  <Space>
                    <ExperimentOutlined />
                    Specific Testing (Custom strategy)
                  </Space>
                </Radio>
              </Radio.Group>
            </div>

            {analysisMode === 'specific' && (
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Select
                    placeholder="Select Protocol"
                    value={selectedProtocol}
                    onChange={setSelectedProtocol}
                    style={{ width: '100%' }}
                  >
                    {protocolOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Select
                    placeholder="FSH Dose"
                    value={selectedFSHDose}
                    onChange={setSelectedFSHDose}
                    style={{ width: '100%' }}
                  >
                    {fshDoseOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Select
                    placeholder="rFSH Usage"
                    value={selectedRFSH}
                    onChange={setSelectedRFSH}
                    style={{ width: '100%' }}
                  >
                    {yesNoOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Select
                    placeholder="LH Usage"
                    value={selectedLH}
                    onChange={setSelectedLH}
                    style={{ width: '100%' }}
                  >
                    {yesNoOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            )}

            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleAnalyze}
              loading={isAnalyzing}
              disabled={
                analysisMode === 'specific' && 
                (!selectedProtocol || !selectedFSHDose || !selectedRFSH || !selectedLH)
              }
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Strategies'}
            </Button>
          </Space>
        </Card>

        {/* Strategy Results */}
        {strategies.length > 0 && (
          <>
            <Card
              title="Recommended Treatment Strategies"
              extra={
                <Space>
                  <Button
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadStrategies('por')}
                    disabled={predictionType === 'HOR'}
                  >
                    Download POR
                  </Button>
                  <Button
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadStrategies('hor')}
                    disabled={predictionType === 'POR'}
                  >
                    Download HOR
                  </Button>
                  <Button
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadStrategies('combined')}
                    disabled={predictionType !== 'Both'}
                  >
                    Download Combined
                  </Button>
                </Space>
              }
            >
              <Table
                dataSource={strategies}
                columns={columns}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} strategies`,
                }}
                scroll={{ x: 800 }}
                size="middle"
              />
            </Card>

            <Alert
              message="Strategy Analysis Information"
              description={
                <div>
                  <p><strong>POR Avoidance:</strong> Probability of avoiding poor ovarian response with this strategy.</p>
                  <p><strong>HOR Avoidance:</strong> Probability of avoiding high ovarian response (OHSS risk) with this strategy.</p>
                  <p><strong>Overall Score:</strong> Combined effectiveness score considering both POR and HOR avoidance.</p>
                  <p><strong>Note:</strong> These recommendations are AI-generated based on statistical models and should be validated by clinical experts.</p>
                </div>
              }
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
            />
          </>
        )}
      </Space>
    </div>
  );
};

export default StrategyAnalysis;