import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';
import { Card } from '../UI/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { AIService } from '../../utils/aiService';

export const AIInsights = () => {
  const [transactions] = useLocalStorage('transactions', []);
  const [userProfile] = useLocalStorage('userProfile', {});
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (userProfile.aiSuggestions && transactions.length > 0) {
      generateInsights();
      generateRecommendations();
    }
  }, [transactions, userProfile]);

  const generateInsights = async () => {
    if (transactions.length < 3) return;
    
    setLoading(true);
    try {
      const prediction = await AIService.getCashFlowPrediction(transactions, userProfile);
      setInsights(prediction);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    try {
      const recs = await AIService.getBudgetRecommendations(transactions, userProfile);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: userProfile.currency || 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!userProfile.aiSuggestions) {
    return (
      <Card title="AI Insights">
        <div className="text-center py-8">
          <Brain size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI Insights Disabled</h3>
          <p className="text-gray-500">Enable AI suggestions in Settings to get personalized insights.</p>
        </div>
      </Card>
    );
  }

  if (transactions.length < 3) {
    return (
      <Card title="AI Insights">
        <div className="text-center py-8">
          <Brain size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Need More Data</h3>
          <p className="text-gray-500">Add more transactions to get AI-powered insights and recommendations.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Cash Flow Prediction */}
      <Card title="Cash Flow Prediction">
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="spinner"></div>
              <span className="ml-2 text-gray-500">Analyzing your financial data...</span>
            </div>
          ) : insights ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp size={24} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Next 30 Days Forecast</h4>
                  <p className={`text-2xl font-bold ${
                    insights.prediction >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {insights.prediction >= 0 ? '+' : ''}{formatCurrency(insights.prediction)}
                  </p>
                </div>
              </div>

              {insights.watchCategories && insights.watchCategories.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle size={18} className="text-yellow-600" />
                    <span className="font-medium text-yellow-800">Categories to Watch</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {insights.watchCategories.map((category, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-yellow-200 text-yellow-800 text-sm rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Brain size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Unable to generate prediction. Try again later.</p>
            </div>
          )}
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card title="Smart Recommendations">
        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-full flex-shrink-0">
                  <Lightbulb size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-800 font-medium">AI Suggestion</p>
                  <p className="text-sm text-purple-700 mt-1">{recommendation}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Lightbulb size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recommendations available yet. Keep tracking your expenses!</p>
            </div>
          )}

          {insights && insights.recommendation && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <Brain size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">AI Insight</p>
                  <p className="text-sm text-blue-700 mt-1">{insights.recommendation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};