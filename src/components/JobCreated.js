import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import API_URL from '../api';

const JobCreated = () => {
    const [applications, setApplications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTutorProfile, setSelectedTutorProfile] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
  try {
    const userId = localStorage.getItem('user_id');
    const response = await axios.get(`${API_URL}/api/apply-jobs`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    });

    if (response.data) {
      const userApplications = response.data.filter(app => app.created_by == userId);
      setApplications(userApplications);
      console.log('Applications fetched successfully:', userApplications);
    }
  } catch (error) {
    console.error('Error fetching applications:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    // Optionally set error state if needed
    // setErrorState('Failed to load applications');
  }
};

        fetchApplications();
    }, []);

    const handleDecision = async (applicationId, status) => {
  try {
    console.log("Updating Application ID:", applicationId, "New Status:", status);
    
    const response = await fetch(`${API_URL}/api/apply-jobs/${applicationId}`, {
      method: 'POST', // Using POST with _method for Laravel
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ 
        status,
        _method: 'PUT'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Application update failed:', errorData.message || response.statusText);
      return;
    }

    const result = await response.json();
    console.log('Application update successful:', result);
    
    // Update local state
    setApplications(applications.map(application => 
      application.id === applicationId ? { ...application, status } : application
    ));

  } catch (error) {
    console.error('Network error updating application:', error);
  }
};

    const handleViewTutorProfile = (profile) => {
        setSelectedTutorProfile(profile);
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    // Separate applications by type
    const jobListings = applications.filter(app => app.type === 'apply');
    const jobOffers = applications.filter(app => app.type === 'offer');

    return (
        <div>
            {/* My Job Listings Table */}
            <h2>Tutor Applications</h2>
            {jobListings.length === 0 ? (
                <p>No job listings found.</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Applicant Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobListings.map((app) => (
                            <tr key={app.id}>
                                <td>{app.job?.job_title || 'N/A'}</td>
                                <td>{app.applicant?.name || 'N/A'}</td>
                                <td>{app.status}</td>
                                <td>
                                    <button 
                                        className="btn btn-info"
                                        onClick={() => handleViewTutorProfile(app.tutor_profile)}
                                    >
                                        View 
                                    </button>
                                    {app.status === 'new' && (
                                        <>
                                            <button 
                                                className="btn btn-success"
                                                onClick={() => handleDecision(app.id, 'accepted')}
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                className="btn btn-danger"
                                                onClick={() => handleDecision(app.id, 'rejected')}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {app.status === 'accepted' && (
                                        <>
                                            <button 
                                                className="btn btn-danger"
                                                onClick={() => handleDecision(app.id, 'rejected')}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {app.status === 'rejected' && (
                                        <>
                                            <button 
                                                className="btn btn-success"
                                                onClick={() => handleDecision(app.id, 'accepted')}
                                            >
                                                Accept
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* My Job Offers Table */}
            <h2>My Job Offers</h2>
            {jobOffers.length === 0 ? (
                <p>No job offers found.</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Applicant Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobOffers.map((app) => (
                            <tr key={app.id}>
                                <td>{app.job?.job_title || 'N/A'}</td>
                                <td>{app.applicant?.name || 'N/A'}</td>
                                <td>{app.status}</td>
                                <td>
                                    <button 
                                        className="btn btn-info"
                                        onClick={() => handleViewTutorProfile(app.tutor_profile)}
                                    >
                                        View 
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Bootstrap Modal for Viewing Tutor Profile */}
            {selectedTutorProfile && (
                <div 
                    className={`modal ${showModal ? 'show' : ''}`} 
                    tabIndex="-1" 
                    aria-labelledby="tutorProfileModalLabel" 
                    aria-hidden={!showModal}
                    style={{ display: showModal ? 'block' : 'none' }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="tutorProfileModalLabel">Tutor Profile</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    data-bs-dismiss="modal" 
                                    aria-label="Close" 
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
    <p><strong>Name:</strong> {selectedTutorProfile.name || 'N/A'}</p>
    <p><strong>Gender:</strong> {selectedTutorProfile.gender || 'N/A'}</p>
    <p><strong>Date of Birth:</strong> {selectedTutorProfile.date_of_birth ? new Date(selectedTutorProfile.date_of_birth).toLocaleDateString() : 'N/A'}</p>
    <p><strong>Location:</strong> {selectedTutorProfile.location || 'N/A'}</p>
    <p><strong>Hourly Rate:</strong> {selectedTutorProfile.hourly_rate ? `Ks ${selectedTutorProfile.hourly_rate}` : 'N/A'}</p>
    <p><strong>Experience:</strong> {selectedTutorProfile.experience ? `${selectedTutorProfile.experience} years` : 'N/A'}</p>
    <p><strong>Education Background:</strong> {selectedTutorProfile.education_background || 'N/A'}</p>
    <p><strong>Subjects:</strong> {selectedTutorProfile.subjects || 'N/A'}</p>
    <p><strong>Tutoring Mode:</strong> {selectedTutorProfile.tutoring_mode || 'N/A'}</p>
    <p><strong>Bio:</strong> {selectedTutorProfile.biography || 'N/A'}</p>
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

export default JobCreated;
