import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import API_URL from '../api';

const JobApplied = () => {
    const [applications, setApplications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/apply-jobs`, {
      params: { user_id: localStorage.getItem('user_id') }
    });
    setApplications(data.filter(app => app.type === 'apply'));
  } catch (error) {
    console.error('Fetch error:', error.response?.data || error.message);
  }
};

        fetchApplications();
    }, []);

    const handleViewMore = (job) => {
        setSelectedJob(job);
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    return (
        <div>
            <h2>My Job Applications</h2>
            {applications.length === 0 ? (
                <p>No applications found.</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Job Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td>{app.job?.job_title || 'N/A'}</td>
                                <td>{app.job?.location || 'N/A'}</td>
                                <td>{app.status}</td>
                                <td>
                                    <button 
                                        className="btn btn-info"
                                        onClick={() => handleViewMore(app.job)}
                                    >
                                        View More
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Bootstrap Modal for View More */}
            {selectedJob && (
                <div 
                    className={`modal ${showModal ? 'show' : ''}`} 
                    tabIndex="-1" 
                    aria-labelledby="exampleModalLabel" 
                    aria-hidden={!showModal}
                    style={{ display: showModal ? 'block' : 'none' }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Job Details</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    data-bs-dismiss="modal" 
                                    aria-label="Close" 
                                    onClick={closeModal}
                                ></button>
                            </div>
                           <div className="modal-body">
    <p><strong>Job Title:</strong> {selectedJob.job_title || 'N/A'}</p>
    <p><strong>Description:</strong> {selectedJob.description || 'N/A'}</p>
    <p><strong>Learner Name:</strong> {selectedJob.learner_name || 'N/A'}</p>
    <p><strong>Learner Gender:</strong> {selectedJob.learner_gender || 'N/A'}</p>
    <p><strong>Location:</strong> {selectedJob.location || 'N/A'}</p>
    <p><strong>Address:</strong> {selectedJob.address || 'N/A'}</p>
    <p><strong>Tutoring Mode:</strong> {selectedJob.tutoring_mode || 'N/A'}</p>
    <p><strong>Required Qualifications:</strong> {selectedJob.wanted_tutor_qualification || 'N/A'}</p>
    <p><strong>Hours Per Week:</strong> {selectedJob.hours_per_week || 'N/A'}</p>
    <p><strong>Salary Rate:</strong> {selectedJob.salary_rate ? ` Ks ${selectedJob.salary_rate}` : 'N/A'}</p>
    <p><strong>Start Date:</strong> {selectedJob.start_date || 'N/A'}</p>
    <p><strong>Special Requests:</strong> {selectedJob.special_request || 'N/A'}</p>
</div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobApplied;
