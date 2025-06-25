import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Steps, 
  Space, 
  Typography,
  Alert,
  message,
  Tabs,
  Button
} from 'antd';
import { useResponsive, getResponsiveGutter } from '@/utils/responsive';
import PredictionForm from '@/components/forms/PredictionForm';
import { PredictionResult, PredictionHistory } from '../components/charts';
import { usePrediction } from '../hooks/usePrediction';
import { PredictionFormData } from '@/types/prediction';
import { 
  FormOutlined, 
  CalculatorOutlined, 
  FileTextOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface PredictionPageProps {
  // 将来添加props
}

const PredictionPage: React.FC<PredictionPageProps> = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('predict');
  const { isMobile } = useResponsive();
  
  // 使用预测状态管理Hook
  const {
    formData,
    updateFormData,
    isPredicting,
    predictionResult,
    error,
    hasResult,
    isApiHealthy,
    predictionHistory,
    submitPrediction,
    checkHealth,
    clearResults,
    loadHistoryData,
    clearHistory,
    removeFromHistory,
    exportFormData,
  } = usePrediction();

  // 处理表单提交
  const handleFormSubmit = async (data: PredictionFormData) => {
    updateFormData(data);
    setCurrentStep(1);
    
    try {
      await submitPrediction();
      if (predictionResult && !error) {
      setCurrentStep(2);
        setActiveTab('result'); // 自动切换到结果页签
      }
    } catch (error) {
      setCurrentStep(0);
    }
  };

  // 重新开始预测
  const handleRestart = () => {
    setCurrentStep(0);
    setActiveTab('predict');
    clearResults();
  };

  // 监听预测状态变化
  useEffect(() => {
    if (isPredicting) {
      setCurrentStep(1);
    } else if (hasResult) {
      setCurrentStep(2);
    }
  }, [isPredicting, hasResult]);

  const steps = [
    {
      title: '输入参数',
      description: '填写患者临床指标',
      icon: <FormOutlined />,
    },
    {
      title: '预测分析',
      description: 'AI模型计算预测结果',
      icon: <CalculatorOutlined />,
    },
    {
      title: '结果报告',
      description: '查看预测结果和建议',
      icon: <FileTextOutlined />,
    },
  ];

  return (
    <div style={{ padding: '0' }}>
      {/* 页面标题和说明 */}
      <Card 
        style={{ 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
          border: 'none'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <Row align="middle" gutter={[24, 16]}>
          <Col flex="1">
            <Space direction="vertical" size="small">
              <Title 
                level={2} 
                style={{ 
                  color: '#fff', 
                  margin: 0,
                  fontWeight: 700 
                }}
              >
                卵巢反应预测分析
              </Title>
              <Text 
                style={{ 
                  color: 'rgba(255,255,255,0.85)', 
                  fontSize: '16px' 
                }}
              >
                基于机器学习算法，预测患者在辅助生殖治疗中的卵巢反应情况
              </Text>
            </Space>
          </Col>
          <Col>
            <PlayCircleOutlined 
              style={{ 
                fontSize: '64px', 
                color: 'rgba(255,255,255,0.8)' 
              }} 
            />
          </Col>
        </Row>
      </Card>

      {/* 进度步骤 */}
      <Card style={{ marginBottom: '24px' }}>
        <Steps 
          current={currentStep} 
          items={steps}
          style={{ marginBottom: '16px' }}
        />
        
        <Alert
          message={
            currentStep === 0 ? "请仔细填写所有必需的临床参数" :
            currentStep === 1 ? "正在使用AI模型进行预测分析..." :
            "预测完成，请查看结果和临床建议"
          }
          type={
            currentStep === 1 ? "info" : 
            currentStep === 2 ? "success" : 
            error ? "error" : "info"
          }
          showIcon
          style={{ marginTop: '16px' }}
          action={
            currentStep === 2 && (
              <Button size="small" icon={<ReloadOutlined />} onClick={handleRestart}>
                重新预测
              </Button>
            )
          }
        />
      </Card>

      {/* 主要内容区域 */}
      <Row gutter={getResponsiveGutter()}>
        {/* 左侧：输入表单区域 */}
        <Col xs={24} lg={12} order={isMobile ? 2 : 1}>
          <Card
            title={
              <Space>
                <FormOutlined style={{ color: '#1890ff' }} />
                <span>临床参数输入</span>
                {!isApiHealthy && (
                  <Alert
                    message="API服务连接异常"
                    type="warning"
                    size="small"
                    style={{ margin: 0 }}
                  />
                )}
              </Space>
            }
            extra={
              <Text type="secondary" style={{ fontSize: '12px' }}>
                步骤 1/3
              </Text>
            }
            style={{ height: '100%' }}
            bodyStyle={{ minHeight: '600px' }}
          >
            <PredictionForm
              onSubmit={handleFormSubmit}
              loading={isPredicting}
              initialValues={formData}
            />
          </Card>
        </Col>

        {/* 右侧：结果展示区域 */}
        <Col xs={24} lg={12} order={isMobile ? 1 : 2}>
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: '#52c41a' }} />
                <span>预测结果与历史</span>
              </Space>
            }
            extra={
              <Text type="secondary" style={{ fontSize: '12px' }}>
                步骤 3/3
              </Text>
            }
            style={{ height: '100%' }}
            bodyStyle={{ minHeight: '600px', padding: '0' }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              size="small"
              style={{ height: '100%' }}
              items={[
                {
                  key: 'result',
                  label: (
                    <Space>
                      <FileTextOutlined />
                      <span>预测结果</span>
                    </Space>
                  ),
                  children: (
                    <div style={{ padding: '16px', height: '540px', overflow: 'auto' }}>
                      {hasResult && predictionResult ? (
                        <PredictionResult
                          result={predictionResult}
                          onExport={exportFormData}
                          onPrint={() => window.print()}
                          timestamp={new Date().toISOString()}
                        />
                      ) : isPredicting ? (
                        <div style={{ 
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          textAlign: 'center'
                        }}>
                          <CalculatorOutlined 
                            style={{ 
                              fontSize: '64px', 
                              color: '#1890ff',
                              marginBottom: '16px',
                              animation: 'spin 2s linear infinite'
                            }} 
                          />
                          <Title level={4}>正在预测分析...</Title>
                          <Text type="secondary">请稍等，AI模型正在处理您的数据</Text>
                        </div>
                      ) : (
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center'
            }}>
              <CheckCircleOutlined 
                style={{ 
                  fontSize: '64px', 
                  color: '#d9d9d9',
                  marginBottom: '16px'
                }} 
              />
                          <Title level={4} type="secondary">等待预测结果</Title>
              <Text type="secondary">
                请先完成左侧的参数输入，然后点击"开始预测"按钮
              </Text>
                  </div>
                      )}
                  </div>
                  ),
                },
                {
                  key: 'history',
                  label: (
                    <Space>
                      <HistoryOutlined />
                      <span>历史记录</span>
                      {predictionHistory.length > 0 && (
                        <span style={{ 
                          background: '#1890ff', 
                          color: 'white', 
                          padding: '0 4px', 
                          borderRadius: '8px', 
                          fontSize: '10px' 
                        }}>
                          {predictionHistory.length}
                        </span>
                      )}
                </Space>
                  ),
                  children: (
                    <div style={{ padding: '16px', height: '540px', overflow: 'auto' }}>
                      <PredictionHistory
                        history={predictionHistory}
                        onLoadData={loadHistoryData}
                        onDeleteItem={removeFromHistory}
                        onClearHistory={clearHistory}
                        onExportHistory={() => {
                          // 导出历史记录功能
                          const blob = new Blob([JSON.stringify(predictionHistory, null, 2)], {
                            type: 'application/json',
                          });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `prediction-history-${new Date().toISOString().split('T')[0]}.json`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          URL.revokeObjectURL(url);
                          message.success('历史记录已导出');
                        }}
                      />
              </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PredictionPage; 