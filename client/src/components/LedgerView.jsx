import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, exportToCSV } from '../utils/calculations';
import { useLoan } from '../context/LoanContext';

const LedgerViewPage = () => {
  const navigate = useNavigate();
  const { userData } = useLoan();
  
  // Check if we have loan data
  if (!userData.loanAmount || !userData.emiSchedule) {
    navigate('/loan-details');
    return null;
  }
  
  // Extract data from userData
  const { 
    name, 
    emiSchedule = [], 
    loanSummary = {} 
  } = userData;
  
  // Check if EMI schedule exists
  const hasEmiSchedule = emiSchedule && emiSchedule.length > 0;
  
  // Handle download CSV
  const handleDownloadCSV = () => {
    if (!hasEmiSchedule) return;
    
    const csvContent = exportToCSV(emiSchedule, loanSummary);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger download
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${name.replace(/\s+/g, '_')}_loan_schedule.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  // Handle back button
  const handleBack = () => {
    navigate('/loan-details');
  };
  
  // Handle new application button
  const handleNewApplication = () => {
    navigate('/');
  };
  
  // If no EMI schedule, show message
  if (!hasEmiSchedule) {
    return (
      <div className="page-container">
        <h1 className="page-title">Ledger View</h1>
        <p>No loan details available. Please go back and enter loan details.</p>
        <div className="form-button-container">
          <button 
            className="button button-primary" 
            onClick={handleBack}
          >
            Back to Loan Details
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <h1 className="page-title">Loan Schedule</h1>
      
      {/* Loan Summary */}
      <div className="ledger-summary">
        <div className="summary-item">
          <div className="summary-label">Principal Amount</div>
          <div className="summary-value">{formatCurrency(loanSummary.principal)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Interest Amount</div>
          <div className="summary-value">{formatCurrency(loanSummary.interest)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Total Amount</div>
          <div className="summary-value">{formatCurrency(loanSummary.totalAmount)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Disbursement Date</div>
          <div className="summary-value">{formatDate(loanSummary.disbursementDate)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Next Payment Date</div>
          <div className="summary-value highlight">{formatDate(loanSummary.nextPaymentDate)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">EMI Per Payment</div>
          <div className="summary-value">{formatCurrency(loanSummary.emiPerPayment)}</div>
        </div>
      </div>
      
      {/* EMI Schedule Table */}
      <div className="ledger-container">
        <h2 style={{ marginBottom: '20px' }}>EMI Schedule</h2>
        <table className="ledger-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Payment Date</th>
              <th>EMI Amount</th>
              <th>Remaining Balance</th>
              <th>Principal Component</th>
              <th>Interest Component</th>
            </tr>
          </thead>
          <tbody>
            {emiSchedule.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{formatDate(item.date)}</td>
                <td>{formatCurrency(item.totalInstallment)}</td>
                <td>{formatCurrency(item.outstandingPrincipal)}</td>
                <td>{formatCurrency(item.principalComponent)}</td>
                <td>{formatCurrency(item.interestComponent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Download Button */}
      <div style={{ marginTop: '20px' }}>
        <button 
          className="button download-button" 
          onClick={handleDownloadCSV}
        >
          Download CSV
        </button>
      </div>
      
      {/* Navigation Buttons */}
      <div className="form-button-container">
        <button 
          className="button button-secondary" 
          onClick={handleBack}
        >
          Back
        </button>
        <button 
          className="button button-primary" 
          onClick={handleNewApplication}
        >
          New Application
        </button>
      </div>
    </div>
  );
};

export default LedgerViewPage;