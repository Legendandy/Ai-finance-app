import React, { useState } from 'react';
import { Save, Trash2, Download, Upload, User, Bell, Shield, Palette } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const Settings = () => {
  const [userProfile, setUserProfile] = useLocalStorage('userProfile', {});
  const [transactions] = useLocalStorage('transactions', []);
  const [invoices] = useLocalStorage('invoices', []);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name || '',
    incomeSource: userProfile.incomeSource || 'Freelancing',
    currency: userProfile.currency || 'USD',
    trackingFrequency: userProfile.trackingFrequency || 'Weekly',
    monthlyIncomeGoal: userProfile.monthlyIncomeGoal || '',
    monthlyExpenseLimit: userProfile.monthlyExpenseLimit || '',
    aiSuggestions: userProfile.aiSuggestions !== false
  });

  const handleSave = () => {
    const updatedProfile = {
      ...userProfile,
      ...formData,
      monthlyIncomeGoal: parseFloat(formData.monthlyIncomeGoal) || 0,
      monthlyExpenseLimit: parseFloat(formData.monthlyExpenseLimit) || 0,
      updatedAt: new Date().toISOString()
    };
    
    setUserProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userProfile.name || '',
      incomeSource: userProfile.incomeSource || 'Freelancing',
      currency: userProfile.currency || 'USD',
      trackingFrequency: userProfile.trackingFrequency || 'Weekly',
      monthlyIncomeGoal: userProfile.monthlyIncomeGoal || '',
      monthlyExpenseLimit: userProfile.monthlyExpenseLimit || '',
      aiSuggestions: userProfile.aiSuggestions !== false
    });
    setIsEditing(false);
  };

  const handleExportData = () => {
    const exportData = {
      profile: userProfile,
      transactions,
      invoices,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-ai-finance-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (importedData.profile) {
          setUserProfile(importedData.profile);
        }
        
        if (importedData.transactions && Array.isArray(importedData.transactions)) {
          localStorage.setItem('transactions', JSON.stringify(importedData.transactions));
        }
        
        if (importedData.invoices && Array.isArray(importedData.invoices)) {
          localStorage.setItem('invoices', JSON.stringify(importedData.invoices));
        }
        
        alert('Data imported successfully! Please refresh the page.');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      if (window.confirm('This will delete all your transactions, invoices, and profile data. Are you absolutely sure?')) {
        localStorage.clear();
        window.location.href = '/';
      }
    }
  };

  const currencies = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR'];
  const incomeSources = ['Freelancing', 'Small Business', 'Employee'];
  const frequencies = ['Daily', 'Weekly', 'Monthly'];

  const dataSize = JSON.stringify({ userProfile, transactions, invoices }).length;
  const formattedDataSize = (dataSize / 1024).toFixed(2);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your profile and app preferences</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <User size={18} className="mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save size={18} className="mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Profile Settings */}
      <Card title="Profile Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Name / Business Name</label>
            {isEditing ? (
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
              />
            ) : (
              <p className="text-gray-900 py-2">{userProfile.name || 'Not set'}</p>
            )}
          </div>
          
          <div>
            <label className="form-label">Primary Income Source</label>
            {isEditing ? (
              <select
                className="form-select"
                value={formData.incomeSource}
                onChange={(e) => setFormData(prev => ({ ...prev, incomeSource: e.target.value }))}
              >
                {incomeSources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900 py-2">{userProfile.incomeSource || 'Not set'}</p>
            )}
          </div>
          
          <div>
            <label className="form-label">Preferred Currency</label>
            {isEditing ? (
              <select
                className="form-select"
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900 py-2">{userProfile.currency || 'USD'}</p>
            )}
          </div>
          
          <div>
            <label className="form-label">Tracking Frequency</label>
            {isEditing ? (
              <select
                className="form-select"
                value={formData.trackingFrequency}
                onChange={(e) => setFormData(prev => ({ ...prev, trackingFrequency: e.target.value }))}
              >
                {frequencies.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900 py-2">{userProfile.trackingFrequency || 'Weekly'}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Financial Goals */}
      <Card title="Financial Goals">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Monthly Income Goal ({userProfile.currency || 'USD'})</label>
            {isEditing ? (
              <input
                type="number"
                className="form-input"
                value={formData.monthlyIncomeGoal}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyIncomeGoal: e.target.value }))}
                placeholder="5000"
                min="0"
                step="100"
              />
            ) : (
              <p className="text-gray-900 py-2">
                {userProfile.monthlyIncomeGoal ? 
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: userProfile.currency || 'USD'
                  }).format(userProfile.monthlyIncomeGoal) : 
                  'Not set'
                }
              </p>
            )}
          </div>
          
          <div>
            <label className="form-label">Monthly Expense Limit ({userProfile.currency || 'USD'})</label>
            {isEditing ? (
              <input
                type="number"
                className="form-input"
                value={formData.monthlyExpenseLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyExpenseLimit: e.target.value }))}
                placeholder="3000"
                min="0"
                step="100"
              />
            ) : (
              <p className="text-gray-900 py-2">
                {userProfile.monthlyExpenseLimit ? 
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: userProfile.currency || 'USD'
                  }).format(userProfile.monthlyExpenseLimit) : 
                  'Not set'
                }
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* App Preferences */}
      <Card title="App Preferences">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">AI-Powered Suggestions</h4>
              <p className="text-sm text-gray-500">Get personalized insights and recommendations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isEditing ? formData.aiSuggestions : userProfile.aiSuggestions !== false}
                onChange={(e) => isEditing && setFormData(prev => ({ ...prev, aiSuggestions: e.target.checked }))}
                disabled={!isEditing}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card title="Data Management">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Transactions</h4>
              <p className="text-2xl font-bold text-blue-600">{transactions.length}</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Invoices</h4>
              <p className="text-2xl font-bold text-green-600">{invoices.length}</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Data Size</h4>
              <p className="text-2xl font-bold text-purple-600">{formattedDataSize} KB</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleExportData} className="flex-1">
              <Download size={18} className="mr-2" />
              Export Data
            </Button>
            
            <div className="flex-1">
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                style={{ display: 'none' }}
                id="import-file"
              />
              <Button
                variant="secondary"
                onClick={() => document.getElementById('import-file').click()}
                className="w-full"
              >
                <Upload size={18} className="mr-2" />
                Import Data
              </Button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Trash2 size={20} className="text-red-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-800 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-700 mb-4">
                    This will permanently delete all your data including transactions, invoices, and profile information.
                  </p>
                  <Button
                    variant="danger"
                    onClick={handleResetData}
                    size="small"
                  >
                    Reset All Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* App Information */}
      <Card title="About">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">App Version</h4>
              <p className="text-gray-600">Spend Buddy Finance v1.0.0</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Last Updated</h4>
              <p className="text-gray-600">
                {userProfile.updatedAt ? 
                  new Date(userProfile.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 
                  'Never'
                }
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Created</h4>
              <p className="text-gray-600">
                {userProfile.createdAt ? 
                  new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 
                  'Unknown'
                }
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Privacy</h4>
              <p className="text-gray-600">All data stored locally</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield size={20} className="text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Privacy Notice</h4>
                  <p className="text-sm text-blue-700">
                    Spend Buddy Finance stores all your data locally in your browser. No information is sent to external servers 
                    except for AI predictions (when enabled), which only use aggregated financial patterns without personal details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};