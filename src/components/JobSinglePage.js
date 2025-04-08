import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API_URL from '../api';

const JobSinglePage = () => {
  const { id } = useParams(); // Get the job ID from the URL
  const [job, setJob] = useState(null); // Job details
  const [tutorProfiles, setTutorProfiles] = useState([]); // Tutor profiles for the logged-in user
  const [selectedTutor, setSelectedTutor] = useState(''); // Selected tutor profile for applying
  const [message, setMessage] = useState(''); // Success/error message
  const [loading, setLoading] = useState(true); // Loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Check if user is logged in

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch job details and tutor profiles when the component mounts
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/jobs/${id}`);
        if (response.ok) {
          const data = await response.json();
          setJob(data);
        } else {
          console.error("Failed to fetch job details");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    const fetchTutors = async () => {
  try {
    const response = await fetch(`${API_URL}/api/tutor-profiles`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Failed to fetch tutors (Status: ${response.status})`
      );
    }

    const data = await response.json();
    const loggedInUserId = Number(localStorage.getItem('user_id'));

    // Safely filter profiles with type checking
    const userProfiles = data.filter(tutor => 
      tutor?.user_id === loggedInUserId
    );

    setTutorProfiles(userProfiles);
    console.log('Fetched tutor profiles:', userProfiles);

  } catch (error) {
    console.error('Error fetching tutor profiles:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    // Optionally set error state:
    // setError(error.message);
  } finally {
    setLoading(false);
  }
};

    fetchJobDetails();
    if (isLoggedIn) {
      fetchTutors();
    } else {
      setLoading(false); // Stop loading if user is not logged in
    }
  }, [id, isLoggedIn]);

  // Handle applying for the job
  const handleApplyForJob = async () => {
    if (!isLoggedIn) {
      alert("Please sign in to apply for this job.");
      return;
    }

    if (!selectedTutor) {
      alert("Please select a tutor profile before applying.");
      return;
    }

    try {
      const userId = localStorage.getItem('user_id'); // Current user applying
      const jobOwnerId = job.user_id; // Owner of the job (created_by)

      const response = await fetch(`${API_URL}/api/apply-jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          job_id: id, // The job being applied for
          tutor_profile_id: selectedTutor, // The selected tutor profile
          created_by: jobOwnerId, // The job owner
          applied_by: userId, // The current user applying
        }),
      });

      if (response.ok) {
        setMessage("Job application submitted successfully!");
      } else {
        setMessage("Failed to submit job application.");
      }
    } catch (error) {
      console.error("Error submitting job application:", error);
      setMessage("Error occurred while submitting job application.");
    }
  };

  // If job details are still loading, show loading message
  if (!job || loading) return <div>Loading...</div>;

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              
              {/* Job Header */}
              <div className="text-center mb-4">
                <h1 >{job.job_title}</h1>
                <p className="text-muted">
                  Posted on {new Date(job.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Job Details - 2 column layout */}
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Learner Name:</strong> {job.learner_name || 'Not specified'}</p>
                  <p><strong>Learner Gender:</strong> {job.learner_gender || 'Not specified'}</p>
                  <p><strong>Location:</strong> {job.location || 'Not specified'}</p>
                  <p><strong>Address:</strong> {job.address || 'Not specified'}</p>
                  <p><strong>Tutoring Mode:</strong> {job.tutoring_mode || 'Not specified'}</p>
                </div>

                <div className="col-md-6">
                  <p><strong>Qualifications Required:</strong> {job.wanted_tutor_qualification || 'Not specified'}</p>
                  <p><strong>Hours Per Week:</strong> {job.hours_per_week || 'Not specified'}</p>
                  <p><strong>Salary Rate:</strong> Ks {job.salary_rate ? Number(job.salary_rate).toFixed(2) : 'Not specified'}</p>
                  <p><strong>Start Date:</strong> {job.start_date ? new Date(job.start_date).toLocaleDateString() : 'Not specified'}</p>
                </div>
              </div>

              {/* Full-width sections */}
              <div className="mt-3">
                <p><strong>Description:</strong></p>
                <div className="mt-2 p-3 bg-light rounded">
                  {job.description || 'No description provided'}
                </div>
              </div>

              {job.special_request && (
                <div className="mt-3">
                  <p><strong>Special Request:</strong></p>
                  <div className="mt-2 p-3 bg-light rounded">
                    {job.special_request}
                  </div>
                </div>
              )}

              {/* Application Section */}
              <div className="mt-4 pt-3 border-top">
                {isLoggedIn ? (
                  <>
                    <h4 className="mb-3">Apply for This Job</h4>
                    <div className="mb-3">
                      <label className="form-label">Select your tutor profile</label>
                      <select 
                        className="form-select"
                        value={selectedTutor} 
                        onChange={(e) => setSelectedTutor(e.target.value)}
                      >
                        <option value="">Choose a profile...</option>
                        {tutorProfiles.map((tutor) => (
                          <option key={tutor.id} value={tutor.id}>
                            {tutor.name} ({tutor.subjects})
                          </option>
                        ))}
                      </select>
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={handleApplyForJob}
                      disabled={!selectedTutor}
                    >
                      Submit Application
                    </button>
                  </>
                ) : (
                  <div className="alert alert-info">
                    Please <a href="/sign-in" className="alert-link">sign in</a> to apply for this job.
                  </div>
                )}

                {message && (
                  <div className={`alert mt-3 ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSinglePage;