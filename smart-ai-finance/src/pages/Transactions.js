import React, { useState } from 'react';
import { Plus, Filter, Search, Edit, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TransactionModal } from '../components/Modals/TransactionModal';
import { ConfirmationModal } from '../components/Modals/ConfirmationModal';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const Transactions = () => {
  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [userProfile] = useLocalStorage('userProfile', {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [modalType, setModalType] = useState('income');
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    search: ''
  });
  
  // Add confirmation modal state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const handleAddTransaction = (type) => {
    setEditingTransaction(null);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setModalType(transaction.type);
    setIsModalOpen(true);
  };

  // Modified to show confirmation modal instead of window.confirm
  const handleDeleteTransaction = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    setTransactionToDelete(transaction);
    setShowDeleteConfirmation(true);
  };

  // Handle confirmed deletion
  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      setTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
    }
    setShowDeleteConfirmation(false);
    setTransactionToDelete(null);
  };

  // Handle cancelled deletion
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setTransactionToDelete(null);
  };

  const handleSaveTransaction = (transactionData) => {
    if (editingTransaction) {
      // Update existing transaction
      setTransactions(prev => 
        prev.map(t => t.id === editingTransaction.id ? { ...transactionData, id: editingTransaction.id } : t)
      );
    } else {
      // Add new transaction
      const newTransaction = {
        ...transactionData,
        id: Date.now().toString(), // Simple ID generation
        createdAt: new Date().toISOString()
      };
      setTransactions(prev => [newTransaction, ...prev]); // Add to beginning of array
    }
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: userProfile.currency || 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filters.type === 'all' || transaction.type === filters.type;
    const matchesCategory = filters.category === 'all' || transaction.category === filters.category;
    const matchesSearch = !filters.search || 
      transaction.category.toLowerCase().includes(filters.search.toLowerCase()) ||
      (transaction.notes && transaction.notes.toLowerCase().includes(filters.search.toLowerCase()));
    
    return matchesType && matchesCategory && matchesSearch;
  });

  // Sort by date (newest first) - using both date and createdAt for better sorting
  const sortedTransactions = filteredTransactions.sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date);
    const dateB = new Date(b.createdAt || b.date);
    return dateB - dateA;
  });

  // Get unique categories for filter dropdown
  const allCategories = [...new Set(transactions.map(t => t.category))];

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Track your income and expenses</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => handleAddTransaction('income')} className="bg-green-600 hover:bg-green-700">
            <Plus size={18} className="mr-2" />
            Add Income
          </Button>
          <Button onClick={() => handleAddTransaction('expense')} className="bg-red-600 hover:bg-red-700">
            <Plus size={18} className="mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <ArrowUpRight size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <ArrowDownRight size={24} className="text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${
              totalIncome - totalExpenses >= 0 ? 'bg-blue-100' : 'bg-red-100'
            }`}>
              <ArrowUpRight size={24} className={
                totalIncome - totalExpenses >= 0 ? 'text-blue-600' : 'text-red-600'
              } />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${
                totalIncome - totalExpenses >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                {formatCurrency(totalIncome - totalExpenses)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Search</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="form-input pl-10"
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="all">All Categories</option>
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => setFilters({ type: 'all', category: 'all', search: '' })}
              className="w-full"
            >
              <Filter size={18} className="mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <Card title={`Transactions (${sortedTransactions.length})`}>
        {sortedTransactions.length > 0 ? (
          <div className="space-y-4">
            {sortedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight size={20} className="text-green-600" />
                    ) : (
                      <ArrowDownRight size={20} className="text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{transaction.category}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(transaction.date)}
                      {transaction.notes && ` • ${transaction.notes}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="small"
                      variant="danger"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500 mb-4">
              {transactions.length === 0 
                ? 'Start by adding your first transaction'
                : 'Try adjusting your filters'
              }
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => handleAddTransaction('income')} className="bg-green-600 hover:bg-green-700">
                Add Income
              </Button>
              <Button onClick={() => handleAddTransaction('expense')} className="bg-red-600 hover:bg-red-700">
                Add Expense
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={editingTransaction}
        type={modalType}
        onSave={handleSaveTransaction}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message={
          transactionToDelete
            ? `Are you sure you want to delete this ${transactionToDelete.type} transaction for ${formatCurrency(transactionToDelete.amount)} in ${transactionToDelete.category}?`
            : 'Are you sure you want to delete this transaction?'
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};