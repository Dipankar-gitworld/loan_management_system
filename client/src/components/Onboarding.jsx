import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import { 
  isAdult, 
  isValidPAN, 
  isValidAadhar, 
  isValidGSTIN, 
  isValidUDYAM 
} from '../utils/validations';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { userData, updateUserData } = useLoan();
  
  // Form state
  const [formData, setFormData] = useState({
    name: userData.name || '',
    dob: userData.dob || '',
    pan: userData.pan || '',
    aadhar: userData.aadhar || '',
    gstin: userData.gstin || '',
    udyam: userData.udyam || ''
  });
  
  // Form errors state
  const [errors, setErrors] = useState({});
  
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
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate date of birth
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else if (!isAdult(formData.dob)) {
      newErrors.dob = 'You must be at least 18 years old';
    }
    
    // Validate PAN
    if (!formData.pan.trim()) {
      newErrors.pan = 'PAN is required';
    } else if (!isValidPAN(formData.pan)) {
      newErrors.pan = 'Invalid PAN format. It should be like AAAAA1234A';
    }
    
    // Validate Aadhar
    if (!formData.aadhar.trim()) {
      newErrors.aadhar = 'Aadhar number is required';
    } else if (!isValidAadhar(formData.aadhar)) {
      newErrors.aadhar = 'Invalid Aadhar format. It should be 12 digits';
    }
    
    // Validate GSTIN
    if (!formData.gstin.trim()) {
      newErrors.gstin = 'GSTIN is required';
    } else if (!isValidGSTIN(formData.gstin)) {
      newErrors.gstin = 'Invalid GSTIN format. It should be like 22AAAAA0000A1Z5';
    }
    
    // Validate UDYAM
    if (!formData.udyam.trim()) {
      newErrors.udyam = 'UDYAM is required';
    } else if (!isValidUDYAM(formData.udyam)) {
      newErrors.udyam = 'Invalid UDYAM format. It should be like UDYAM-XX-XX-XXXXXXX';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Update the user data in parent component
      updateUserData(formData);
      
      // Navigate to loan details page
      navigate('/loan-details');
    }
  };
  
  // Go back to home page
  const handleCancel = () => {
    navigate('/');
  };
  
  return (
    <div className="page-container">
      <h1 className="page-title">Personal Information</h1>
      
      <form onSubmit={handleSubmit} className="form-container">
        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            className="form-input" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Enter your full name"
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>
        
        {/* Date of Birth Field */}
        <div className="form-group">
          <label htmlFor="dob" className="form-label">Date of Birth</label>
          <input 
            type="date" 
            id="dob" 
            name="dob" 
            className="form-input" 
            value={formData.dob} 
            onChange={handleChange} 
          />
          {errors.dob && <p className="form-error">{errors.dob}</p>}
        </div>
        
        {/* PAN Field */}
        <div className="form-group">
          <label htmlFor="pan" className="form-label">PAN Number</label>
          <input 
            type="text" 
            id="pan" 
            name="pan" 
            className="form-input" 
            value={formData.pan} 
            onChange={handleChange} 
            placeholder="AAAAA1234A"
          />
          {errors.pan && <p className="form-error">{errors.pan}</p>}
        </div>
        
        {/* Aadhar Field */}
        <div className="form-group">
          <label htmlFor="aadhar" className="form-label">Aadhar Number</label>
          <input 
            type="text" 
            id="aadhar" 
            name="aadhar" 
            className="form-input" 
            value={formData.aadhar} 
            onChange={handleChange} 
            placeholder="12-digit Aadhar number"
          />
          {errors.aadhar && <p className="form-error">{errors.aadhar}</p>}
        </div>
        
        {/* GSTIN Field */}
        <div className="form-group">
          <label htmlFor="gstin" className="form-label">GSTIN</label>
          <input 
            type="text" 
            id="gstin" 
            name="gstin" 
            className="form-input" 
            value={formData.gstin} 
            onChange={handleChange} 
            placeholder="22AAAAA0000A1Z5"
          />
          {errors.gstin && <p className="form-error">{errors.gstin}</p>}
        </div>
        
        {/* UDYAM Field */}
        <div className="form-group">
          <label htmlFor="udyam" className="form-label">UDYAM Registration Number</label>
          <input 
            type="text" 
            id="udyam" 
            name="udyam" 
            className="form-input" 
            value={formData.udyam} 
            onChange={handleChange} 
            placeholder="UDYAM-XX-XX-XXXXXXX"
          />
          {errors.udyam && <p className="form-error">{errors.udyam}</p>}
        </div>
        
        {/* Form Buttons */}
        <div className="form-button-container">
          <button 
            type="button" 
            className="button button-secondary" 
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="button button-primary"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingPage;