const { generateEmiSchedule } = require('../utils/emiCalculator');

exports.calculateEMISchedule = (req, res) => {
  try {
    const {
      loanAmount,
      interestRate,
      tenureInMonths,
      disbursementDate,
      repaymentDaysInMonth
    } = req.body;

    if (typeof loanAmount !== 'number' || 
        typeof interestRate !== 'number' || 
        typeof tenureInMonths !== 'number') {
      return res.status(400).json({ error: 'Invalid data types provided' });
    }

    if (!loanAmount || !interestRate || !tenureInMonths || !disbursementDate || !repaymentDaysInMonth) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = generateEmiSchedule(
      loanAmount,
      interestRate,
      tenureInMonths,
      disbursementDate,
      repaymentDaysInMonth
    );

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};
