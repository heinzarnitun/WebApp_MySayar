import { Link } from 'react-router-dom';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import TutorDetail from '../components/TutorDetail'; 
import AddTutorProfile from './AddTutorProfile'; 
import TutorProfileTable from './TutorProfileTable';
import Listings from './Listings';
import AddJobs from './AddJobs';
import JobDetail from './JobDetail';
import JobTable from './JobTable';
import JobsOffered from './JobsOffered';
import JobCreated from './JobCreated';
import JobApplied from './JobApplied';
import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import API_URL from '../api';

const Dashboard = () => {
  const userId = localStorage.getItem('user_id');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState('listings');
  const [offerCount, setOfferCount] = useState(0);

  useEffect(() => {
    // Fetch the count of new job offers for the current logged-in user (applier)
    const fetchOffers = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`${API_URL}/api/offers?applied_by=${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const offers = await response.json();
          
          const newOffersForUser = offers.filter(
            (offer) => offer.status === 'new' && 
                      offer.type === 'offer' && 
                      offer.applied_by === parseInt(userId, 10)
          );

          setOfferCount(newOffersForUser.length);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
    
    // Optional: Set up polling to check for new offers periodically
    const intervalId = setInterval(fetchOffers, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);

  const handleNavigate = (page) => {
    setSelectedPage(page);
    // If navigating to JobsOffered, reset the count
    
  };

  const handleLogout = () => {
    logout();
    alert('Logout successful! Redirecting...');
    setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 1000);
  };

  // Helper function to determine active class
  const isActive = (page) => selectedPage === page ? 'active' : '';

  return (
    <div className="body-content">
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <h3>Dashboard</h3>
          <nav className="sidebar-nav flex-column mt-4">
            <a 
              className={`sidebar-link ${isActive('listings')}`} 
              onClick={() => handleNavigate('listings')}
            >
              <i className="fas fa-list me-3"></i> Listings
            </a>
            <a 
              className={`sidebar-link ${isActive('add-tutor-profile')}`} 
              onClick={() => handleNavigate('add-tutor-profile')}
            >
              <i className="fas fa-user-plus me-3"></i> Add Tutor Profile
            </a>
            <a 
              className={`sidebar-link ${isActive('AddJobs')}`} 
              onClick={() => handleNavigate('AddJobs')}
            >
              <i className="fas fa-briefcase me-3"></i> Add Jobs
            </a>
            <a 
              className={`sidebar-link ${isActive('JobsOffered')} position-relative`} 
              onClick={() => handleNavigate('JobsOffered')}
            >
              <i className="fas fa-handshake me-3"></i> Jobs Offered
              {offerCount > 0 && (
                <span className="position-absolute top-10 bottom-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {offerCount}
                  <span className="visually-hidden">unread offers</span>
                </span>
              )}
            </a>
            <a 
              className={`sidebar-link ${isActive('job-applied')}`} 
              onClick={() => handleNavigate('job-applied')}
            >
              <i className="fas fa-file-alt me-3"></i> Job Applied
            </a>
            <a 
              className={`sidebar-link ${isActive('job-created')}`} 
              onClick={() => handleNavigate('job-created')}
            >
              <i className="fas fa-plus-circle me-3"></i> Job Created
            </a>
          </nav>
        </div>

        <div className="dashboard-content">
          <h6 className="text-dark">{`Username: ${username ? username : 'Not logged in'}`}</h6>
          <div className="mt-4">
            {selectedPage === 'listings' && (
              <div>
                <h4>Select Listings Type</h4>
                <button 
                  className={`btn ${isActive('tutor-listings') ? 'btn-primary' : 'btn-outline-primary'}`} 
                  onClick={() => handleNavigate('tutor-listings')}
                >
                  Tutor Profile Listings
                </button>
                <br/><br/>
                <button 
                  className={`btn ${isActive('job-listings') ? 'btn-primary' : 'btn-outline-primary'} ml-2`} 
                  onClick={() => handleNavigate('job-listings')}
                >
                  Job Listings
                </button>
              </div>
            )}
            {selectedPage === 'add-tutor-profile' && <AddTutorProfile />}
            {selectedPage === 'AddJobs' && <AddJobs />}
            {selectedPage === 'tutor-listings' && <TutorProfileTable />}
            {selectedPage === 'job-listings' && <JobTable />}
            {selectedPage === 'JobsOffered' && <JobsOffered />}
            {selectedPage === 'job-applied' && <JobApplied />}
            {selectedPage === 'job-created' && <JobCreated />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;