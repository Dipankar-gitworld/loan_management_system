import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { updateUserData } = useLoan();

  const handleStartApplication = () => {
    updateUserData({
      name: '',
      dob: '',
      pan: '',
      aadhar: '',
      gstin: '',
      udyam: '',
      disbursementDate: '',
      loanAmount: '',
      interestRate: '',
      tenure: '',
      repaymentDates: [],
      emiSchedule: []
    });
    navigate('/onboarding');
  };

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Welcome to Loan Manager</h1>
      <p className="homepage-subtitle">
        Your one-stop solution for managing loans and tracking EMI payments.
        Get started with your loan application by clicking the button below.
      </p>
      <button 
        className="homepage-cta" 
        onClick={handleStartApplication}
      >
        Start Loan Application
      </button>
    </div>
  );
};

export default HomePage;