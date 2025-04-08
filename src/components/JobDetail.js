import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_URL from '../api';

const JobDetail = ({ job }) => {
  const [formData, setFormData] = useState(job);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationColor, setNotificationColor] = useState("green");
  
  const modalRef = useRef(null);
  const modalInstance = useRef(null);

  useEffect(() => {
    // Initialize the modal when component mounts
    if (modalRef.current) {
      modalInstance.current = new window.bootstrap.Modal(modalRef.current);
    }
    
    return () => {
      // Clean up the modal instance when component unmounts
      if (modalInstance.current) {
        modalInstance.current.dispose();
      }
    };
  }, []);

  const showModal = () => {
    if (modalInstance.current) {
      modalInstance.current.show();
    }
  };

  const hideModal = () => {
    if (modalInstance.current) {
      modalInstance.current.hide();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/jobs/${formData.id}`,
      { _method: 'DELETE' },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status === 200) {
      setNotificationMessage('Job deleted successfully!');
      setNotificationColor("green");
      setShowNotification(true);
      setShowDeleteConfirmation(false);
      
      setTimeout(() => {
        setShowNotification(false);
        window.location.reload();
      }, 2000);
    } else {
      throw new Error('Failed to delete job');
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    setNotificationMessage(
      error.response?.data?.message || 
      error.message || 
      'Error deleting job'
    );
    setNotificationColor("red");
    setShowNotification(true);
    setShowDeleteConfirmation(false);
  }
};

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

    const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      
      // Append all job data to formData
      Object.keys(formData).forEach(key => {
        // Skip null or undefined values
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // For Laravel API, we need to specify PUT method using _method parameter
      formDataToSend.append('_method', 'PUT');

      const response = await fetch(`${API_URL}/api/jobs/${formData.id}`, {
        method: 'POST', // Laravel expects POST when using FormData with _method
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Server responded with ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log('Update successful:', result);

      setNotificationMessage("Job updated successfully!");
      setNotificationColor("green");
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
        hideModal();
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error("Update failed:", error);
      setNotificationMessage(
        error.message.includes('Server responded')
          ? error.message
          : "Failed to update job. Please try again."
      );
      setNotificationColor("red");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };



  return (
    <div className="profile-job-item card mb-4">
      {showNotification && (
        <div className={`alert ${notificationColor === "red" ? "alert-danger" : "alert-success"} alert-dismissible fade show mb-3`}>
          {notificationMessage}
          <button type="button" className="btn-close" onClick={() => setShowNotification(false)}></button>
        </div>
      )}

      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex">
            <button 
              className="btn btn-sm btn-primary me-2" 
              onClick={showModal}
            >
              See More
            </button>
            <button className="btn btn-sm btn-danger" onClick={handleDeleteClick}>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      <div className="modal fade" id="jobDetailsModal" tabIndex="-1" aria-labelledby="jobDetailsModalLabel" aria-hidden="true" ref={modalRef}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="jobDetailsModalLabel">Edit Job Details</h5>
              <button type="button" className="btn-close" onClick={hideModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Job Title:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="job_title"
                      value={formData.job_title}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description:</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Learner Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="learner_name"
                      value={formData.learner_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Gender:</label>
                    <select
                      className="form-select"
                      name="learner_gender"
                      value={formData.learner_gender}
                      onChange={handleInputChange}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Location:</label>
  <select
  className="form-control"
  name="location"
  value={formData.location || ""}
  onChange={handleInputChange}
>
  <option value="">-- Select Location --</option>
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
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Address:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tutoring Mode:</label>
                    <select
                      className="form-select"
                      name="tutoring_mode"
                      value={formData.tutoring_mode}
                      onChange={handleInputChange}
                    >
                      <option value="online">Online</option>
                      <option value="in-person">In-person</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Wanted Tutor Qualification:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="wanted_tutor_qualification"
                      value={formData.wanted_tutor_qualification}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Hours Per Week:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="hours_per_week"
                      value={formData.hours_per_week}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Salary Rate (Ks):</label>
                    <input
                      type="number"
                      className="form-control"
                      name="salary_rate"
                      value={formData.salary_rate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Start Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Special Request:</label>
                <textarea
                  className="form-control"
                  name="special_request"
                  rows="3"
                  value={formData.special_request}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={hideModal}>
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this job?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;