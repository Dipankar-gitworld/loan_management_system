exports.generateEmiSchedule = (loanAmount, interestRate, tenureInMonths, disbursementDate, repaymentDaysInMonth) => {
  // Validate all inputs are present
  if (!loanAmount || !interestRate || !tenureInMonths || !disbursementDate || !repaymentDaysInMonth) {
    throw new Error('All parameters are required');
  }

  // Validate numeric inputs
  if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(tenureInMonths)) {
    throw new Error('Loan amount, interest rate, and tenure must be valid numbers');
  }

  // Validate positive numbers
  if (loanAmount <= 0 || interestRate <= 0 || tenureInMonths <= 0) {
    throw new Error('Loan amount, interest rate, and tenure must be greater than 0');
  }

  // Validate array input
  if (!Array.isArray(repaymentDaysInMonth) || repaymentDaysInMonth.length === 0) {
    throw new Error('Repayment days must be a non-empty array');
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(disbursementDate)) {
    throw new Error('Disbursement date must be in YYYY-MM-DD format');
  }

  // Remove duplicates and invalid days, then sort
  const sortedRepaymentDays = [...new Set(repaymentDaysInMonth)]
    .map(day => parseInt(day))
    .filter(day => !isNaN(day) && day >= 1 && day <= 31)
    .sort((a, b) => a - b);

  // Validate at least one valid repayment day remains
  if (sortedRepaymentDays.length === 0) {
    throw new Error('At least one valid repayment day (1-31) is required');
  }

  // Validate maximum tenure (e.g., 30 years)
  const MAX_TENURE_MONTHS = 360;
  if (tenureInMonths > MAX_TENURE_MONTHS) {
    throw new Error(`Tenure cannot exceed ${MAX_TENURE_MONTHS} months`);
  }

  // Validate maximum loan amount (e.g., 1 billion)
  const MAX_LOAN_AMOUNT = 1000000000;
  if (loanAmount > MAX_LOAN_AMOUNT) {
    throw new Error(`Loan amount cannot exceed ${MAX_LOAN_AMOUNT}`);
  }

  // Validate interest rate range
  if (interestRate > 100) {
    throw new Error('Interest rate cannot exceed 100%');
  }

  const SI = Math.ceil((loanAmount * interestRate * (tenureInMonths / 12)) / 100);
  const totalRepayable = loanAmount + SI;
  const totalInstallments = tenureInMonths * sortedRepaymentDays.length;

  // Round to whole numbers using Math.ceil
  const perInstallmentPrincipal = Math.floor(loanAmount / totalInstallments);
  const perInstallmentInterest = Math.floor(SI / totalInstallments);
  const perInstallmentAmount = perInstallmentPrincipal + perInstallmentInterest;

  // Calculate adjustments for last EMI (ensure whole numbers)
  const totalPrincipalAdjustment = Math.ceil(loanAmount - (perInstallmentPrincipal * (totalInstallments - 1)));
  const totalInterestAdjustment = Math.ceil(SI - (perInstallmentInterest * (totalInstallments - 1)));
  
  const schedule = [];
  
  try {
    // Create UTC date from disbursement date string
    const [year, month, day] = disbursementDate.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, day)); // month is 0-based in JavaScript

    // Validate disbursement date is not invalid
    if (isNaN(startDate.getTime())) {
      throw new Error('Invalid disbursement date');
    }

    // Validate disbursement date is not too far in the past or future
    const now = new Date();
    const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
    const fiveYearsFromNow = new Date(now.setFullYear(now.getFullYear() + 6));
    
    if (startDate < oneYearAgo || startDate > fiveYearsFromNow) {
      throw new Error('Disbursement date must be within 1 year past and 5 years future');
    }

    let outstandingPrincipal = loanAmount;
    let remainingInterest = SI;

    // Get next month after disbursement
    const nextMonth = startDate.getUTCMonth() + 1;
    const nextMonthYear = startDate.getUTCFullYear() + (nextMonth > 11 ? 1 : 0);
    const startMonth = nextMonth > 11 ? 0 : nextMonth;
    const startYear = nextMonthYear;

    // Generate schedule
    for (let i = 0; i < tenureInMonths; i++) {
      const currentMonth = (startMonth + i) % 12;
      const currentYear = startYear + Math.floor((startMonth + i) / 12);

      for (const day of sortedRepaymentDays) {
        const lastDayOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0)).getUTCDate();
        const actualDay = Math.min(day, lastDayOfMonth);
        
        const repaymentDate = new Date(Date.UTC(currentYear, currentMonth, actualDay));

        if (outstandingPrincipal > 0) {
          // Check if this is the last EMI
          const isLastEMI = schedule.length === totalInstallments - 1;

          let principalComponent = isLastEMI 
            ? totalPrincipalAdjustment  // Use ceiling adjusted principal for last EMI
            : perInstallmentPrincipal;

          let interestComponent = isLastEMI
            ? totalInterestAdjustment  // Use ceiling adjusted interest for last EMI
            : perInstallmentInterest;

          const installmentAmount = principalComponent + interestComponent;

          outstandingPrincipal = Math.max(0, outstandingPrincipal - principalComponent);
          remainingInterest = Math.max(0, remainingInterest - interestComponent);

          schedule.push({
            date: repaymentDate.toISOString().split('T')[0],
            totalInstallment: Math.ceil(installmentAmount),  // Ensure whole number
            principalComponent: Math.ceil(principalComponent),  // Ensure whole number
            interestComponent: Math.ceil(interestComponent),  // Ensure whole number
            outstandingPrincipal: Math.ceil(outstandingPrincipal)  // Ensure whole number
          });
        }
      }
    }
  } catch (error) {
    throw new Error(`Error generating EMI schedule: ${error.message}`);
  }

  // Validate schedule was generated
  if (schedule.length === 0) {
    throw new Error('No valid repayment dates could be generated');
  }

  return {
    loanAmount,
    interest: Math.ceil(SI),  // Ensure whole number
    totalRepayable: Math.ceil(totalRepayable),  // Ensure whole number
    totalInstallments,
    perInstallmentAmount: Math.ceil(perInstallmentAmount),  // Ensure whole number
    schedule: schedule.sort((a, b) => new Date(a.date) - new Date(b.date))
  };
};
  