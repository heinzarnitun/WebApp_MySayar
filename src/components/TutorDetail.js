import React, { useState, useEffect, useRef } from 'react';
import DeleteConfirmation from './DeleteConfirmation';
import axios from 'axios';
import API_URL from '../api';

const TutorDetail = ({ type, imageUrl, title, tutor }) => {
  const [formData, setFormData] = useState({
    image: null
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editedTutor, setEditedTutor] = useState(tutor);
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

  // const handleConfirmDelete = async () => {
  //   try {
  //     const response = await axios.delete(`${API_URL}/api/tutor-profiles/${editedTutor.id}`);
      
  //     if (response.status === 200) {
  //       alert('Deleted');
  //       setShowDeleteConfirmation(false);
  //       window.location.reload();
  //     } else {
  //       alert('Failed to delete');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting tutor profile:', error);
  //     alert('Error deleting profile');
  //     setShowDeleteConfirmation(false);
  //   }
  // };

  const handleConfirmDelete = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/tutor-profiles/${editedTutor.id}`,
      { _method: 'DELETE' },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Add if using auth
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status === 200) {
      alert('Deleted successfully');
      setShowDeleteConfirmation(false);
      window.location.reload();
    } else {
      alert('Failed to delete');
    }
  } catch (error) {
    console.error('Error deleting tutor profile:', error);
    alert(error.response?.data?.message || 'Error deleting profile');
    setShowDeleteConfirmation(false);
  }
};

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    let updatedValues = editedTutor[name].split(',').filter(Boolean);

    if (checked) {
      updatedValues.push(value);
    } else {
      updatedValues = updatedValues.filter((item) => item !== value);
    }

    setEditedTutor({
      ...editedTutor,
      [name]: updatedValues.join(','),
    });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      
      Object.keys(editedTutor).forEach((key) => {
        formData.append(key, editedTutor[key]);
      });

      if (formData.image) {
        formData.append('image', formData.image);
      }

      const response = await fetch(`${API_URL}/api/tutor-profiles/${editedTutor.id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to update tutor information');
      }

      const result = await response.json();
      console.log('Success response:', result);

      setNotificationMessage("Tutor information updated successfully!");
      setNotificationColor("green");
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
        window.location.reload();
      }, 2000);

      hideModal();
    } catch (error) {
      console.error("Error updating tutor:", error);
      setNotificationMessage(error.message || "Failed to update tutor information.");
      setNotificationColor("red");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setEditedTutor({
        ...editedTutor,
        image: files[0],
      });
    } else {
      setEditedTutor({
        ...editedTutor,
        [name]: value,
      });
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
      <div className="modal fade" id="tutorDetailsModal" tabIndex="-1" aria-labelledby="tutorDetailsModalLabel" aria-hidden="true" ref={modalRef}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="tutorDetailsModalLabel">Edit Tutor Details</h5>
              <button type="button" className="btn-close" onClick={hideModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={editedTutor.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Gender:</label>
                    <select
                      className="form-select"
                      name="gender"
                      value={editedTutor.gender}
                      onChange={handleInputChange}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Biography:</label>
                    <textarea
                      className="form-control"
                      name="biography"
                      rows="3"
                      value={editedTutor.biography}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Subjects:</label>
                    <div className="row row-cols-2 g-2">
                      {[
  "Myanmar", "English", "Math", "Science", "Bio", "Chemistry",
  "Geography", "History", "ICT", "Computer Science", "Programming",
  "Business", "Accounting", "Economy", "Medicine", "Engineering"
].map((subject) => (
                        <div key={subject} className="col">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="subjects"
                              value={subject}
                              checked={editedTutor.subjects.split(',').includes(subject)}
                              onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label">
                              {subject.charAt(0).toUpperCase() + subject.slice(1)}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Hourly Rate (Ks):</label>
                    <input
                      type="number"
                      className="form-control"
                      name="hourly_rate"
                      value={editedTutor.hourly_rate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Location:</label>
                    <select
  className="form-select"
  name="location"
  value={editedTutor.location || ""}
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

                  <div className="mb-3">
                    <label className="form-label">Tutoring Mode:</label>
                    <div className="row row-cols-2 g-2">
                      {['Online', 'In-person', 'Both'].map((mode) => (
                        <div key={mode} className="col">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="tutoring_mode"
                              value={mode}
                              checked={editedTutor.tutoring_mode.split(',').includes(mode)}
                              onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label">
                              {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Experience (in years):</label>
                    <input
                      type="number"
                      className="form-control"
                      name="experience"
                      value={editedTutor.experience}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Education Background:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="education_background"
                      value={editedTutor.education_background}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Profile Image:</label>
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
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

export default TutorDetail;