import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './pages/HomePage';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Budget } from './pages/Budget';
import { Invoices } from './pages/Invoices';
import { Predictions } from './pages/Predictions';
import { Settings } from './pages/Settings';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [userProfile] = useLocalStorage('userProfile', null);
  const isOnboarded = userProfile && userProfile.name;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Always define these routes, but protect them individually */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
          <Route path="/budget" element={<Layout><Budget /></Layout>} />
          <Route path="/invoices" element={<Layout><Invoices /></Layout>} />
          <Route path="/predictions" element={<Layout><Predictions /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          
          {/* Default redirects */}
          <Route path="*" element={
            <Navigate to={isOnboarded ? "/dashboard" : "/onboarding"} replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;