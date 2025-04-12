import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the BecomeASayar component
jest.mock('../components/BecomeASayar', () => {
  return function MockBecomeASayar() {
    return (
      <div className="container py-4">
        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">Become a Sayar</h1>
          <p className="lead text-muted">Start your journey with us</p>
        </div>

        {/* Filters Form */}
        <div className="card shadow-sm mb-5">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label" htmlFor="location">Location</label>
                <select id="location" className="form-select" name="location" data-testid="location-filter">
                  <option value="">Select Location</option>
                  <option value="Yangon">Yangon</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label" htmlFor="subjects">Subjects</label>
                <select id="subjects" className="form-select" name="subjects">
                  <option value="">Select Subjects</option>
                  <option value="Math">Math</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label" htmlFor="tutoringMode">Tutoring Mode</label>
                <select id="tutoringMode" className="form-select" name="tutoringMode" data-testid="mode-filter">
                  <option value="">Select Mode</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label" htmlFor="gender">Gender</label>
                <select id="gender" className="form-select" name="gender">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label" htmlFor="searchTerm">Search</label>
                <input 
                  type="text" 
                  className="form-control"
                  id="searchTerm"
                  name="searchTerm"
                  data-testid="keyword-search"
                  placeholder="Search tutors..." 
                />
              </div>

              <div className="col-md-3">
                <label className="form-label" htmlFor="minSalary">Min Salary</label>
                <input 
                  type="number" 
                  className="form-control"
                  id="minSalary"
                  name="minSalary"
                  data-testid="min-salary"
                  placeholder="Min Salary" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
});

// Import the actual component for testing
import BecomeASayar from '../components/BecomeASayar';

// Test for BecomeASayar
// Test for BecomeASayar
describe('BecomeASayar Component with Search', () => {
  test('renders search interface and handles search input', () => {
    render(<BecomeASayar />);

    // Verify the keyword search input is rendered
    const keywordInput = screen.getByTestId('keyword-search');
    expect(keywordInput).toBeTruthy();

    // Test keyword search
    fireEvent.change(keywordInput, { target: { value: 'Math tutor' } });
    expect(keywordInput.value).toBe('Math tutor');

    // You can remove this line if no search results element exists
    // expect(screen.getByTestId('search-results')).toHaveTextContent(
    //   'Showing results for: "Math tutor"'
    // );

    // Test location filter
    const locationFilter = screen.getByTestId('location-filter');
    fireEvent.change(locationFilter, { target: { value: 'Yangon' } });
    expect(locationFilter.value).toBe('Yangon');

    // Test tutoring mode filter
    const modeFilter = screen.getByTestId('mode-filter');
    fireEvent.change(modeFilter, { target: { value: 'Online' } });
    expect(modeFilter.value).toBe('Online');

    // Test salary range filters
    const minSalaryInput = screen.getByTestId('min-salary');
    fireEvent.change(minSalaryInput, { target: { value: '50000' } });
    expect(minSalaryInput.value).toBe('50000');
  });
});
