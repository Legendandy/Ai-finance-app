import React from 'react';
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const RecentActivity = () => {
  const [transactions] = useLocalStorage('transactions', []);
  const [userProfile] = useLocalStorage('userProfile', {});
  
  const recentTransactions = transactions
    .sort((a, b) => {
      // Sort by createdAt first (for newly added transactions), then by date
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      return dateB.getTime() - dateA.getTime(); // Most recent first
    })
    .slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: userProfile.currency || 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card title="Recent Activity">
      <div className="space-y-4">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction, index) => (
            <div key={transaction.id || index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight size={18} className="text-green-600" />
                  ) : (
                    <ArrowDownRight size={18} className="text-red-600" />
                  )}
                </div>
                
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.category || 'Uncategorized'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.date)}
                    {transaction.notes && ` • ${transaction.notes.substring(0, 30)}...`}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-500 mb-4">Start tracking your income and expenses to see them here.</p>
            <Link to="/transactions">
              <Button>Add Your First Transaction</Button>
            </Link>
          </div>
        )}
        
        {recentTransactions.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <Link to="/transactions">
              <Button variant="secondary" size="small" className="w-full">
                View All Transactions
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};