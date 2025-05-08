import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import { 
  isValidLoanAmount, 
  isValidInterestRate, 
  isValidTenure,
  isValidFutureDate
} from '../utils/validations';
import { calculateEMISchedule } from '../services/api';

const LoanDetailsPage = () => {
  const navigate = useNavigate();
  const { userData, updateUserData } = useLoan();
  
  // Initialize form data with all userData including repayment dates
  const [formData, setFormData] = useState({
    disbursementDate: userData.disbursementDate || '',
    loanAmount: userData.loanAmount || '',
    interestRate: userData.interestRate || '',
    tenure: userData.tenure || '',
    repaymentDates: userData.repaymentDates || []
  });
  
  // Initialize repayment days from userData or default to single empty input
  const [repaymentDays, setRepaymentDays] = useState(
    userData.repaymentDates?.length > 0
      ? userData.repaymentDates.map(day => ({ value: day }))
      : [{ value: '' }]
  );
  
  // Form errors state
  const [errors, setErrors] = useState({});
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle repayment day change
  const handleRepaymentDayChange = (index, value) => {
    // Ensure the value is between 1 and 31
    const day = Math.min(Math.max(1, Number(value)), 31);
    
    const newRepaymentDays = [...repaymentDays];
    newRepaymentDays[index] = { value: day };
    setRepaymentDays(newRepaymentDays);

    // Update form data with array of days
    const days = newRepaymentDays
      .map(item => Number(item.value))
      .filter(day => day > 0);

    setFormData(prevData => ({
      ...prevData,
      repaymentDates: days
    }));
  };
  
  // Add new repayment day field
  const addRepaymentDay = () => {
    setRepaymentDays([...repaymentDays, { value: '' }]);
  };
  
  // Remove repayment day field
  const removeRepaymentDay = (index) => {
    if (repaymentDays.length > 1) {
      const newRepaymentDays = [...repaymentDays];
      newRepaymentDays.splice(index, 1);
      setRepaymentDays(newRepaymentDays);

      // Update form data
      const days = newRepaymentDays
        .map(item => Number(item.value))
        .filter(day => day > 0);

      setFormData(prevData => ({
        ...prevData,
        repaymentDates: days
      }));
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    // Check if user data exists
    if (!userData.name) {
      navigate('/onboarding');
      return false;
    }
    
    // Validate disbursement date
    if (!formData.disbursementDate) {
      newErrors.disbursementDate = 'Disbursement date is required';
    } else if (!isValidFutureDate(formData.disbursementDate)) {
      newErrors.disbursementDate = 'Disbursement date must be today or a future date';
    }
    
    // Validate loan amount
    if (!formData.loanAmount) {
      newErrors.loanAmount = 'Loan amount is required';
    } else if (!isValidLoanAmount(formData.loanAmount)) {
      newErrors.loanAmount = 'Loan amount must be a positive number';
    }
    
    // Validate interest rate
    if (!formData.interestRate) {
      newErrors.interestRate = 'Interest rate is required';
    } else if (!isValidInterestRate(formData.interestRate)) {
      newErrors.interestRate = 'Interest rate must be a positive number between 0 and 100';
    }
    
    // Validate tenure
    if (!formData.tenure) {
      newErrors.tenure = 'Tenure is required';
    } else if (!isValidTenure(formData.tenure)) {
      newErrors.tenure = 'Tenure must be a positive integer';
    }
    
    // Validate repayment days
    const days = repaymentDays
      .map(item => Number(item.value))
      .filter(day => day > 0);

    if (days.length === 0) {
      newErrors.repaymentDates = 'At least one repayment day is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        const emiData = await calculateEMISchedule({
          ...formData,
          tenureInMonths: Number(formData.tenure),
          disbursementDate: formData.disbursementDate,
          loanAmount: formData.loanAmount,
          interestRate: formData.interestRate,
          repaymentDates: formData.repaymentDates
        });
        
        // Update the user data in parent component
        updateUserData({
          ...formData,
          emiSchedule: emiData.schedule,
          loanSummary: {
            principal: formData.loanAmount,
            interest: emiData.interest,
            totalAmount: emiData.totalRepayable,
            disbursementDate: formData.disbursementDate,
            nextPaymentDate: emiData.schedule[0]?.date,
            emiPerPayment: emiData.perInstallmentAmount
          }
        });
        
        // Navigate to ledger view page
        navigate('/ledger-view');
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to calculate EMI schedule. Please try again.'
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Go back to previous page
  const handleBack = () => {
    navigate('/onboarding');
  };
  
  return (
    <div className="page-container">
      <h1 className="page-title">Loan Details</h1>
      
      <form onSubmit={handleSubmit} className="form-container">
        {/* Disbursement Date Field */}
        <div className="form-group">
          <label htmlFor="disbursementDate" className="form-label">Disbursement Date</label>
          <input 
            type="date" 
            id="disbursementDate" 
            name="disbursementDate" 
            className="form-input" 
            value={formData.disbursementDate} 
            onChange={handleChange} 
          />
          {errors.disbursementDate && <p className="form-error">{errors.disbursementDate}</p>}
        </div>
        
        {/* Loan Amount Field */}
        <div className="form-group">
          <label htmlFor="loanAmount" className="form-label">Loan Amount (₹)</label>
          <input 
            type="number" 
            id="loanAmount" 
            name="loanAmount" 
            className="form-input" 
            value={formData.loanAmount} 
            onChange={handleChange} 
            placeholder="Enter loan amount"
            min="1"
            step="0.01"
          />
          {errors.loanAmount && <p className="form-error">{errors.loanAmount}</p>}
        </div>
        
        {/* Interest Rate Field */}
        <div className="form-group">
          <label htmlFor="interestRate" className="form-label">Interest Rate (% per annum)</label>
          <input 
            type="number" 
            id="interestRate" 
            name="interestRate" 
            className="form-input" 
            value={formData.interestRate} 
            onChange={handleChange} 
            placeholder="Enter interest rate"
            min="0.01"
            max="100"
            step="0.01"
          />
          {errors.interestRate && <p className="form-error">{errors.interestRate}</p>}
        </div>
        
        {/* Tenure Field */}
        <div className="form-group">
          <label htmlFor="tenure" className="form-label">Tenure (Months)</label>
          <input 
            type="number" 
            id="tenure" 
            name="tenure" 
            className="form-input" 
            value={formData.tenure} 
            onChange={handleChange} 
            placeholder="Enter tenure in months"
            min="1"
            max="360"  // 30 years maximum
            step="1"
          />
          {errors.tenure && <p className="form-error">{errors.tenure}</p>}
        </div>
        
        {/* Repayment Days Fields */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label">Repayment Days (1-31)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {repaymentDays.map((field, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="number" 
                  className="form-input" 
                  value={field.value} 
                  onChange={(e) => handleRepaymentDayChange(index, e.target.value)} 
                  placeholder="Enter day (1-31)"
                  min="1"
                  max="31"
                  style={{ width: '200px' }}
                />
                <button 
                  type="button" 
                  onClick={() => removeRepaymentDay(index)}
                  className="button button-secondary"
                  disabled={repaymentDays.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addRepaymentDay}
              className="button button-primary"
              style={{ alignSelf: 'flex-start', marginTop: '5px' }}
            >
              Add Repayment Day
            </button>
          </div>
          {errors.repaymentDates && <p className="form-error">{errors.repaymentDates}</p>}
        </div>
        
        {/* Form Buttons */}
        <div className="form-button-container">
          <button 
            type="button" 
            className="button button-secondary" 
            onClick={handleBack}
          >
            Back
          </button>
          <button 
            type="submit" 
            className="button button-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Calculating...' : 'Calculate EMI'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanDetailsPage;