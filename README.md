# Loan Management System

A full-stack application to manage personal loan onboarding, EMI calculation, and ledger tracking. Users can enter loan-related data, select multiple repayment days, and generate a clear EMI schedule.

---

## Features

### Onboarding
- Personal information form with validations:
  - Name
  - Date of Birth (18+ validation)
  - PAN number format validation (e.g., AAAAA1234A)
  - Aadhaar number (12-digit check)
  - GSTIN format validation (e.g., 22AAAAA0000A1Z5)
  - UDYAM registration number (e.g., UDYAM-XX-XX-XXXXXXX)

### Loan Input
- Select disbursement date (today or future)
- Enter loan amount
- Set interest rate (% per annum)
- Choose loan tenure (in months)
- Support for multiple repayment days in a month (e.g., 5th and 20th)

### EMI Schedule & Ledger View
- EMI breakup: interest vs principal
- Outstanding principal tracking
- Highlight next payment date
- Export to CSV option

---

## Tech Stack

### Frontend
- React.js
- React Router (for page navigation)
- Context API (for shared state)
- Modern JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- CORS for API access

---

## Prerequisites

- Node.js v14+
- npm v6+

---

## Installation & Running the Application

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/loan-management-system.git
cd loan-management-system
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 4. Run the Backend Server
```bash
cd ../server
npm run dev
```
Runs on http://localhost:5000

### 5. Run the Frontend App
```bash
cd ../client
npm start
```
Opens on http://localhost:3000

## API Endpoints

### POST /api/loan/calculate-emi
Calculates EMI based on loan inputs.

**Request**
```json
{
  "loanAmount": 100000,
  "interestRate": 10,
  "tenureInMonths": 12,
  "disbursementDate": "2024-03-15",
  "repaymentDaysInMonth": [5, 20]
}
```

**Response**
```json
{
  "loanAmount": 100000,
  "interest": 10000,
  "totalRepayable": 110000,
  "totalInstallments": 24,
  "perInstallmentAmount": 4583,
  "schedule": [
    {
      "date": "2024-04-05",
      "totalInstallment": 4583,
      "principalComponent": 4167,
      "interestComponent": 416,
      "outstandingPrincipal": 95833
    }
    // ... more installments
  ]
}
```

## Validation Rules

### Personal Information
- Name: Required
- DOB: Must be 18+ years
- PAN: Format AAAAA1234A
- Aadhaar: 12-digit numeric
- GSTIN: Format 22AAAAA0000A1Z5
- UDYAM: Format UDYAM-XX-XX-XXXXXXX

### Loan Details
- Disbursement Date: Must be today or in future
- Loan Amount: Must be positive number
- Interest Rate: Between 0–100%
- Tenure: Positive integer (in months)
- Repayment Days: Valid days between 1–31

