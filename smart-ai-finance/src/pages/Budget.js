import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { ProgressBar } from '../components/UI/ProgressBar';
import { Button } from '../components/UI/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculations } from '../utils/calculations';
import { AIService } from '../utils/aiService';

export const Budget = () => {
  const [transactions] = useLocalStorage('transactions', []);
  const [userProfile, setUserProfile] = useLocalStorage('userProfile', {});
  const [recommendations, setRecommendations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    monthlyIncomeGoal: userProfile.monthlyIncomeGoal || 0,
    monthlyExpenseLimit: userProfile.monthlyExpenseLimit || 0
  });

  useEffect(() => {
    if (userProfile.aiSuggestions && transactions.length > 0) {
      loadRecommendations();
    }
  }, [transactions, userProfile]);

  const loadRecommendations = async () => {
    try {
      const recs = await AIService.getBudgetRecommendations(transactions, userProfile);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const currentMonthTransactions = calculations.getCurrentMonthTransactions(transactions);
  const totalIncome = calculations.getTotalByType(currentMonthTransactions, 'income');
  const totalExpenses = calculations.getTotalByType(currentMonthTransactions, 'expense');
  const expensesByCategory = calculations.getTransactionsByCategory(
    currentMonthTransactions.filter(t => t.type === 'expense')
  );

  const incomeProgress = userProfile.monthlyIncomeGoal ? 
    calculations.calculateProgress(totalIncome, userProfile.monthlyIncomeGoal) : 0;
  
  const expenseProgress = userProfile.monthlyExpenseLimit ? 
    calculations.calculateProgress(totalExpenses, userProfile.monthlyExpenseLimit) : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: userProfile.currency || 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSaveGoals = () => {
    setUserProfile({
      ...userProfile,
      monthlyIncomeGoal: parseFloat(editForm.monthlyIncomeGoal) || 0,
      monthlyExpenseLimit: parseFloat(editForm.monthlyExpenseLimit) || 0
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      monthlyIncomeGoal: userProfile.monthlyIncomeGoal || 0,
      monthlyExpenseLimit: userProfile.monthlyExpenseLimit || 0
    });
    setIsEditing(false);
  };

  const isOverBudget = expenseProgress > 100;
  const remainingBudget = userProfile.monthlyExpenseLimit ? 
    userProfile.monthlyExpenseLimit - totalExpenses : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Overview</h1>
          <p className="text-gray-600">Track your financial goals and spending limits</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Target size={18} className="mr-2" />
            Edit Goals
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveGoals}>
              Save Goals
            </Button>
          </div>
        )}
      </div>

      {/* Budget Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income Goal */}
        <Card title="Monthly Income Goal">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="form-label">Income Goal ({userProfile.currency || 'USD'})</label>
                <input
                  type="number"
                  className="form-input"
                  value={editForm.monthlyIncomeGoal}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    monthlyIncomeGoal: e.target.value
                  }))}
                  min="0"
                  step="100"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {userProfile.monthlyIncomeGoal ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Progress</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(totalIncome)} of {formatCurrency(userProfile.monthlyIncomeGoal)}
                    </span>
                  </div>
                  
                  <ProgressBar
                    percentage={incomeProgress}
                    color={incomeProgress >= 100 ? "green" : incomeProgress >= 75 ? "blue" : "yellow"}
                  />
                  
                  <div className="flex items-center space-x-2">
                    {incomeProgress >= 100 ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <Target size={20} className="text-blue-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      incomeProgress >= 100 ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {incomeProgress >= 100 
                        ? `Goal achieved! ${formatCurrency(totalIncome - userProfile.monthlyIncomeGoal)} over target`
                        : `${formatCurrency(userProfile.monthlyIncomeGoal - totalIncome)} remaining to reach goal`
                      }
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Target size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No income goal set</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Expense Budget */}
        <Card title="Monthly Expense Budget">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="form-label">Expense Limit ({userProfile.currency || 'USD'})</label>
                <input
                  type="number"
                  className="form-input"
                  value={editForm.monthlyExpenseLimit}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    monthlyExpenseLimit: e.target.value
                  }))}
                  min="0"
                  step="100"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {userProfile.monthlyExpenseLimit ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Budget Used</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(totalExpenses)} of {formatCurrency(userProfile.monthlyExpenseLimit)}
                    </span>
                  </div>
                  
                  <ProgressBar
                    percentage={expenseProgress}
                    color={isOverBudget ? "red" : expenseProgress > 80 ? "yellow" : "green"}
                  />
                  
                  <div className="flex items-center space-x-2">
                    {isOverBudget ? (
                      <AlertTriangle size={20} className="text-red-600" />
                    ) : expenseProgress > 80 ? (
                      <AlertTriangle size={20} className="text-yellow-600" />
                    ) : (
                      <CheckCircle size={20} className="text-green-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      isOverBudget ? 'text-red-600' : 
                      expenseProgress > 80 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {isOverBudget 
                        ? `Over budget by ${formatCurrency(Math.abs(remainingBudget))}`
                        : expenseProgress > 80
                        ? `${formatCurrency(remainingBudget)} remaining (${(100 - expenseProgress).toFixed(1)}%)`
                        : `${formatCurrency(remainingBudget)} remaining`
                      }
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Target size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No expense budget set</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Spending by Category */}
      <Card title="Spending by Category">
        {Object.keys(expensesByCategory).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(expensesByCategory)
              .sort(([,a], [,b]) => b.expense - a.expense)
              .map(([category, data]) => {
                const percentage = userProfile.monthlyExpenseLimit ? 
                  (data.expense / userProfile.monthlyExpenseLimit) * 100 : 0;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{category}</span>
                      <span className="text-sm text-gray-600">
                        {formatCurrency(data.expense)}
                        {userProfile.monthlyExpenseLimit && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({percentage.toFixed(1)}% of budget)
                          </span>
                        )}
                      </span>
                    </div>
                    <ProgressBar
                      percentage={percentage}
                      color={percentage > 20 ? "red" : percentage > 10 ? "yellow" : "blue"}
                    />
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingDown size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No expenses this month</p>
          </div>
        )}
      </Card>

      {/* AI Recommendations */}
      {userProfile.aiSuggestions && recommendations.length > 0 && (
        <Card title="Budget Recommendations">
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <TrendingUp size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Budget Tip</p>
                  <p className="text-sm text-blue-700 mt-1">{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};