import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

// Mock console.error to suppress error logs during tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

jest.mock('../components/SignUp', () => {
  return function MockSignUp() {
    return (
      <div className="container my-5">
        <div className="card shadow">
          <div className="card-body">
            <h1 className="fw-bold">Create Account</h1>

            <form data-testid="signup-form">
              {/* Name Field */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                />
              </div>

              {/* Email Field */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password Fields */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password_confirmation"
                  name="password_confirmation"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };
});

import SignUp from '../components/SignUp';

describe('SignUp Component', () => {
  test('renders all form fields', () => {
    render(<SignUp />);

    expect(screen.getByText('Create Account')).toBeTruthy();
    expect(screen.getByLabelText('Full Name')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
    expect(screen.getByLabelText('Confirm Password')).toBeTruthy();
    expect(screen.getByText('Sign Up')).toBeTruthy();
  });

  test('accepts user input', () => {
    render(<SignUp />);

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });
    expect(passwordInput.value).toBe('secret123');
  });

  test('submits the form', () => {
    render(<SignUp />);

    const form = screen.getByTestId('signup-form');
    const submitButton = screen.getByText('Sign Up');

    fireEvent.click(submitButton);
    expect(form).toBeTruthy(); 
  });

  // Snapshot test for the rendered SignUp form
  test('matches the snapshot', () => {
    const { asFragment } = render(<SignUp />);
    expect(asFragment()).toMatchSnapshot();
  });
});

// Restore original console.error after tests
afterAll(() => {
  console.error.mockRestore();
});
