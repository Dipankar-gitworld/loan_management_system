/**
 * Utility functions for form validations
 */

// Check if user is at least 18 years old
export const isAdult = (dob) => {
    if (!dob) return false;
    
    const birthDate = new Date(dob);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  };
  
  // Validate Indian PAN format (AAAAA1234A)
  export const isValidPAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };
  
  // Validate Aadhar format (12 digits)
  export const isValidAadhar = (aadhar) => {
    const aadharRegex = /^[2-9]{1}[0-9]{11}$/;
    return aadharRegex.test(aadhar);
  };
  
  // Validate GSTIN format (22AAAAA0000A1Z5)
  export const isValidGSTIN = (gstin) => {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };
  
  // Validate UDYAM format (UDYAM-XX-XX-XXXXXXX)
  export const isValidUDYAM = (udyam) => {
    const udyamRegex = /^UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}$/;
    return udyamRegex.test(udyam);
  };
  
  // Validate loan amount (positive number)
  export const isValidLoanAmount = (amount) => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0;
  };
  
  // Validate interest rate (positive number between 0 and 100)
  export const isValidInterestRate = (rate) => {
    const numRate = parseFloat(rate);
    return !isNaN(numRate) && numRate > 0 && numRate <= 100;
  };
  
  // Validate tenure (positive integer)
  export const isValidTenure = (tenure) => {
    const numTenure = parseInt(tenure, 10);
    return !isNaN(numTenure) && numTenure > 0 && Number.isInteger(numTenure);
  };
  
  // Validate date format and ensure it's a future date
  export const isValidFutureDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date instanceof Date && !isNaN(date) && date >= today;
  };