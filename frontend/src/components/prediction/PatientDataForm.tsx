import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Radio,
  Switch,
  Button,
  Row,
  Col,
  Space,
  Typography,
  Divider,
  Tooltip,
  Alert,
} from 'antd';
import {
  InfoCircleOutlined,
  ExperimentOutlined,
  UserOutlined,
  HeartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

import { PredictionFormData, PredictionType } from '../../types/prediction';

const { Title, Text } = Typography;
const { Option } = Select;

interface PatientDataFormProps {
  formData: PredictionFormData;
  onFormDataChange: (updates: Partial<PredictionFormData>) => void;
  predictionType: PredictionType;
  onPredictionTypeChange: (type: PredictionType) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const PatientDataForm: React.FC<PatientDataFormProps> = ({
  formData,
  onFormDataChange,
  predictionType,
  onPredictionTypeChange,
  onSubmit,
  isLoading,
}) => {
  const [useExample, setUseExample] = useState(false);
  const [form] = Form.useForm();

  // Example data from the Shiny app
  const exampleData: PredictionFormData = {
    Age: 32,
    Duration: 6,
    Weight: 58,
    FSH: 7.2,
    LH: 4.8,
    AMH: 2.1,
    AFC: 12,
    POIorDOR: false, // No
    DBP: 78,
    WBC: 6.2,
    RBC: 4.4,
    ALT: 22,
    P: 1.1,
    PLT: 280,
    PCOS: false, // No
  };

  const handleExampleToggle = (checked: boolean) => {
    setUseExample(checked);
    if (checked) {
      onFormDataChange(exampleData);
      form.setFieldsValue(exampleData);
    } else {
      // Reset to empty form
      const emptyData = Object.keys(exampleData).reduce(
        (acc, key) => ({
          ...acc,
          [key]: key === 'POIorDOR' || key === 'PCOS' ? false : undefined,
        }),
        {} as Partial<PredictionFormData>
      );
      onFormDataChange(emptyData);
      form.resetFields();
    }
  };

  const handleFieldChange = (field: keyof PredictionFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const handleFormSubmit = () => {
    form.validateFields().then(() => {
      onSubmit();
    });
  };

  const shouldShowField = (field: string): boolean => {
    switch (field) {
      case 'DBP':
      case 'WBC':
      case 'RBC':
      case 'ALT':
      case 'P':
        return predictionType === 'POR' || predictionType === 'Both';
      case 'PLT':
      case 'PCOS':
        return predictionType === 'HOR' || predictionType === 'Both';
      default:
        return true;
    }
  };

  const getFieldValidation = (field: string) => {
    const validationRules: Record<string, any[]> = {
      Age: [
        { required: true, message: 'Age is required' },
        { type: 'number', min: 18, max: 50, message: 'Age must be between 18-50 years' },
      ],
      Duration: [
        { required: true, message: 'Duration is required' },
        { type: 'number', min: 0, max: 60, message: 'Duration must be between 0-60 months' },
      ],
      Weight: [
        { required: true, message: 'Weight is required' },
        { type: 'number', min: 30, max: 150, message: 'Weight must be between 30-150 kg' },
      ],
      FSH: [
        { required: true, message: 'FSH is required' },
        { type: 'number', min: 0, max: 50, message: 'FSH must be between 0-50 IU/L' },
      ],
      LH: [
        { required: true, message: 'LH is required' },
        { type: 'number', min: 0, max: 50, message: 'LH must be between 0-50 IU/L' },
      ],
      AMH: [
        { required: true, message: 'AMH is required' },
        { type: 'number', min: 0, max: 20, message: 'AMH must be between 0-20 ng/mL' },
      ],
      AFC: [
        { required: true, message: 'AFC is required' },
        { type: 'number', min: 0, max: 50, message: 'AFC must be between 0-50' },
      ],
      DBP: [
        { required: shouldShowField('DBP'), message: 'DBP is required for POR prediction' },
        { type: 'number', min: 40, max: 120, message: 'DBP must be between 40-120 mmHg' },
      ],
      WBC: [
        { required: shouldShowField('WBC'), message: 'WBC is required for POR prediction' },
        { type: 'number', min: 2, max: 20, message: 'WBC must be between 2-20 ×10⁹/L' },
      ],
      RBC: [
        { required: shouldShowField('RBC'), message: 'RBC is required for POR prediction' },
        { type: 'number', min: 3, max: 7, message: 'RBC must be between 3-7 ×10¹²/L' },
      ],
      ALT: [
        { required: shouldShowField('ALT'), message: 'ALT is required for POR prediction' },
        { type: 'number', min: 5, max: 200, message: 'ALT must be between 5-200 IU/L' },
      ],
      P: [
        { required: shouldShowField('P'), message: 'Progesterone is required for POR prediction' },
        { type: 'number', min: 0.5, max: 5, message: 'Progesterone must be between 0.5-5 ng/mL' },
      ],
      PLT: [
        { required: shouldShowField('PLT'), message: 'Platelet count is required for HOR prediction' },
        { type: 'number', min: 100, max: 800, message: 'Platelet count must be between 100-800 ×10⁹/L' },
      ],
    };

    return validationRules[field] || [];
  };

  return (
    <div className="patient-data-form">
      {/* Prediction Type Selection */}
      <Card className="prediction-type-card" size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ExperimentOutlined style={{ color: '#437A8B' }} />
            <Title level={4} style={{ margin: 0 }}>
              Prediction Type
            </Title>
          </div>
          <Radio.Group
            value={predictionType}
            onChange={(e) => onPredictionTypeChange(e.target.value)}
            size="large"
          >
            <Space direction="horizontal" size="large">
              <Radio.Button value="POR">POR Only</Radio.Button>
              <Radio.Button value="HOR">HOR Only</Radio.Button>
              <Radio.Button value="Both">Both POR & HOR</Radio.Button>
            </Space>
          </Radio.Group>
          <Text type="secondary">
            Select the type of ovarian response prediction you want to perform
          </Text>
        </Space>
      </Card>

      {/* Try Example Toggle */}
      <Card className="example-card" size="small">
        <Space align="center">
          <FileTextOutlined style={{ color: '#52c41a' }} />
          <Text strong>Try Example Data:</Text>
          <Switch
            checked={useExample}
            onChange={handleExampleToggle}
            checkedChildren="ON"
            unCheckedChildren="OFF"
          />
          <Text type="secondary">
            Toggle to auto-fill the form with sample patient data
          </Text>
        </Space>
      </Card>

      {/* Patient Information Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={formData}
        size="large"
      >
        {/* Basic Demographics */}
        <Card 
          title={
            <Space>
              <UserOutlined />
              <span>Basic Demographics</span>
            </Space>
          }
          className="form-section"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Age (years)</span>
                    <Tooltip title="Patient age in years (18-50)">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name="Age"
                rules={getFieldValidation('Age')}
              >
                <Input
                  type="number"
                  placeholder="e.g., 32"
                  value={formData.Age}
                  onChange={(e) => handleFieldChange('Age', Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Duration of Infertility (months)</span>
                    <Tooltip title="Duration of infertility in months">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name="Duration"
                rules={getFieldValidation('Duration')}
              >
                <Input
                  type="number"
                  placeholder="e.g., 6"
                  value={formData.Duration}
                  onChange={(e) => handleFieldChange('Duration', Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Weight (kg)</span>
                    <Tooltip title="Patient weight in kilograms">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name="Weight"
                rules={getFieldValidation('Weight')}
              >
                <Input
                  type="number"
                  placeholder="e.g., 58"
                  value={formData.Weight}
                  onChange={(e) => handleFieldChange('Weight', Number(e.target.value))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Hormonal Parameters */}
        <Card 
          title={
            <Space>
              <HeartOutlined />
              <span>Hormonal Parameters</span>
            </Space>
          }
          className="form-section"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Basal FSH (IU/L)</span>
                    <Tooltip title="Basal Follicle Stimulating Hormone level">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name="FSH"
                rules={getFieldValidation('FSH')}
              >
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 7.2"
                  value={formData.FSH}
                  onChange={(e) => handleFieldChange('FSH', Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Basal LH (IU/L)</span>
                    <Tooltip title="Basal Luteinizing Hormone level">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name="LH"
                rules={getFieldValidation('LH')}
              >
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 4.8"
                  value={formData.LH}
                  onChange={(e) => handleFieldChange('LH', Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={
                  <Space>
                    <span>AMH (ng/mL)</span>
                    <Tooltip title="Anti-Müllerian Hormone level">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name="AMH"
                rules={getFieldValidation('AMH')}
              >
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 2.1"
                  value={formData.AMH}
                  onChange={(e) => handleFieldChange('AMH', Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={
                  <Space>
                    <span>Basal AFC</span>
                    <Tooltip title="Basal Antral Follicle Count">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name="AFC"
                rules={getFieldValidation('AFC')}
              >
                <Input
                  type="number"
                  placeholder="e.g., 12"
                  value={formData.AFC}
                  onChange={(e) => handleFieldChange('AFC', Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            
            {shouldShowField('P') && (
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label={
                    <Space>
                      <span>Basal Progesterone (ng/mL)</span>
                      <Tooltip title="Basal Progesterone level">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Space>
                  }
                  name="P"
                  rules={getFieldValidation('P')}
                >
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 1.1"
                    value={formData.P}
                    onChange={(e) => handleFieldChange('P', Number(e.target.value))}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Card>

        {/* Clinical Conditions */}
        <Card 
          title={
            <Space>
              <FileTextOutlined />
              <span>Clinical Conditions</span>
            </Space>
          }
          className="form-section"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <Space>
                    <span>POI or DOR</span>
                    <Tooltip title="Primary Ovarian Insufficiency or Diminished Ovarian Reserve">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name="POIorDOR"
              >
                <Radio.Group
                  value={formData.POIorDOR}
                  onChange={(e) => handleFieldChange('POIorDOR', e.target.value)}
                >
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            
            {shouldShowField('PCOS') && (
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>PCOS Diagnosis</span>
                      <Tooltip title="Polycystic Ovary Syndrome diagnosis">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Space>
                  }
                  name="PCOS"
                >
                  <Radio.Group
                    value={formData.PCOS}
                    onChange={(e) => handleFieldChange('PCOS', e.target.value)}
                  >
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            )}
          </Row>
        </Card>

        {/* Laboratory Parameters (conditional) */}
        {(shouldShowField('DBP') || shouldShowField('PLT')) && (
          <Card 
            title={
              <Space>
                <HeartOutlined />
                <span>Laboratory Parameters</span>
              </Space>
            }
            className="form-section"
          >
            <Row gutter={[16, 16]}>
              {shouldShowField('DBP') && (
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <span>Diastolic BP (mmHg)</span>
                        <Tooltip title="Diastolic Blood Pressure">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
                    name="DBP"
                    rules={getFieldValidation('DBP')}
                  >
                    <Input
                      type="number"
                      placeholder="e.g., 78"
                      value={formData.DBP}
                      onChange={(e) => handleFieldChange('DBP', Number(e.target.value))}
                    />
                  </Form.Item>
                </Col>
              )}
              
              {shouldShowField('WBC') && (
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <span>WBC (×10⁹/L)</span>
                        <Tooltip title="White Blood Cell count">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
                    name="WBC"
                    rules={getFieldValidation('WBC')}
                  >
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 6.2"
                      value={formData.WBC}
                      onChange={(e) => handleFieldChange('WBC', Number(e.target.value))}
                    />
                  </Form.Item>
                </Col>
              )}
              
              {shouldShowField('RBC') && (
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <span>RBC (×10¹²/L)</span>
                        <Tooltip title="Red Blood Cell count">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
                    name="RBC"
                    rules={getFieldValidation('RBC')}
                  >
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 4.4"
                      value={formData.RBC}
                      onChange={(e) => handleFieldChange('RBC', Number(e.target.value))}
                    />
                  </Form.Item>
                </Col>
              )}
              
              {shouldShowField('ALT') && (
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <span>ALT (IU/L)</span>
                        <Tooltip title="Alanine Aminotransferase">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
                    name="ALT"
                    rules={getFieldValidation('ALT')}
                  >
                    <Input
                      type="number"
                      placeholder="e.g., 22"
                      value={formData.ALT}
                      onChange={(e) => handleFieldChange('ALT', Number(e.target.value))}
                    />
                  </Form.Item>
                </Col>
              )}
              
              {shouldShowField('PLT') && (
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label={
                      <Space>
                        <span>Platelet Count (×10⁹/L)</span>
                        <Tooltip title="Platelet count">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
                    name="PLT"
                    rules={getFieldValidation('PLT')}
                  >
                    <Input
                      type="number"
                      placeholder="e.g., 280"
                      value={formData.PLT}
                      onChange={(e) => handleFieldChange('PLT', Number(e.target.value))}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Card>
        )}

        {/* Information Alert */}
        <Alert
          message="Clinical Information"
          description={
            <div>
              <p><strong>POR (Poor Ovarian Response):</strong> Requires basic demographics, hormonal parameters, clinical conditions, and additional laboratory parameters.</p>
              <p><strong>HOR (High Ovarian Response):</strong> Requires basic demographics, hormonal parameters, clinical conditions, and platelet count.</p>
              <p><strong>Both:</strong> Requires all parameters for comprehensive analysis.</p>
            </div>
          }
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Form>
    </div>
  );
};

export default PatientDataForm;