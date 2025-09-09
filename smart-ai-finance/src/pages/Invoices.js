import React, { useState } from 'react';
import { Plus, Download, Edit, Trash2, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { InvoiceModal } from '../components/Modals/InvoiceModal';
import { downloadInvoice } from '../utils/pdfGenerator';
import { ConfirmationModal } from '../components/Modals/ConfirmationModal';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const Invoices = () => {
  const [invoices, setInvoices] = useLocalStorage('invoices', []);
  const [userProfile] = useLocalStorage('userProfile', {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Add confirmation modal state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setIsModalOpen(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setIsModalOpen(true);
  };

  // Modified to show confirmation modal instead of window.confirm
  const handleDeleteInvoice = (invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    setInvoiceToDelete(invoice);
    setShowDeleteConfirmation(true);
  };

  // Handle confirmed deletion
  const handleConfirmDelete = () => {
    if (invoiceToDelete) {
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceToDelete.id));
    }
    setShowDeleteConfirmation(false);
    setInvoiceToDelete(null);
  };

  // Handle cancelled deletion
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setInvoiceToDelete(null);
  };

  const handleSaveInvoice = (invoiceData) => {
    if (editingInvoice) {
      // Update existing invoice
      setInvoices(prev => 
        prev.map(inv => inv.id === editingInvoice.id ? { ...invoiceData, id: editingInvoice.id } : inv)
      );
    } else {
      // Add new invoice
      const newInvoice = {
        ...invoiceData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setInvoices(prev => [newInvoice, ...prev]); // Add to beginning of array
    }
    setIsModalOpen(false);
    setEditingInvoice(null);
  };

  const handleDownloadInvoice = (invoice) => {
    try {
      downloadInvoice(invoice);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleStatusChange = (invoiceId, newStatus) => {
    setInvoices(prev => 
      prev.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, status: newStatus, updatedAt: new Date().toISOString() }
          : inv
      )
    );
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'Overdue':
        return <AlertCircle size={18} className="text-red-600" />;
      default:
        return <Clock size={18} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'status-paid';
      case 'Overdue':
        return 'status-overdue';
      default:
        return 'status-pending';
    }
  };

  const isOverdue = (invoice) => {
    if (invoice.status === 'Paid') return false;
    return new Date(invoice.dueDate) < new Date();
  };

  // Update overdue invoices
  const updatedInvoices = invoices.map(invoice => ({
    ...invoice,
    status: isOverdue(invoice) && invoice.status !== 'Paid' ? 'Overdue' : invoice.status
  }));

  // Filter invoices
  const filteredInvoices = updatedInvoices.filter(invoice => 
    filterStatus === 'all' || invoice.status === filterStatus
  );

  // Sort by date (newest first) - using both createdAt and date for better sorting
  const sortedInvoices = filteredInvoices.sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date);
    const dateB = new Date(b.createdAt || b.date);
    return dateB - dateA;
  });

  // Calculate statistics
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.total, 0);
  const overdueAmount = invoices.filter(inv => isOverdue(inv)).reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Create and manage your invoices</p>
        </div>
        
        <Button onClick={handleCreateInvoice}>
          <Plus size={18} className="mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(overdueAmount)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <select
            className="form-select w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Invoices</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </Card>

      {/* Invoices List */}
      <Card title={`Invoices (${sortedInvoices.length})`}>
        {sortedInvoices.length > 0 ? (
          <div className="space-y-4">
            {sortedInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FileText size={20} className="text-blue-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900">
                        Invoice #{invoice.id.slice(-6)}
                      </h4>
                      <span className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {invoice.clientName} • Created: {formatDate(invoice.date)} • Due: {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(invoice.total)}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getStatusIcon(invoice.status)}
                      <span className="text-xs text-gray-500">{invoice.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <select
                      className="text-xs border rounded px-2 py-1"
                      value={invoice.status}
                      onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                    
                    <div className="flex space-x-1">
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => handleDownloadInvoice(invoice)}
                        title="Download PDF"
                      >
                        <Download size={14} />
                      </Button>
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => handleEditInvoice(invoice)}
                        title="Edit Invoice"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="small"
                        variant="danger"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        title="Delete Invoice"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-500 mb-4">
              {invoices.length === 0 
                ? 'Create your first invoice to get started'
                : 'No invoices match the current filter'
              }
            </p>
            <Button onClick={handleCreateInvoice}>
              Create Your First Invoice
            </Button>
          </div>
        )}
      </Card>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoice={editingInvoice}
        onSave={handleSaveInvoice}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Invoice"
        message={
          invoiceToDelete
            ? `Are you sure you want to delete Invoice #${invoiceToDelete.id.slice(-6)} for ${invoiceToDelete.clientName}? This action cannot be undone.`
            : 'Are you sure you want to delete this invoice?'
        }
        confirmText="Delete Invoice"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};