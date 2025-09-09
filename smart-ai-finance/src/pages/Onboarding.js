import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const Onboarding = () => {
  const navigate = useNavigate();
  const [, setUserProfile] = useLocalStorage('userProfile', null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    incomeSource: '',
    currency: 'USD',
    trackingFrequency: 'Weekly',
    monthlyIncomeGoal: '',
    monthlyExpenseLimit: '',
    aiSuggestions: true
  });

  const steps = [
    {
      title: 'Welcome! Let\'s get to know you',
      fields: [
        {
          name: 'name',
          label: 'What\'s your name or business name?',
          type: 'text',
          placeholder: 'Enter your name'
        }
      ]
    },
    {
      title: 'Tell us about your income',
      fields: [
        {
          name: 'incomeSource',
          label: 'What\'s your primary income source?',
          type: 'select',
          options: ['Freelancing', 'Small Business', 'Employee']
        }
      ]
    },
    {
      title: 'Choose your preferences',
      fields: [
        {
          name: 'currency',
          label: 'What\'s your preferred currency?',
          type: 'select',
          options: ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD']
        },
        {
          name: 'trackingFrequency',
          label: 'How often do you want to track income/expenses?',
          type: 'select',
          options: ['Daily', 'Weekly', 'Monthly']
        }
      ]
    },
    {
      title: 'Set your financial goals',
      fields: [
        {
          name: 'monthlyIncomeGoal',
          label: 'What\'s your monthly income goal?',
          type: 'number',
          placeholder: '5000'
        },
        {
          name: 'monthlyExpenseLimit',
          label: 'What\'s your monthly expense limit?',
          type: 'number',
          placeholder: '3000'
        }
      ]
    },
    {
      title: 'AI-powered suggestions',
      fields: [
        {
          name: 'aiSuggestions',
          label: 'Would you like to receive AI-powered suggestions?',
          type: 'toggle',
          description: 'Get personalized insights and recommendations based on your spending patterns'
        }
      ]
    }
  ];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const profileData = {
      ...formData,
      monthlyIncomeGoal: parseFloat(formData.monthlyIncomeGoal) || 0,
      monthlyExpenseLimit: parseFloat(formData.monthlyExpenseLimit) || 0,
      createdAt: new Date().toISOString()
    };
    
    setUserProfile(profileData);
    navigate('/dashboard');
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <input
            type={field.type}
            className="form-input"
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required
          />
        );
      
      case 'select':
        return (
          <select
            className="form-select"
            value={formData[field.name]}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required
          >
            <option value="">Select an option...</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'toggle':
        return (
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData[field.name]}
                onChange={(e) => handleInputChange(field.name, e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Yes, enable AI suggestions</span>
            </label>
            {field.description && (
              <p className="text-sm text-gray-500 mt-2">{field.description}</p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const isStepValid = () => {
    return currentStepData.fields.every(field => {
      if (field.type === 'toggle') return true;
      return formData[field.name] && formData[field.name].toString().trim() !== '';
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">{progress.toFixed(0)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {currentStepData.title}
          </h2>
          
          <div className="space-y-6">
            {currentStepData.fields.map((field, index) => (
              <div key={index}>
                <label className="form-label">
                  {field.label}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={currentStep === 0 ? 'invisible' : ''}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleComplete}
              disabled={!isStepValid()}
            >
              Complete Setup
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Next
              <ArrowRight size={18} className="ml-2" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};