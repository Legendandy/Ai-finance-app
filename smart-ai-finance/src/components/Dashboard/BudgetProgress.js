import React from 'react';
import { Target, AlertTriangle } from 'lucide-react';
import { Card } from '../UI/Card';
import { ProgressBar } from '../UI/ProgressBar';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { calculations } from '../../utils/calculations';

export const BudgetProgress = () => {
  const [transactions] = useLocalStorage('transactions', []);
  const [userProfile] = useLocalStorage('userProfile', {});
  
  const currentMonthTransactions = calculations.getCurrentMonthTransactions(transactions);
  const totalIncome = calculations.getTotalByType(currentMonthTransactions, 'income');
  const totalExpenses = calculations.getTotalByType(currentMonthTransactions, 'expense');
  
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

  const isOverBudget = expenseProgress > 100;

  return (
    <Card title="Budget Progress">
      <div className="space-y-6">
        {/* Income Goal Progress */}
        {userProfile.monthlyIncomeGoal ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Income Goal</span>
              <span className="text-sm text-gray-500">
                {formatCurrency(totalIncome)} of {formatCurrency(userProfile.monthlyIncomeGoal)}
              </span>
            </div>
            <ProgressBar 
              percentage={incomeProgress}
              color="green"
            />
          </div>
        ) : (
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Target size={24} className="text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800">Set an income goal in Settings</p>
          </div>
        )}

        {/* Expense Budget Progress */}
        {userProfile.monthlyExpenseLimit ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Expense Budget</span>
              <span className="text-sm text-gray-500">
                {formatCurrency(totalExpenses)} of {formatCurrency(userProfile.monthlyExpenseLimit)}
              </span>
            </div>
            <ProgressBar 
              percentage={expenseProgress}
              color={isOverBudget ? "red" : expenseProgress > 80 ? "yellow" : "green"}
            />
            {isOverBudget && (
              <div className="flex items-center mt-2 p-2 bg-red-50 rounded">
                <AlertTriangle size={16} className="text-red-600 mr-2" />
                <span className="text-xs text-red-700">
                  Over budget by {formatCurrency(totalExpenses - userProfile.monthlyExpenseLimit)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Target size={24} className="text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800">Set an expense limit in Settings</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              <p className="text-xs text-gray-500">This Month</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
              <p className="text-xs text-gray-500">Spent</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};