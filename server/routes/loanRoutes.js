const express = require('express');
const router = express.Router();
const { calculateEMISchedule } = require('../controllers/loanController');

router.post('/calculate-emi', calculateEMISchedule);

module.exports = router;
