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

const Cities = () => {
  const [searchParams] = useSearchParams();
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [allTutors, setAllTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const cities = [
    "Hakha", "Myitkyina", "Loikaw", "Hpa-An", "Mawlamyine", 
    "Sittwe", "Taunggyi", "Pathein", "Bago", "Magway", 
    "Mandalay", "Monywa", "Dawei", "Yangon", "NayPyiTaw"
  ];

  const popularCities = ["Yangon", "Mandalay", "NayPyiTaw"];

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
  }, [city]);

  const applyFilters = (tutors) => {
    const filtered = city
      ? tutors.filter(tutor => 
          tutor.location && tutor.location.toLowerCase().includes(city.toLowerCase())
        )
      : [...tutors];
    setFilteredTutors(filtered);
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    navigate(`/cities?city=${encodeURIComponent(value)}`);
  };

  const handlePopularCityClick = (city) => {
    setCity(city);
    navigate(`/cities?city=${encodeURIComponent(city)}`);
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
              <h1 className="h3 mb-4 text-center">Find Tutors by City</h1>
              
              <div className="row align-items-center mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label">Select City:</label>
                  <select
                    className="form-select"
                    value={city}
                    onChange={handleCityChange}
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-6">
                  <p className="text-muted mb-2">Popular cities:</p>
                  <div className="d-flex flex-wrap gap-2">
                    {popularCities.map((popularCity) => (
                      <button
                        key={popularCity}
                        className={`btn btn-sm ${city === popularCity ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handlePopularCityClick(popularCity)}
                      >
                        {popularCity}
                      </button>
                    ))}
                  </div>
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
                              <p>No tutors found in this city</p>
                              {city && (
                                <button 
                                  className="btn btn-link"
                                  onClick={() => {
                                    setCity('');
                                    navigate('/cities');
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

export default Cities;