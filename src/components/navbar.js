import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../index.css';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('authToken');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState('/');

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    logout();
    alert('Logout successful! Redirecting...');
    setTimeout(() => {
      navigate('/sign-in');
      window.location.reload();
    }, 1000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Helper function to check if link is active
  const isActive = (path) => {
    return activePath === path ? 'active' : '';
  };

  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
        {/* Logo */}
        <div className="logo">
          <img src={`${process.env.PUBLIC_URL}/logo.png`}  alt="Logo" />
        </div>



        {/* Hamburger Icon for Mobile */}
        <button className="navbar-toggler" type="button" onClick={toggleSidebar}>
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Desktop Menu */}
        <ul className="menu">
          {isAuthenticated && (
            <li>
              <Link 
                className={`nav-link ${isActive('/dashboard')}`} 
                to="/dashboard"
              >
                Dashboard
              </Link>
            </li>
          )}
          <li>
            <Link className={`nav-link ${isActive('/')}`} to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/subjects')}`} to="/subjects">
              Subjects
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/cities')}`} to="/cities">
              Cities
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/become-a-sayar')}`} to="/become-a-sayar">
              Become a Sayar
            </Link>
          </li>
          <li>
            <Link className={`nav-link ${isActive('/request-a-sayar')}`} to="/request-a-sayar">
              Request a Sayar
            </Link>
          </li>

          {isAuthenticated ? (
            <li>
              <Link 
                className="nav-link" 
                to="/" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                Logout
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link className={`nav-link ${isActive('/sign-in')}`} to="/sign-in">
                  Sign In
                </Link>
              </li>
              <li>
                <Link className={`nav-link ${isActive('/sign-up')}`} to="/sign-up">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Sidebar */}
      <div className={`sidebarNav ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <button className="close-btn" onClick={toggleSidebar}>&times;</button>
          <ul>
            {isAuthenticated && (
              <li>
                <Link 
                  className={`nav-link ${isActive('/dashboard')}`} 
                  to="/dashboard"
                  onClick={toggleSidebar}
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link 
                className={`nav-link ${isActive('/')}`} 
                to="/"
                onClick={toggleSidebar}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                className={`nav-link ${isActive('/subjects')}`} 
                to="/subjects"
                onClick={toggleSidebar}
              >
                Subjects
              </Link>
            </li>
            <li>
              <Link 
                className={`nav-link ${isActive('/cities')}`} 
                to="/cities"
                onClick={toggleSidebar}
              >
                Cities
              </Link>
            </li>
            <li>
              <Link 
                className={`nav-link ${isActive('/become-a-sayar')}`} 
                to="/become-a-sayar"
                onClick={toggleSidebar}
              >
                Become a Sayar
              </Link>
            </li>
            <li>
              <Link 
                className={`nav-link ${isActive('/request-a-sayar')}`} 
                to="/request-a-sayar"
                onClick={toggleSidebar}
              >
                Request a Sayar
              </Link>
            </li>

            {isAuthenticated ? (
              <li>
                <Link 
                  className="nav-link" 
                  to="/" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                    toggleSidebar();
                  }}
                >
                  Logout
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link 
                    className={`nav-link ${isActive('/sign-in')}`} 
                    to="/sign-in"
                    onClick={toggleSidebar}
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link 
                    className={`nav-link ${isActive('/sign-up')}`} 
                    to="/sign-up"
                    onClick={toggleSidebar}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Overlay Background */}
      <div 
        className={`overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={toggleSidebar}
      ></div>
    </div>
  );
};

export default NavBar;