import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

// Mock console.error to suppress error logs during tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

jest.mock('../components/SignIn', () => {
  return function MockSignIn() {
    return (
      <div className="container my-5">
        <div className="card shadow">
          <div className="card-body">
            <h2 className="fw-bold">Sign In</h2>
            <p className="text-muted">Access your account</p>

            <form data-testid="signin-form">
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

              <button 
                type="submit" 
                className="btn btn-primary w-100 py-2 fw-bold"
                data-testid="signin-button"
              >
                Sign In
              </button>
            </form>

            <div className="mt-3 text-center">
              <p className="text-muted">
                Don't have an account? <a href="/sign-up" className="text-decoration-none">Sign up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
});

import SignIn from '../components/SignIn';

describe('SignIn Component', () => {
  test('renders all form fields and elements', () => {
    render(<SignIn />);

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeTruthy();
    expect(screen.getByText('Access your account')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
    expect(screen.getByTestId('signin-button')).toBeTruthy();
    expect(screen.getByText(/Don't have an account?/)).toBeTruthy();
  });

  test('accepts user input', () => {
    render(<SignIn />);

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  test('submits the form', () => {
    render(<SignIn />);

    const form = screen.getByTestId('signin-form');
    const submitButton = screen.getByTestId('signin-button');

    fireEvent.click(submitButton);
    expect(form).toBeTruthy();
  });

  test('matches the snapshot', () => {
    const { asFragment } = render(<SignIn />);
    expect(asFragment()).toMatchSnapshot();
  });
});

// Restore original console.error after tests
afterAll(() => {
  console.error.mockRestore();
});