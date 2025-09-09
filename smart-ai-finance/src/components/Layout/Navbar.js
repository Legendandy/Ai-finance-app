import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  Target, 
  FileText, 
  TrendingUp, 
  Settings 
} from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/budget', label: 'Budget', icon: Target },
    { path: '/invoices', label: 'Invoices', icon: FileText },
    { path: '/predictions', label: 'Predictions', icon: TrendingUp },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Spend Buddy 
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} className="mr-2" />
                {label}
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            {/* Mobile menu button */}
            <button className="text-gray-600 hover:text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};