import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { Card } from '../UI/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { calculations } from '../../utils/calculations';

export const SummaryCards = () => {
  const [transactions] = useLocalStorage('transactions', []);
  const [userProfile] = useLocalStorage('userProfile', {});
  
  const currentMonthTransactions = calculations.getCurrentMonthTransactions(transactions);
  const totalIncome = calculations.getTotalByType(currentMonthTransactions, 'income');
  const totalExpenses = calculations.getTotalByType(currentMonthTransactions, 'expense');
  const netBalance = totalIncome - totalExpenses;
  const goalProgress = userProfile.monthlyIncomeGoal ? 
    calculations.calculateProgress(totalIncome, userProfile.monthlyIncomeGoal) : 0;

  const cards = [
    {
      title: 'Total Income',
      value: totalIncome,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '+8.2%',
      changeType: 'negative'
    },
    {
      title: 'Net Balance',
      value: netBalance,
      icon: TrendingUp,
      color: netBalance >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: netBalance >= 0 ? 'bg-blue-50' : 'bg-red-50',
      change: netBalance >= 0 ? '+15.3%' : '-5.2%',
      changeType: netBalance >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Goal Progress',
      value: `${goalProgress.toFixed(1)}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: `${userProfile.monthlyIncomeGoal ? `of ${userProfile.currency} ${userProfile.monthlyIncomeGoal}` : 'No goal set'}`,
      changeType: 'neutral'
    }
  ];

  const formatCurrency = (amount) => {
    if (typeof amount === 'string') return amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: userProfile.currency || 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="card-hover">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${card.bgColor}`}>
              <card.icon size={24} className={card.color} />
            </div>
            
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">
                {typeof card.value === 'number' ? formatCurrency(card.value) : card.value}
              </p>
              <p className={`text-xs ${
                card.changeType === 'positive' ? 'text-green-600' : 
                card.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {card.change}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};