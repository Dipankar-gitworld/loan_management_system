import React, { createContext, useContext, useState } from 'react';

const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    // Onboarding data
    name: '',
    dob: '',
    pan: '',
    aadhar: '',
    gstin: '',
    udyam: '',
    
    // Loan details
    disbursementDate: '',
    loanAmount: '',
    interestRate: '',
    tenure: '',
    repaymentDates: [],
    
    // Calculated data
    emiSchedule: []
  });

  const updateUserData = (newData) => {
    setUserData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  return (
    <LoanContext.Provider value={{ userData, updateUserData }}>
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoan must be used within a LoanProvider');
  }
  return context;
}; 