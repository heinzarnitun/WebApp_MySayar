import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

import axios from 'axios';
import API_URL from '../api';

const SignIn = () => {
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); // To handle error messages
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');


  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    // Fetch CSRF token before login
    await axios.get(`${API_URL}/sanctum/csrf-cookie`);  

    // Send login request
    const response = await axios.post(`${API_URL}/api/login`, userData);

    // Log the response to see its structure
    console.log(response.data);

    // Check if response contains the expected properties
    if (response.data && response.data.token && response.data.user) {
      const userId = response.data.user.id;

      // Store token and userId in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user_id', userId);
      localStorage.setItem('username', response.data.user.name);
      console.log('Stored user_id:', localStorage.getItem('user_id'));

      setSuccess('Login successful! Redirecting...');

      // Redirect to dashboard after login
      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload();
      }, 1000);
    } else {
      setError('Login failed: Incorrect credentials or server error');
    }

  } catch (error) {
    setError('Login failed: Incorrect credentials or server error');
    console.error(error);  // Log error details for debugging
  }
};

 return (
    <div className="container mt-5  mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold">Sign In</h2>
                <p className="text-muted">Access your account</p>
              </div>

              {/* Messages */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2 fw-bold"
                >
                  Sign In
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-3 text-center">
                <p className="text-muted">
                  Don't have an account? <a href="/sign-up" className="text-decoration-none">Sign up</a>
                </p>
                <p className="small">
                
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
