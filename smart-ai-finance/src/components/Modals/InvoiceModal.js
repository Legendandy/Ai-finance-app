import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const InvoiceModal = ({ isOpen, onClose, invoice = null, onSave }) => {
  const [userProfile] = useLocalStorage('userProfile', {});
  const [formData, setFormData] = useState({
    clientName: '',
    items: [{ description: '', amount: 0 }],
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        clientName: invoice.clientName,
        items: invoice.items,
        dueDate: invoice.dueDate,
        notes: invoice.notes || ''
      });
    } else {
      // Set default due date to 30 days from now
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 30);
      
      setFormData({
        clientName: '',
        items: [{ description: '', amount: 0 }],
        dueDate: defaultDueDate.toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [invoice, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const total = formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    
    const invoiceData = {
      clientName: formData.clientName,
      items: formData.items.filter(item => item.description && item.amount > 0),
      total: total,
      dueDate: formData.dueDate,
      date: invoice?.date || new Date().toISOString().split('T')[0],
      status: invoice?.status || 'Pending',
      notes: formData.notes,
      currency: userProfile.currency || 'USD',
      updatedAt: new Date().toISOString()
    };

    // Call the onSave function passed from parent component
    if (onSave) {
      onSave(invoiceData);
    }

    // Reset form for next use
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 30);
    
    setFormData({
      clientName: '',
      items: [{ description: '', amount: 0 }],
      dueDate: defaultDueDate.toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'amount' ? parseFloat(value) || 0 : value
    };
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    }
  };

  const total = formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const isValid = formData.clientName && formData.dueDate && 
                 formData.items.some(item => item.description && item.amount > 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={invoice ? 'Edit Invoice' : 'Create New Invoice'}
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Client Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter client name"
              value={formData.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="form-label mb-0">Items/Services</label>
            <Button type="button" onClick={addItem} size="small">
              <Plus size={16} className="mr-1" />
              Add Item
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  />
                </div>
                
                <div className="w-32">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-input"
                    placeholder="Amount"
                    value={item.amount}
                    onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                  />
                </div>
                
                {formData.items.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() => removeItem(index)}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-right">
              <span className="text-lg font-semibold">
                Total: {userProfile.currency || 'USD'} {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="form-label">Notes (Optional)</label>
          <textarea
            className="form-input"
            rows="3"
            placeholder="Add any additional notes or terms..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isValid}>
            {invoice ? 'Update' : 'Create'} Invoice
          </Button>
        </div>
      </form>
    </Modal>
  );
};