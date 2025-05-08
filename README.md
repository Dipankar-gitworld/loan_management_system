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
git clone git@github.com:Dipankar-gitworld/loan_management_system.git
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
    "loanAmount": 10000,
    "interestRate": 10,
    "tenureInMonths": 10,
    "disbursementDate": "2025-05-08",
    "repaymentDaysInMonth": [
        1,
        12
    ]
}
```

**Response**
```json
{
    "loanAmount": 10000,
    "interest": 834,
    "totalRepayable": 10834,
    "totalInstallments": 20,
    "perInstallmentAmount": 541,
    "schedule": [
        {
            "date": "2025-06-01",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 9500
        },
        {
            "date": "2025-06-12",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 9000
        },
        {
            "date": "2025-07-01",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 8500
        },
        {
            "date": "2025-07-12",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 8000
        },
        {
            "date": "2025-08-01",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 7500
        },
        {
            "date": "2025-08-12",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 7000
        },
        {
            "date": "2025-09-01",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 6500
        },
        {
            "date": "2025-09-12",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 6000
        },
        {
            "date": "2025-10-01",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 5500
        },
        {
            "date": "2025-10-12",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 5000
        },
        {
            "date": "2025-11-01",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 4500
        },
        {
            "date": "2025-11-12",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 4000
        },
        {
            "date": "2025-12-01",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 3500
        },
        {
            "date": "2025-12-12",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 3000
        },
        {
            "date": "2026-01-01",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 2500
        },
        {
            "date": "2026-01-12",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 2000
        },
        {
            "date": "2026-02-01",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 1500
        },
        {
            "date": "2026-02-12",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 1000
        },
        {
            "date": "2026-03-01",
            "totalInstallment": 541,
            "principalComponent": 500,
            "interestComponent": 41,
            "outstandingPrincipal": 500
        },
        {
            "date": "2026-03-12",
            "totalInstallment": 555,
            "principalComponent": 500,
            "interestComponent": 55,
            "outstandingPrincipal": 0
        }
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

