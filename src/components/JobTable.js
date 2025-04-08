import React, { useState, useEffect } from 'react';
import JobDetail from './JobDetail';
import API_URL from '../api';

const JobTable = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
const loggedInUserId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchJobs = async () => {
    try {
        const response = await fetch(`${API_URL}/api/jobs`);
        const data = await response.json();

        // Filter the jobs by user ID for the logged-in user
        const filteredData = data.filter(job => job.user_id === parseInt(loggedInUserId));

        setJobs(filteredData);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
    }
};


    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
  <div className="container mt-4">
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h2 className="h4 mb-0">My Job Listings</h2>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th style={{ width: '120px' }}>Options</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="align-middle">{job.job_title}</td>
                    <td className="align-middle">{job.location}</td>
                    <td className="align-middle">
                      <JobDetail job={job} className="btn btn-sm btn-outline-primary" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-muted">
                    No job listings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
};

export default JobTable;
