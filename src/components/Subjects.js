import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StarRating from './StarRating';
import API_URL from '../api';

const fetchAllTutors = async () => {
  try {
    const userId = localStorage.getItem('user_id');
    const response = await fetch(`${API_URL}/api/tutors/latest`);
    if (response.ok) {
      const tutors = await response.json();
      return userId
        ? tutors.filter((tutor) => tutor.user_id !== parseInt(userId))
        : tutors;
    }
    throw new Error('Failed to fetch tutors');
  } catch (error) {
    console.error(error);
    return [];
  }
};

const Subjects = () => {
  const [searchParams] = useSearchParams();
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [allTutors, setAllTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const subjects = [
    "Myanmar", "English", "Math", "Science", "Bio", "Chemistry",
    "Geography", "History", "ICT", "Computer Science", "Programming",
    "Business", "Accounting", "Economy", "Medicine", "Engineering"
  ];

  useEffect(() => {
    const loadTutors = async () => {
      setIsLoading(true);
      const tutors = await fetchAllTutors();
      const sortedTutors = tutors.sort((a, b) => {
        const ratingA = parseFloat(a.avg_rating) || 0;
        const ratingB = parseFloat(b.avg_rating) || 0;
        return ratingB - ratingA;
      });
      setAllTutors(sortedTutors);
      applyFilters(sortedTutors);
      setIsLoading(false);
    };
    loadTutors();
  }, []);

  useEffect(() => {
    if (allTutors.length > 0) {
      applyFilters(allTutors);
    }
  }, [subject]);

  const applyFilters = (tutors) => {
    const filtered = subject
      ? tutors.filter(tutor => {
          const tutorSubjects = Array.isArray(tutor.subjects)
            ? tutor.subjects
            : tutor.subjects.split(',');
          return tutorSubjects.some(s => 
            s.trim().toLowerCase().includes(subject.toLowerCase())
          );
        })
      : [...tutors];
    setFilteredTutors(filtered);
  };

  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setSubject(value);
    navigate(`/subjects?subject=${encodeURIComponent(value)}`);
  };

  const handleSeeMore = (tutorId) => {
    navigate(`/tutor/${tutorId}`);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h1 className="h3 mb-4 text-center">Find Tutors by Subject</h1>
              
              <div className="row">
                <div className="col-md-6 mx-auto">
                  <label className="form-label">Select Subject:</label>
                  <select
                    className="form-select"
                    value={subject}
                    onChange={handleSubjectChange}
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((subj) => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading tutors...</p>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Profile</th>
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
                      {filteredTutors.length > 0 ? (
                        filteredTutors.map((tutor) => (
                          <tr key={tutor.id}>
                            <td>
                              <img
                                src={`${API_URL}/storage/${tutor.image || 'tutor_images/default.jpg'}`}
                                alt={tutor.name}
                                className="rounded-circle"
                                width="50"
                                height="50"
                              />
                            </td>
                            <td className="align-middle">{tutor.name}</td>
                            <td className="align-middle">
                              {Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : tutor.subjects}
                            </td>
                            <td className="align-middle">{tutor.location}</td>
                            <td className="align-middle">{tutor.experience} years</td>
                            <td className="align-middle">{tutor.tutoring_mode}</td>
                            <td className="align-middle">
                              <div className="d-flex align-items-center">
                                <StarRating 
                                  rating={parseFloat(tutor.avg_rating) || 0} 
                                  isEditable={false} 
                                  size="sm"
                                />
                                <span className="ms-2 text-muted small">
                                  ({parseFloat(tutor.avg_rating)?.toFixed(1) || '0.0'})
                                </span>
                              </div>
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-4">
                            <div className="text-muted">
                              <i className="fas fa-search fa-2x mb-3"></i>
                              <p>No tutors found for this subject</p>
                              {subject && (
                                <button 
                                  className="btn btn-link"
                                  onClick={() => {
                                    setSubject('');
                                    navigate('/subjects');
                                  }}
                                >
                                  Show all tutors
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subjects;