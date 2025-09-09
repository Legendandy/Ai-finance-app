import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Brain, TrendingUp, AlertTriangle, Calendar, DollarSign } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculations } from '../utils/calculations';
import { AIService } from '../utils/aiService';

export const Predictions = () => {
  const [transactions] = useLocalStorage('transactions', []);
  const [userProfile] = useLocalStorage('userProfile', {});
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState(6); // months

  useEffect(() => {
    if (userProfile.aiSuggestions && Array.isArray(transactions) && transactions.length > 3) {
      generatePredictions();
    }
  }, [transactions, userProfile, timeRange]);

  const generatePredictions = async () => {
    setLoading(true);
    try {
      const prediction = await AIService.getCashFlowPrediction(transactions, userProfile);
      setPredictions(prediction);
    } catch (error) {
      console.error('Error generating predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: userProfile.currency || 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Early return if transactions is not an array or is empty
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Predictions</h1>
          <p className="text-gray-600">AI-powered cash flow forecasts and insights</p>
        </div>
        
        <Card>
          <div className="text-center py-12">
            <Calendar size={64} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-500 mb-4">Add transactions to generate predictions and forecasts.</p>
            <Button onClick={() => window.location.href = '/transactions'}>
              Add Transactions
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Generate historical data for charts
  const monthlyData = calculations.getMonthlyData(transactions, timeRange);
  
  // Generate future predictions based on historical data
  const generateFutureData = () => {
    if (monthlyData.length < 2) return [];
    
    const avgIncome = monthlyData.reduce((sum, data) => sum + data.income, 0) / monthlyData.length;
    const avgExpenses = monthlyData.reduce((sum, data) => sum + data.expenses, 0) / monthlyData.length;
    const trend = monthlyData.length > 1 ? 
      (monthlyData[monthlyData.length - 1].net - monthlyData[0].net) / monthlyData.length : 0;

    const futureData = [];
    const currentDate = new Date();
    
    for (let i = 1; i <= 3; i++) {
      const futureMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const projectedIncome = avgIncome + (trend * i * 0.5);
      const projectedExpenses = avgExpenses * (1 + (i * 0.02)); // Slight increase in expenses
      
      futureData.push({
        month: futureMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income: Math.max(0, projectedIncome),
        expenses: Math.max(0, projectedExpenses),
        net: projectedIncome - projectedExpenses,
        isPrediction: true
      });
    }
    
    return futureData;
  };

  const futureData = generateFutureData();
  const combinedData = [...monthlyData, ...futureData];

  // Category spending trends - Fixed with proper null checks
  const expenseTransactions = transactions.filter(t => t && t.type === 'expense');
  const totalExpenses = calculations.getTotalByType(expenseTransactions, 'expense');
  
  const categoryData = Object.entries(
    calculations.getTransactionsByCategory(expenseTransactions)
  )
    .map(([category, data]) => ({
      category,
      amount: data.expense,
      percentage: totalExpenses > 0 ? ((data.expense / totalExpenses) * 100).toFixed(1) : '0'
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  const currentMonthTransactions = calculations.getCurrentMonthTransactions(transactions);
  const currentIncome = calculations.getTotalByType(currentMonthTransactions, 'income');
  const currentExpenses = calculations.getTotalByType(currentMonthTransactions, 'expense');
  const currentNet = currentIncome - currentExpenses;

  if (!userProfile.aiSuggestions) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Predictions</h1>
          <p className="text-gray-600">AI-powered cash flow forecasts and insights</p>
        </div>
        
        <Card>
          <div className="text-center py-12">
            <Brain size={64} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">AI Predictions Disabled</h3>
            <p className="text-gray-500 mb-4">Enable AI suggestions in Settings to access predictions and forecasts.</p>
            <Button onClick={() => window.location.href = '/settings'}>
              Go to Settings
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (transactions.length < 4) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Predictions</h1>
          <p className="text-gray-600">AI-powered cash flow forecasts and insights</p>
        </div>
        
        <Card>
          <div className="text-center py-12">
            <Calendar size={64} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Need More Data</h3>
            <p className="text-gray-500 mb-4">Add more transactions to generate accurate predictions and forecasts.</p>
            <Button onClick={() => window.location.href = '/transactions'}>
              Add Transactions
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Predictions</h1>
          <p className="text-gray-600">AI-powered cash flow forecasts and insights</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Time Range:</label>
          <select
            className="form-select w-auto"
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
          >
            <option value={3}>3 months</option>
            <option value={6}>6 months</option>
            <option value={12}>12 months</option>
          </select>
        </div>
      </div>

      {/* Prediction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Month Net</p>
              <p className={`text-2xl font-bold ${currentNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(currentNet)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Brain size={24} className="text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">30-Day Forecast</p>
              {loading ? (
                <div className="flex items-center">
                  <div className="spinner mr-2"></div>
                  <span className="text-sm text-gray-500">Analyzing...</span>
                </div>
              ) : predictions ? (
                <p className={`text-2xl font-bold ${
                  predictions.prediction >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(predictions.prediction)}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Unable to predict</p>
              )}
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertTriangle size={24} className="text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Risk Level</p>
              <p className={`text-lg font-bold ${
                currentNet > 1000 ? 'text-green-600' : 
                currentNet > 0 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {currentNet > 1000 ? 'Low' : currentNet > 0 ? 'Medium' : 'High'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Cash Flow Chart */}
      <Card title="Cash Flow Trend & Forecast">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value, name) => [formatCurrency(value), name]} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#22c55e" 
                strokeWidth={2}
                strokeDasharray={(data) => data?.isPrediction ? "5 5" : "0"}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray={(data) => data?.isPrediction ? "5 5" : "0"}
                name="Expenses"
              />
              <Line 
                type="monotone" 
                dataKey="net" 
                stroke="#3b82f6" 
                strokeWidth={3}
                strokeDasharray={(data) => data?.isPrediction ? "5 5" : "0"}
                name="Net Balance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <span className="inline-block w-3 h-3 border-2 border-blue-500 border-dashed mr-2"></span>
          Dashed lines represent AI predictions for future months
        </div>
      </Card>

      {/* Spending Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Top Spending Categories">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="AI Insights & Recommendations">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="spinner mr-2"></div>
              <span className="text-gray-500">Generating insights...</span>
            </div>
          ) : predictions ? (
            <div className="space-y-4">
              {predictions.watchCategories && predictions.watchCategories.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle size={20} className="text-yellow-600" />
                    <span className="font-medium text-yellow-800">Categories to Monitor</span>
                  </div>
                  <div className="space-y-2">
                    {predictions.watchCategories.map((category, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-yellow-700">{category}</span>
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                          High Activity
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {predictions.recommendation && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Brain size={20} className="text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-blue-800 mb-1">AI Recommendation</p>
                      <p className="text-blue-700 text-sm">{predictions.recommendation}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <DollarSign size={20} className="text-green-600 mt-1" />
                  <div>
                    <p className="font-medium text-green-800 mb-1">Financial Health</p>
                    <p className="text-green-700 text-sm">
                      {currentNet > 0 
                        ? `You're maintaining a positive cash flow. Keep it up!`
                        : `Focus on reducing expenses or increasing income to improve cash flow.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Unable to generate insights. Try again later.</p>
              <Button onClick={generatePredictions} className="mt-4" size="small">
                Retry Analysis
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};