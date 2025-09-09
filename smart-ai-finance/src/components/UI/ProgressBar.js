import React from 'react';

export const ProgressBar = ({ percentage, label, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600'
  };

  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{safePercentage.toFixed(1)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${colors[color]} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${safePercentage}%` }}
        ></div>
      </div>
    </div>
  );
};