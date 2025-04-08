import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating'; // Import the StarRating component
import API_URL from '../api';


// Function to fetch tutors from the backend
const fetchLatestTutors = async () => {
  try {
    const userId = localStorage.getItem('user_id'); // Get the logged-in user's ID

    // Fetch all tutors
    const response = await fetch(`${API_URL}/api/tutors/latest`);
    if (response.ok) {
      const tutors = await response.json();



      // If the user is logged in, filter out their own tutor profiles
      if (userId) {
        const filteredTutors = tutors.filter(tutor => tutor.user_id !== parseInt(userId));
        return filteredTutors;
      }

      // If the user is not logged in, return all tutors
      return tutors;
    }
    throw new Error('Failed to fetch tutors');
  } catch (error) {
    console.error(error);
    return [];
  }
};

const RequestASayar = () => {
  const [requestData, setRequestData] = useState({
    serviceType: '',
    location: '',
    subjects: '',
    tutoringMode: '',
    gender: '',
    searchTerm: '',
  });

  const [latestTutors, setLatestTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage] = useState(5); // Items per page state (you can adjust this number)
  const navigate = useNavigate();

  // Fetch latest tutors when the component mounts
  useEffect(() => {
    const loadTutors = async () => {
      const tutors = await fetchLatestTutors();
      setLatestTutors(tutors);
      setFilteredTutors(tutors);
    };
    loadTutors();
  }, []);

  const handleChange = (e) => {
    setRequestData({ ...requestData, [e.target.name]: e.target.value });
  };

  // Function to filter tutors based on user input
  useEffect(() => {
    const filterTutors = () => {
      const { tutoringMode, location, subjects, gender, searchTerm } = requestData;

      // Filter tutors based on the input fields
      const filtered = latestTutors.filter((tutor) => {
        // Ensure subjects is always an array
        const tutorSubjects = Array.isArray(tutor.subjects) ? tutor.subjects : tutor.subjects.split(', ');

        const tutoringModeMatch = tutoringMode
          ? tutor.tutoring_mode.toLowerCase().includes(tutoringMode.toLowerCase())
          : true;
        const locationMatch = location
          ? tutor.location.toLowerCase().includes(location.toLowerCase())
          : true;
        const subjectsMatch = subjects
          ? tutorSubjects.some(subject => subject.toLowerCase().includes(subjects.toLowerCase()))
          : true;
        const genderMatch = gender
      ? tutor.gender === gender.toLowerCase() // Exact match with lowercase
      : true;
        const searchMatch = searchTerm
          ? (
            (tutor.name && tutor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (tutor.gender && tutor.gender.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (tutor.bio && tutor.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (tutorSubjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))) ||
            (tutor.location && tutor.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (tutor.tutoring_mode && tutor.tutoring_mode.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (tutor.education_background && tutor.education_background.toLowerCase().includes(searchTerm.toLowerCase()))
          )
          : true;

        return tutoringModeMatch && locationMatch && subjectsMatch && genderMatch && searchMatch;
      });

      setFilteredTutors(filtered);
      setCurrentPage(1); // Reset to the first page whenever filters change
    };

    filterTutors();
  }, [requestData, latestTutors]);

  // Function to go to the next page
  const nextPage = () => {
    if (currentPage * itemsPerPage < filteredTutors.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to go to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle "See More" button click
  const handleSeeMore = (tutorId) => {
    navigate(`/tutor/${tutorId}`);
  };

  // Get the current page's tutors
  const currentTutors = filteredTutors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            <label className="form-label">Location</label>
            <select 
              className="form-select"
              name="location" 
              value={requestData.location} 
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

          <div className="col-md-3">
            <label className="form-label">Subjects</label>
            <select 
              className="form-select"
              name="subjects" 
              value={requestData.subjects} 
              onChange={handleChange}
            >
              <option value="">Select Subjects</option>
              <option value="Myanmar">Myanmar</option>
              <option value="English">English</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="Bio">Bio</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Geography">Geography</option>
              <option value="History">History</option>
              <option value="ICT">ICT</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Programming">Programming</option>
              <option value="Business">Business</option>
              <option value="Accounting">Accounting</option>
              <option value="Economy">Economy</option>
              <option value="Medicine">Medicine</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Tutoring Mode</label>
            <select 
              className="form-select"
              name="tutoringMode" 
              value={requestData.tutoringMode} 
              onChange={handleChange}
            >
              <option value="">Select Mode</option>
              <option value="Online">Online</option>
              <option value="In-person">In-person</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Gender</label>
            <select 
              className="form-select"
              name="gender" 
              value={requestData.gender} 
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Search</label>
            <input 
              type="text" 
              className="form-control"
              name="searchTerm" 
              value={requestData.searchTerm} 
              onChange={handleChange} 
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
                <th style={{width: '80px'}}>Image</th>
                <th>Name</th>
                <th>Subjects</th>
                <th>Location</th>
                <th>Experience</th>
                <th>Mode</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentTutors.length > 0 ? (
                currentTutors.map((tutor) => {
                  const tutorSubjects = Array.isArray(tutor.subjects) ? tutor.subjects : tutor.subjects.split(', ');
                  return (
                    <tr key={tutor.id}>
                      <td>
                        <img
                          src={`${API_URL}/storage/${tutor.image || 'tutor_images/default.jpg'}`}
                          alt={tutor.name}
                          className="rounded-circle"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </td>
                      <td className="align-middle">{tutor.name}</td>
                      <td className="align-middle">
                        <div className="d-flex flex-wrap gap-1">
                          {tutorSubjects.map((subject, index) => (
                            <span key={index} className="badge bg-primary-subtle text-primary">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="align-middle">{tutor.location}</td>
                      <td className="align-middle">{tutor.experience} years</td>
                      <td className="align-middle">
                        <span className={`badge ${
                          tutor.tutoring_mode === 'Online' ? 'bg-info' : 
                          tutor.tutoring_mode === 'In-person' ? 'bg-success' : 'bg-warning'
                        }`}>
                          {tutor.tutoring_mode}
                        </span>
                      </td>
                      <td className="align-middle">
                        <StarRating rating={tutor.avg_rating || 0} isEditable={false} />
                      </td>
                      <td className="align-middle">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleSeeMore(tutor.id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No tutors found matching your criteria
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
      <div className="text-muted">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
        {Math.min(currentPage * itemsPerPage, filteredTutors.length)} of{' '}
        {filteredTutors.length} tutors
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
          disabled={currentPage * itemsPerPage >= filteredTutors.length}
        >
          Next
        </button>
      </div>
    </div>
  </div>
);
};

export default RequestASayar;