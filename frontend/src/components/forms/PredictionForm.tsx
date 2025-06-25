import React, { useState, useCallback, useEffect } from 'react';
import {
  Form,
  InputNumber,
  Radio,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Card,
  Divider,
  Switch,
  message,
} from 'antd';

import { PredictionFormData } from '@/types/prediction';

const { Text, Title } = Typography;

interface PredictionFormProps {
  onSubmit: (data: PredictionFormData) => void;
  loading?: boolean;
  initialValues?: Partial<PredictionFormData>;
}

type PredictionType = 'POR' | 'HOR' | 'Both';

// 示例数据
const EXAMPLE_DATA = {
  Age: 38,
  Duration: 3,
  Weight: 50,
  FSH: 16,
  LH: 12,
  AMH: 0.81,
  AFC: 5,
  POIorDOR: true,
  DBP: 80,
  WBC: 6.5,
  RBC: 4.3,
  ALT: 25,
  P: 1.1,
  PLT: 220,
  PCOS: false,
};

const PredictionForm: React.FC<PredictionFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = {},
}) => {
  const [form] = Form.useForm();
  const [predictionType, setPredictionType] = useState<PredictionType>('Both');
  const [showExample, setShowExample] = useState<boolean>(false);

  // 示例数据切换
  const handleExampleToggle = useCallback((checked: boolean) => {
    setShowExample(checked);
    if (checked) {
      form.setFieldsValue(EXAMPLE_DATA);
      message.success('Example data loaded successfully');
    } else {
      form.resetFields();
      message.info('Form cleared');
    }
  }, [form]);

  // 表单提交
  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values as PredictionFormData);
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  }, [form, onSubmit]);

  // 重置表单
  const handleReset = useCallback(() => {
    form.resetFields();
    setShowExample(false);
    message.info('Form reset successfully');
  }, [form]);

  // 渲染输入字段
  const renderNumberInput = (
    name: string,
    label: string,
    unit: string,
    min?: number,
    max?: number,
    step?: number,
    precision?: number
  ) => (
    <Form.Item
      name={name}
      label={
        <Text strong style={{ fontSize: '16px', color: 'black' }}>
          {label}:
        </Text>
      }
      rules={[{ required: true, message: `Please enter ${label}` }]}
      style={{ marginBottom: '16px' }}
    >
      <Row gutter={8} align="middle">
        <Col flex="auto">
          <InputNumber
            style={{ width: '100%', fontSize: '16px' }}
            min={min}
            max={max}
            step={step}
            precision={precision}
            disabled={loading}
          />
        </Col>
        <Col>
          <Text style={{ fontSize: '16px', color: 'black' }}>{unit}</Text>
        </Col>
      </Row>
    </Form.Item>
  );

  // 渲染单选按钮
  const renderRadio = (name: string, label: string, options: { label: string; value: boolean }[]) => (
    <Form.Item
      name={name}
      label={
        <Text strong style={{ fontSize: '16px', color: 'black' }}>
          {label}:
        </Text>
      }
      rules={[{ required: true, message: `Please select ${label}` }]}
      style={{ marginBottom: '16px' }}
    >
      <Radio.Group disabled={loading}>
        {options.map(option => (
          <Radio key={option.value.toString()} value={option.value}>
            <Text style={{ fontSize: '16px' }}>{option.label}</Text>
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
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
              An ML System for Predicting Ovarian Response & Deploying Ovarian Stimulation Strategies
            </Title>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          style={{ fontSize: '16px' }}
        >
          {/* Key Features Required for Both POR and HOR Prediction */}
          <div style={{ marginBottom: '32px' }}>
            <Title level={4} style={{ textAlign: 'center', marginBottom: '24px' }}>
              Key Features Required for Both POR and HOR Prediction
            </Title>

            <Row gutter={[32, 16]}>
              <Col xs={24} sm={12} md={6}>
                {renderNumberInput('Age', 'Age of Patient', 'year old', 18, 60)}
              </Col>
              <Col xs={24} sm={12} md={6}>
                {renderNumberInput('Duration', 'Duration of infertility', 'year', 0, 30)}
              </Col>
              <Col xs={24} sm={12} md={6}>
                {renderNumberInput('Weight', 'Weight of Patient', 'kg', 30, 150)}
              </Col>
              <Col xs={24} sm={12} md={6}>
                {renderNumberInput('FSH', 'Basal follicle-stimulating hormone', 'IU/L', 0, 50, 0.1, 1)}
              </Col>
            </Row>

            <Row gutter={[32, 16]}>
              <Col xs={24} sm={12} md={6}>
                {renderNumberInput('AMH', 'AMH', 'ng/mL', 0, 20, 0.01, 2)}
              </Col>
              <Col xs={24} sm={12} md={6}>
                {renderNumberInput('LH', 'Basal luteinizing hormone', 'IU/L', 0, 50, 0.1, 1)}
              </Col>
              <Col xs={24} sm={12} md={6}>
                {renderNumberInput('AFC', 'Basal AFC', 'n', 0, 50)}
              </Col>
              <Col xs={24} sm={12} md={6}>
                {renderRadio('POIorDOR', 'POI or DOR', [
                  { label: 'Yes', value: true },
                  { label: 'No', value: false }
                ])}
              </Col>
            </Row>

            <Row gutter={[32, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="predictionType"
                  label={
                    <Text strong style={{ fontSize: '16px', color: 'black' }}>
                      Predicting POR and/or HOR:
                    </Text>
                  }
                  initialValue="Both"
                  style={{ marginBottom: '16px' }}
                >
                  <Radio.Group 
                    value={predictionType}
                    onChange={(e) => setPredictionType(e.target.value)}
                    disabled={loading}
                  >
                    <Radio value="POR">
                      <Text style={{ fontSize: '16px' }}>POR</Text>
                    </Radio>
                    <Radio value="HOR">
                      <Text style={{ fontSize: '16px' }}>HOR</Text>
                    </Radio>
                    <Radio value="Both">
                      <Text style={{ fontSize: '16px' }}>Both</Text>
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* POR-specific fields */}
          {(predictionType === 'POR' || predictionType === 'Both') && (
            <div style={{ marginBottom: '32px' }}>
              <Title level={4} style={{ textAlign: 'center', marginBottom: '24px' }}>
                Unique Key Features Required for POR Prediction
              </Title>

              <Row gutter={[32, 16]}>
                <Col xs={24} sm={12} md={6}>
                  {renderNumberInput('DBP', 'Diastolic blood pressure', 'mmHg', 40, 120)}
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="WBC"
                    label={
                      <Text strong style={{ fontSize: '16px', color: 'black' }}>
                        White blood cell count:
                      </Text>
                    }
                    rules={[{ required: true, message: 'Please enter WBC count' }]}
                    style={{ marginBottom: '16px' }}
                  >
                    <Row gutter={8} align="middle">
                      <Col flex="auto">
                        <InputNumber
                          style={{ width: '100%', fontSize: '16px' }}
                          min={2}
                          max={20}
                          step={0.1}
                          precision={1}
                          disabled={loading}
                        />
                      </Col>
                      <Col>
                        <Text style={{ fontSize: '16px', color: 'black' }}>
                          10<sup>9</sup>/L
                        </Text>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="RBC"
                    label={
                      <Text strong style={{ fontSize: '16px', color: 'black' }}>
                        Red blood cell count:
                      </Text>
                    }
                    rules={[{ required: true, message: 'Please enter RBC count' }]}
                    style={{ marginBottom: '16px' }}
                  >
                    <Row gutter={8} align="middle">
                      <Col flex="auto">
                        <InputNumber
                          style={{ width: '100%', fontSize: '16px' }}
                          min={3}
                          max={7}
                          step={0.01}
                          precision={2}
                          disabled={loading}
                        />
                      </Col>
                      <Col>
                        <Text style={{ fontSize: '16px', color: 'black' }}>
                          10<sup>12</sup>/L
                        </Text>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  {renderNumberInput('ALT', 'Alanine aminotransferase', 'IU/L', 5, 200)}
                </Col>
              </Row>

              <Row gutter={[32, 16]}>
                <Col xs={24} sm={12} md={6}>
                  {renderNumberInput('P', 'Basal progesterone', 'ng/mL', 0.5, 5, 0.01, 2)}
                </Col>
              </Row>
            </div>
          )}

          {/* HOR-specific fields */}
          {(predictionType === 'HOR' || predictionType === 'Both') && (
            <div style={{ marginBottom: '32px' }}>
              <Title level={4} style={{ textAlign: 'center', marginBottom: '24px' }}>
                Unique Key Features Required for HOR Prediction
              </Title>

              <Row gutter={[32, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="PLT"
                    label={
                      <Text strong style={{ fontSize: '16px', color: 'black' }}>
                        Platelet count:
                      </Text>
                    }
                    rules={[{ required: true, message: 'Please enter PLT count' }]}
                    style={{ marginBottom: '16px' }}
                  >
                    <Row gutter={8} align="middle">
                      <Col flex="auto">
                        <InputNumber
                          style={{ width: '100%', fontSize: '16px' }}
                          min={100}
                          max={800}
                          disabled={loading}
                        />
                      </Col>
                      <Col>
                        <Text style={{ fontSize: '16px', color: 'black' }}>
                          10<sup>9</sup>/L
                        </Text>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  {renderRadio('PCOS', 'Polycystic ovarian syndrome', [
                    { label: 'Yes', value: true },
                    { label: 'No', value: false }
                  ])}
                </Col>
              </Row>
            </div>
          )}

          {/* 解释说明 */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Text style={{ fontSize: '14px', color: '#666' }}>
              POR: Poor Ovarian Response; HOR: Hyper Ovarian Response;
            </Text>
            <br />
            <Text style={{ fontSize: '14px', color: '#666' }}>
              POI: Primary Ovarian Insuficiency; DOR: Diminished Ovarian Reserve
            </Text>
          </div>

          {/* Try Example Switch */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Space>
              <Text strong style={{ fontSize: '16px' }}>Try Example:</Text>
              <Switch
                checked={showExample}
                onChange={handleExampleToggle}
                disabled={loading}
              />
            </Space>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: 'center' }}>
            <Space size="large">
              <Button 
                size="large" 
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                loading={loading}
                style={{ 
                  backgroundColor: '#d32f2f',
                  borderColor: '#d32f2f',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  paddingLeft: '32px',
                  paddingRight: '32px'
                }}
              >
                Submit
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default PredictionForm;