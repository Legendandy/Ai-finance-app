import React, { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const TransactionModal = ({ isOpen, onClose, transaction = null, type = 'income', onSave }) => {
  const [userProfile] = useLocalStorage('userProfile', {});
  const [formData, setFormData] = useState({
    type: type,
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const categories = {
    income: [
      'Salary', 'Freelance', 'Business', 'Investment', 'Rental', 'Other Income'
    ],
    expense: [
      'Food', 'Transportation', 'Housing', 'Utilities', 'Healthcare', 
      'Entertainment', 'Shopping', 'Education', 'Insurance', 'Other Expense'
    ]
  };

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        date: transaction.date,
        notes: transaction.notes || ''
      });
    } else {
      setFormData({
        type: type,
        amount: '',
        category: categories[type][0],
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [transaction, type, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const transactionData = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      notes: formData.notes,
      updatedAt: new Date().toISOString()
    };

    // Call the onSave function passed from parent component
    if (onSave) {
      onSave(transactionData);
    }
    
    // Reset form for next use
    setFormData({
      type: 'income',
      amount: '',
      category: categories['income'][0],
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isValid = formData.amount && formData.category && formData.date;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transaction ? 'Edit Transaction' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Type</label>
          <select
            className="form-select"
            value={formData.type}
            onChange={(e) => {
              const newType = e.target.value;
              handleInputChange('type', newType);
              handleInputChange('category', categories[newType][0]);
            }}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="form-label">
            Amount ({userProfile.currency || 'USD'})
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-input"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            required
          >
            {categories[formData.type].map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-input"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="form-label">Notes (Optional)</label>
          <textarea
            className="form-input"
            rows="3"
            placeholder="Add any additional notes..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isValid}>
            {transaction ? 'Update' : 'Add'} Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};