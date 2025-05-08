/**
 * Utility functions for loan calculations
 */

// Format currency to Indian Rupees format
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Generate CSV content from EMI schedule
export const exportToCSV = (emiSchedule, loanSummary) => {
  // CSV Headers
  const headers = [
    'Payment No.',
    'Payment Date',
    'EMI Amount',
    'Principal Component',
    'Interest Component',
    'Outstanding Principal'
  ].join(',');

  // CSV Rows
  const rows = emiSchedule.map((item, index) => [
    index + 1,
    item.date,
    item.totalInstallment,
    item.principalComponent,
    item.interestComponent,
    item.outstandingPrincipal
  ].join(','));

  // Summary section
  const summary = [
    '',
    'Loan Summary',
    `Principal Amount,${loanSummary.principal}`,
    `Total Interest,${loanSummary.interest}`,
    `Total Amount,${loanSummary.totalAmount}`,
    `Disbursement Date,${loanSummary.disbursementDate}`,
    `EMI Per Payment,${loanSummary.emiPerPayment}`
  ];

  // Combine all parts
  return [headers, ...rows, '', ...summary].join('\n');
};