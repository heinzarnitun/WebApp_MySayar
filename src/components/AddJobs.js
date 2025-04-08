import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../api';

const AddJobs = () => {
  const [formData, setFormData] = useState({
    user_id: '', // Placeholder for the user ID
    job_title: '',
    description: '',
    learner_name: '',
    learner_gender: '',
    location: '',
    address: '',
    tutoring_mode: '',
    wanted_tutor_qualification: '',
    hours_per_week: '',
    salary_rate: '',
    start_date: '',
    special_request: ''
  });

  const [notification, setNotification] = useState({ message: '', color: '' });
  const navigate = useNavigate();

  // Assuming you are storing the current user's ID in localStorage, sessionStorage, or context
  useEffect(() => {
    const currentUserId = localStorage.getItem('user_id'); // Example, replace as needed
    if (currentUserId) {
      setFormData((prevData) => ({ ...prevData, user_id: currentUserId }));
    } else {
      // Handle case when no user ID is available
      setNotification({ message: 'User not logged in.', color: 'red' });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure user_id is set
    if (!formData.user_id) {
      setNotification({ message: 'User ID is missing.', color: 'red' });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/jobs`, formData);
    
        setNotification({ message: 'Job added successfully!', color: 'green' });
         setTimeout(() => {
        setNotification({ message: '', color: '' });
      }, 2000); 
        
      
    } catch (error) {
      console.error('Error adding job:', error);
      setNotification({ message: 'Failed to add job. Please check your data.', color: 'red' });
    }
  };

  return (
   <div className="container mt-4">
  <h3>Add a New Job</h3>
  {notification.message && (
    <div style={{ backgroundColor: notification.color, color: 'white', padding: '10px', textAlign: 'center' }}>
      {notification.message}
    </div>
  )}
  <form onSubmit={handleSubmit} className="form-group">
    <div className="mb-3">
      <input
        type="text"
        name="job_title"
        value={formData.job_title}
        onChange={handleInputChange}
        placeholder="Job Title"
        required
        className="form-control"
      />
    </div>

    <div className="mb-3">
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Job Description"
        required
        className="form-control"
      />
    </div>

    <div className="mb-3">
      <input
        type="text"
        name="learner_name"
        value={formData.learner_name}
        onChange={handleInputChange}
        placeholder="Learner Name"
        required
        className="form-control"
      />
    </div>

    <div className="mb-3">
      <select
        name="learner_gender"
        value={formData.learner_gender}
        onChange={handleInputChange}
        required
        className="form-select"
      >
      <option value="" disabled>Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div className="mb-3">
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleInputChange}
        placeholder="Location"
        required
        className="form-control"
      />
    </div>

    <div className="mb-3">
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="Address"
        required
        className="form-control"
      />
    </div>

    <div className="mb-3">
      <select
        name="tutoring_mode"
        value={formData.tutoring_mode}
        onChange={handleInputChange}
        required
        className="form-select"
      >
      <option value="" disabled>Select Tutoring Mode:</option>
        <option value="online">Online</option>
        <option value="in-person">In-person</option>
        <option value="Both">Both</option>
      </select>
    </div>

    <div className="mb-3">
      <input
        type="text"
        name="wanted_tutor_qualification"
        value={formData.wanted_tutor_qualification}
        onChange={handleInputChange}
        placeholder="Wanted Tutor Qualification"
        required
        className="form-control"
      />
    </div>

    <div className="mb-3">
      <input
        type="number"
        name="hours_per_week"
        value={formData.hours_per_week}
        onChange={handleInputChange}
        placeholder="Hours Per Week"
        required
        className="form-control"
      />
    </div>

    <div className="mb-3">
      <input
        type="number"
        name="salary_rate"
        value={formData.salary_rate}
        onChange={handleInputChange}
        placeholder="Salary Rate (Ks)"
        required
        className="form-control"
      />
    </div>

    <div className="mb-3">
      <input
        type="date"
        name="start_date"
        value={formData.start_date}
        onChange={handleInputChange}
        required
        className="form-control"
      />
    </div>

    <div className="mb-3">
      <textarea
        name="special_request"
        value={formData.special_request}
        onChange={handleInputChange}
        placeholder="Special Request (Optional)"
        className="form-control"
      />
    </div>

    <button type="submit" className="btn btn-primary">Add Job</button>
  </form>
</div>

  );
};

export default AddJobs;
