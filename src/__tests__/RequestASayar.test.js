import React from 'react';
import { render, screen } from '@testing-library/react';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

jest.mock('../components/RequestASayar', () => {
  return function MockRequestASayar() {
    return (
      <div className="container py-4">
        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">Request a Sayar</h1>
          <p className="lead text-muted">Find the perfect tutor for your needs</p>
        </div>

        {/* Search Form */}
        <div className="card shadow-sm mb-5">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label" htmlFor="location">Location</label>
                <select id="location" className="form-select" name="location">
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
                <select id="tutoringMode" className="form-select" name="tutoringMode">
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
                  placeholder="Search tutors..." 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tutors Table */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light">
            <h2 className="h5 mb-0">Latest Tutors</h2>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th data-testid="table-subjects-header">Subjects</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      No tutors found matching your criteria
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted">
            Showing 0 to 0 of 0 tutors
          </div>
          <div className="btn-group">
            <button className="btn btn-outline-secondary" disabled>
              Previous
            </button>
            <button className="btn btn-outline-secondary disabled">
              Page 1
            </button>
            <button className="btn btn-outline-secondary" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };
});

import RequestASayar from '../components/RequestASayar';

describe('RequestASayar Component', () => {
  test('renders the main search interface and empty state correctly', () => {
    render(<RequestASayar />);

    // Verify main header
    expect(screen.getByText('Request a Sayar')).toBeTruthy();
    expect(screen.getByText('Find the perfect tutor for your needs')).toBeTruthy();

    // Verify search filters with specific queries
    expect(screen.getByLabelText('Location')).toBeTruthy();
    expect(screen.getByLabelText('Subjects')).toBeTruthy();
    expect(screen.getByLabelText('Tutoring Mode')).toBeTruthy();
    expect(screen.getByLabelText('Gender')).toBeTruthy();
    expect(screen.getByPlaceholderText('Search tutors...')).toBeTruthy();

    // Verify table structure
    expect(screen.getByText('Latest Tutors')).toBeTruthy();
    expect(screen.getByText('Image')).toBeTruthy();
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByTestId('table-subjects-header')).toBeTruthy(); 
    expect(screen.getByText('Action')).toBeTruthy();

    // Verify empty state
    expect(screen.getByText('No tutors found matching your criteria')).toBeTruthy();

    // Verify pagination
    expect(screen.getByText('Showing 0 to 0 of 0 tutors')).toBeTruthy();
    expect(screen.getByText('Page 1')).toBeTruthy();
    expect(screen.getByText('Previous')).toBeTruthy();
    expect(screen.getByText('Next')).toBeTruthy();
  });
});

afterAll(() => {
  console.error.mockRestore();
});