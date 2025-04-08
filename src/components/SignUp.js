import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import axios from 'axios';
import API_URL from '../api';

const SignUp = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({}); // Store validation errors
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors before submission

    try {
      setSuccess('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/sign-in');
      }, 1000);
      // Fetch CSRF token before making a request
      await axios.get(`${API_URL}/sanctum/csrf-cookie`);

      // Call the register function from authService
      await register(userData);

       // Redirect after successful registration
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Set Laravel's validation error messages
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Registration failed: Server error' });
      }
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4 p-md-5">
              
              {/* Header */}
              <div className="text-center mb-4">
                <h1 className="fw-bold mb-3">Create Account</h1>
                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={userData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && (
                    <div className="invalid-feedback">
                      {errors.name[0]}
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    value={userData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email[0]}
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={userData.password}
                    onChange={handleChange}
                    required
                  />
                  {errors.password && (
                    <div className="invalid-feedback">
                      {errors.password[0]}
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="mb-4">
                  <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                    id="password_confirmation"
                    name="password_confirmation"
                    placeholder="••••••••"
                    value={userData.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                  {errors.password_confirmation && (
                    <div className="invalid-feedback">
                      {errors.password_confirmation[0]}
                    </div>
                  )}
                </div>

                {/* General Errors */}
                {errors.general && (
                  <div className="alert alert-danger mb-4" role="alert">
                    {errors.general}
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2 fw-bold"
                >
                  Sign Up
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-4 text-center">
                <p className="text-muted mb-0">
                  Already have an account? <a href="/sign-in" className="text-decoration-none">Sign in</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
