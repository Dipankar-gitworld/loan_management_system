import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoanProvider } from './context/LoanContext';
import HomePage from './components/HomePage';
import OnboardingPage from './components/Onboarding';
import LoanDetailsPage from './components/LoanDetails';
import LedgerViewPage from './components/LedgerView';
import NavigationBar from './components/NavigationBar';
import './styles.css';

function App() {
  return (
    <LoanProvider>
      <Router>
        <div className="app-container">
          <NavigationBar />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/loan-details" element={<LoanDetailsPage />} />
              <Route path="/ledger-view" element={<LedgerViewPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </LoanProvider>
  );
}

export default App;