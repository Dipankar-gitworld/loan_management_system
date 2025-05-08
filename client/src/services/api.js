const API_BASE_URL = 'http://localhost:5000/api';

export const calculateEMISchedule = async (loanData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/loan/calculate-emi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loanAmount: Number(loanData.loanAmount),
        interestRate: Number(loanData.interestRate),
        tenureInMonths: Number(loanData.tenure),
        disbursementDate: loanData.disbursementDate,
        repaymentDaysInMonth: loanData.repaymentDates // Send the days directly
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to calculate EMI schedule');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}; 