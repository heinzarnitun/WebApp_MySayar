import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import 'bootstrap/dist/css/bootstrap.min.css';
import './home.css';
import API_URL from '../api';

const Home = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [topTutors, setTopTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchSectionRef = useRef(null);

   const scrollToSearchSection = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const subjects = ["Myanmar", "English", "Math", "Science", "Bio", "Chemistry", 
    "Geography", "History", "ICT", "Computer Science", "Programming", 
    "Business", "Accounting", "Economy", "Medicine", "Engineering"];

  const cities = [
    "Hakha", "Myitkyina", "Loikaw", "Hpa-An", "Mawlamyine", 
    "Sittwe", "Taunggyi", "Pathein", "Bago", "Magway", 
    "Mandalay", "Monywa", "Dawei", "Yangon", "NayPyiTaw"
  ];

  const popularCities = ["Yangon", "Mandalay", "NayPyiTaw"];

  useEffect(() => {
    const fetchTopTutors = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tutors/latest`);
        if (response.ok) {
          const tutors = await response.json();
          const sorted = tutors.sort((a, b) => {
            const ratingA = parseFloat(a.avg_rating) || 0;
            const ratingB = parseFloat(b.avg_rating) || 0;
            return ratingB - ratingA;
          }).slice(0, 8);
          setTopTutors(sorted);
        }
      } catch (error) {
        console.error('Error fetching tutors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopTutors();
  }, []);

  const handleViewProfile = (tutorId) => {
    navigate(`/tutor/${tutorId}`);
  };

  const handleSubjectSearch = () => {
    if (selectedSubject) {
      navigate(`/subjects?subject=${encodeURIComponent(selectedSubject)}`);
    } else {
      navigate('/subjects');
    }
  };

  const handleCitySearch = () => {
    if (selectedCity) {
      navigate(`/cities?city=${encodeURIComponent(selectedCity)}`);
    } else {
      navigate('/cities');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
        <section className="platform-header position-relative overflow-hidden">
    <div className="container-fluid g-0">
      <div className="row align-items-center">
        {/* Text Content - left side */}
        <div className="col-lg-6 order-lg-1 order-2 py-5 px-4 px-lg-5 text-center text-lg-start">
          <div className="text-overlay p-4 p-lg-5">
            <h1 className="display-4 fw-bold mb-3">MYANMAR'S BEST PLATFORM FOR PRIVATE TUTORS AND LEARNERS</h1>
            <p className="lead mb-4">Find top-rated tutors for all subjects across the country!</p>
            <button onClick={scrollToSearchSection} className="btn btn-primary btn-lg px-4 py-2">FIND A TUTOR NOW!</button>
          </div>
        </div>
        
        {/* Image - right side */}
        <div className="col-lg-6 order-lg-2 order-1 p-0">
          <div className="image-container">
            <img 
             src={`${process.env.PUBLIC_URL}/clipart.png`} 
              alt="Tutoring illustration" 
              className="img-fluid w-100 h-100 object-fit-cover"
            />
            <div className="image-overlay"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Why Choose Our Platform</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="fas fa-users fa-3x text-primary mb-3"></i>
                  <h3 className="h4 mb-3">Search Tutors</h3>
                  <p className="text-muted">  Search by subject, location, or availability. Filter by rating, price, and qualifications to find your perfect match.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="fas fa-star fa-3x text-primary mb-3"></i>
                  <h3 className="h4 mb-3">Rating System</h3>
                  <p className="text-muted">Transparent reviews from real students help you choose</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
  <div className="card h-100 border-0 shadow-sm">
    <div className="card-body text-center p-4">
      {/* Option 1 - Calendar Check (best for scheduling) */}
      <i className="fas fa-calendar-check fa-3x text-primary mb-3"></i>
    
      <h3 className="h4 mb-3">Book & Learn</h3>
      <p className="text-muted">
        Easily schedule sessions, manage bookings, and start learning - all through our platform.
      </p>
    </div>
  </div>
</div>
          </div>
        </div>
      </section>

      {/* Search Sections */}
      <section className="search-sections py-5" ref={searchSectionRef}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h2 className="text-center mb-4 fw-bold">Find by Subject</h2>
                  <div className="d-flex gap-2">
                    <select
                      className="form-select form-select-lg"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                    <button 
                      className="btn btn-primary btn-lg px-4"
                      onClick={handleSubjectSearch}
                      disabled={!selectedSubject}
                    >
                      <i className="fas fa-search me-2"></i> Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h2 className="text-center mb-4 fw-bold">Find by Location</h2>
                  <div className="d-flex gap-2 mb-3">
                    <select
                      className="form-select form-select-lg"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <button 
                      className="btn btn-primary btn-lg px-4"
                      onClick={handleCitySearch}
                      disabled={!selectedCity}
                    >
                      <i className="fas fa-search me-2"></i> Search
                    </button>
                  </div>
                  <div>
                    <p className="text-muted mb-2">Popular cities:</p>
                    <div className="d-flex flex-wrap gap-2">
                      {popularCities.map(city => (
                        <button
                          key={city}
                          className={`btn ${selectedCity === city ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setSelectedCity(city)}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Tutors Section */}
      <section className="top-tutors py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Top Rated Tutors</h2>
          
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {topTutors.map((tutor) => (
                <div key={tutor.id} className="col-md-6 col-lg-4 col-xl-3">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="mx-auto mb-3" style={{width: '120px', height: '120px'}}>
                        <img
                          src={`${API_URL}/storage/${tutor.image || 'tutor_images/default.jpg'}`}
                          alt={tutor.name}
                          className="rounded-circle img-fluid h-100 w-100 object-fit-cover border border-3 border-primary"
                        />
                      </div>
                      <h3 className="h5 fw-bold mb-2">{tutor.name}</h3>
                      <div className="d-flex justify-content-center align-items-center mb-2">
                        <StarRating 
                          rating={parseFloat(tutor.avg_rating) || 0} 
                          isEditable={false} 
                        />
                        <span className="ms-2 text-muted small">
                          ({parseFloat(tutor.avg_rating)?.toFixed(1) || '0.0'})
                        </span>
                      </div>
                      <p className="text-muted mb-2">
                        {Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : tutor.subjects}
                      </p>
                      <p className="small text-muted mb-3">
                        <i className="fas fa-map-marker-alt me-1"></i> {tutor.location}
                      </p>
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => handleViewProfile(tutor.id)}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;