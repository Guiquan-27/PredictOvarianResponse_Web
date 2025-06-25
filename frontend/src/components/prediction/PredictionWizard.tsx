import React, { useState, useEffect } from 'react';
import { Card, Steps, Button, Space, Alert, Spin } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, ReloadOutlined } from '@ant-design/icons';

import PatientDataForm from './PatientDataForm';
import PredictionResults from './PredictionResults';
import StrategyAnalysis from './StrategyAnalysis';
import { usePredictionStore } from '../../stores/predictionStore';
import { PredictionService } from '../../services/predictionService';
import { PredictionFormData } from '../../types/prediction';

const { Step } = Steps;

interface PredictionWizardState {
  currentStep: number;
  predictionResult: any;
  isLoading: boolean;
  error: string | null;
  showStrategy: boolean;
}

const PredictionWizard: React.FC = () => {
  const [state, setState] = useState<PredictionWizardState>({
    currentStep: 0,
    predictionResult: null,
    isLoading: false,
    error: null,
    showStrategy: false,
  });

  const {
    formData,
    updateFormData,
    resetForm,
    validateForm,
    predictionType,
    setPredictionType,
  } = usePredictionStore();

  const steps = [
    {
      title: 'Patient Data',
      description: 'Enter clinical parameters',
      icon: '1',
    },
    {
      title: 'Prediction Results',
      description: 'Review AI predictions',
      icon: '2',
    },
    {
      title: 'Strategy Analysis',
      description: 'Treatment recommendations',
      icon: '3',
    },
  ];

  const handleSubmitPrediction = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Validate form data
      if (!validateForm()) {
        throw new Error('Please fill in all required fields');
      }

      // Make prediction request
      const result = await PredictionService.predict(formData);
      
      setState(prev => ({
        ...prev,
        predictionResult: result,
        currentStep: 1,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: (error as Error).message,
        isLoading: false,
      }));
    }
  };

  const handleNext = () => {
    if (state.currentStep === 0) {
      handleSubmitPrediction();
    } else if (state.currentStep === 1) {
      setState(prev => ({ ...prev, currentStep: 2, showStrategy: true }));
    }
  };

  const handleBack = () => {
    if (state.currentStep > 0) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const handleReset = () => {
    setState({
      currentStep: 0,
      predictionResult: null,
      isLoading: false,
      error: null,
      showStrategy: false,
    });
    resetForm();
  };

  const renderStepContent = () => {
    switch (state.currentStep) {
      case 0:
        return (
          <PatientDataForm
            formData={formData}
            onFormDataChange={updateFormData}
            predictionType={predictionType}
            onPredictionTypeChange={setPredictionType}
            onSubmit={handleSubmitPrediction}
            isLoading={state.isLoading}
          />
        );
      case 1:
        return (
          <PredictionResults
            result={state.predictionResult}
            predictionType={predictionType}
            patientData={formData}
          />
        );
      case 2:
        return (
          <StrategyAnalysis
            predictionResult={state.predictionResult}
            patientData={formData}
            predictionType={predictionType}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    if (state.currentStep === 0) {
      return validateForm() && !state.isLoading;
    }
    return true;
  };

  return (
    <div className="prediction-wizard">
      <Card className="wizard-card">
        <div className="wizard-header">
          <Steps
            current={state.currentStep}
            size="default"
            style={{ marginBottom: 32 }}
          >
            {steps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                description={step.description}
              />
            ))}
          </Steps>

          {state.error && (
            <Alert
              message="Prediction Error"
              description={state.error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 24 }}
              onClose={() => setState(prev => ({ ...prev, error: null }))}
            />
          )}
        </div>

        <div className="wizard-content">
          <Spin spinning={state.isLoading} tip="Processing prediction...">
            {renderStepContent()}
          </Spin>
        </div>

        <div className="wizard-footer">
          <Space size="middle">
            {state.currentStep > 0 && (
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                disabled={state.isLoading}
              >
                Back
              </Button>
            )}

            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
              disabled={state.isLoading}
            >
              Reset
            </Button>

            {state.currentStep < 2 && (
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={handleNext}
                disabled={!canProceed()}
                loading={state.isLoading}
              >
                {state.currentStep === 0 ? 'Predict' : 'Analyze Strategies'}
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default PredictionWizard;