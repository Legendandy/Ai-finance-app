import React from 'react';
import { SummaryCards } from '../components/Dashboard/SummaryCards';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { BudgetProgress } from '../components/Dashboard/BudgetProgress';
import { AIInsights } from '../components/Dashboard/AIInsights';

export const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Budget Progress - Takes 1 column */}
        <div className="lg:col-span-1">
          <BudgetProgress />
        </div>
      </div>

      {/* AI Insights */}
      <AIInsights />
    </div>
  );
};