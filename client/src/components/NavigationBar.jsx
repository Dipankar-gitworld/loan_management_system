import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Loan<span>Manager</span>
        </Link>
      </div>
    </nav>
  );
};

export default NavigationBar;