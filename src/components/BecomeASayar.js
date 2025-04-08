import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from '../api';

const BecomeASayar = () => {
  

    const [jobs, setJobs] = useState([]); // All jobs fetched from the API
    const [filteredJobs, setFilteredJobs] = useState([]); // Jobs after applying filters
    const [filters, setFilters] = useState({
        location: "",
        tutoring_mode: "",
        min_salary: "",
        max_salary: "",
        keyword: "",
    });
    const [currentPage, setCurrentPage] = useState(1); // Pagination state
    const [itemsPerPage] = useState(5); // Items per page
    const navigate = useNavigate();

    // Fetch all jobs when the component mounts
    useEffect(() => {
        fetchJobs();
    }, []);

    // Fetch jobs from the API
    const fetchJobs = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            console.log("User ID from localStorage:", userId);

            const response = await axios.get(`${API_URL}/api/search-jobs?user_id=${userId}`, {
                params: { user_id: userId }
            });
            setJobs(response.data);
            setFilteredJobs(response.data); // Initialize filteredJobs with all jobs
        } catch (error) {
            console.error("Error fetching jobs", error);
        }
    };

    // Apply live search filtering whenever filters change
    useEffect(() => {
        filterJobs();
    }, [filters, jobs]);

    // Filter jobs based on user input
    const filterJobs = () => {
        const { location, tutoring_mode, min_salary, max_salary, keyword } = filters;

        const filtered = jobs.filter((job) => {
            const locationMatch = location
                ? job.location.toLowerCase().includes(location.toLowerCase())
                : true;
            const tutoringModeMatch = tutoring_mode
                ? job.tutoring_mode.toLowerCase().includes(tutoring_mode.toLowerCase())
                : true;
            const minSalaryMatch = min_salary
                ? job.salary_rate >= parseInt(min_salary)
                : true;
            const maxSalaryMatch = max_salary
                ? job.salary_rate <= parseInt(max_salary)
                : true;
            const keywordMatch = keyword
                ? job.job_title.toLowerCase().includes(keyword.toLowerCase()) ||
                  job.description.toLowerCase().includes(keyword.toLowerCase())
                : true;

            return locationMatch && tutoringModeMatch && minSalaryMatch && maxSalaryMatch && keywordMatch;
        });

        setFilteredJobs(filtered);
        setCurrentPage(1); // Reset to the first page after filtering
    };

    // Handle filter input changes
    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Handle "See More" button click
    const handleSeeMore = (jobId) => {
        navigate(`/job/${jobId}`);
    };

    // Pagination functions
    const nextPage = () => {
        if (currentPage * itemsPerPage < filteredJobs.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Get the current page's jobs
    const currentJobs = filteredJobs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
  <div className="container py-4">
    {/* Page Header */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="mb-0">Finding Tutoring Jobs</h2>
    </div>

    {/* Filter Section */}
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-3">
            <select
              className="form-select"
              name="location"
              value={filters.location}
              onChange={handleChange}
            >
              <option value="">Select Location</option>
              <option value="Hakha">Hakha</option>
              <option value="Myitkyina">Myitkyina</option>
              <option value="Loikaw">Loikaw</option>
              <option value="Hpa-An">Hpa-An</option>
              <option value="Mawlamyine">Mawlamyine</option>
              <option value="Sittwe">Sittwe</option>
              <option value="Taunggyi">Taunggyi</option>
              <option value="Pathein">Pathein</option>
              <option value="Bago">Bago</option>
              <option value="Magway">Magway</option>
              <option value="Mandalay">Mandalay</option>
              <option value="Monywa">Monywa</option>
              <option value="Dawei">Dawei</option>
              <option value="Yangon">Yangon</option>
              <option value="NayPyiTaw">NayPyiTaw</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              name="tutoring_mode"
              value={filters.tutoring_mode}
              onChange={handleChange}
            >
              <option value="">All Modes</option>
              <option value="online">Online</option>
              <option value="in-person">In-person</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              name="min_salary"
              placeholder="Min Salary"
              value={filters.min_salary}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              name="max_salary"
              placeholder="Max Salary"
              value={filters.max_salary}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              name="keyword"
              placeholder="Search by keyword"
              value={filters.keyword}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Jobs Table */}
    <div className="card shadow-sm mb-4">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Mode</th>
                <th>Salary Rate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentJobs.length > 0 ? (
                currentJobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.job_title}</td>
                    <td>{job.location}</td>
                    <td>
                      <span className={`badge ${
                        job.tutoring_mode === 'online' ? 'bg-primary' : 
                        job.tutoring_mode === 'in-person' ? 'bg-success' : 'bg-info'
                      }`}>
                        {job.tutoring_mode}
                      </span>
                    </td>
                    <td>{job.salary_rate} ks</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleSeeMore(job.id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No jobs found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Pagination */}
    <div className="d-flex justify-content-between align-items-center">
      <div>
        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
        {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of{' '}
        {filteredJobs.length} jobs
      </div>
      <div className="btn-group">
        <button 
          className="btn btn-outline-secondary"
          onClick={prevPage} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button className="btn btn-outline-secondary disabled">
          Page {currentPage}
        </button>
        <button 
          className="btn btn-outline-secondary"
          onClick={nextPage} 
          disabled={currentPage * itemsPerPage >= filteredJobs.length}
        >
          Next
        </button>
      </div>
    </div>
  </div>
);
};

export default BecomeASayar;