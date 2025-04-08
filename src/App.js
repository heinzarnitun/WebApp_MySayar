// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import Subjects from './components/Subjects';
import Cities from './components/Cities';
import BecomeASayar from './components/BecomeASayar';
import RequestASayar from './components/RequestASayar';
import { isAuthenticated } from './services/authService';
import NavBar from './components/navbar'; // Use lowercase if your file is named "navbar.js"
import axios from 'axios';
import TutorSinglePage from './components/TutorSinglePage'; // Adjust the path if needed
import JobSinglePage from './components/JobSinglePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';


// Set the base URL for your API
axios.defaults.baseURL = 'https://mi-linux.wlv.ac.uk/~2532764/my_sayar/api';  // Use your Laravel API URL here
axios.defaults.withCredentials = true; 

// Ensure CSRF token is set before login or protected requests
axios.get('/sanctum/csrf-cookie').then(response => {
  console.log('CSRF token set');
});

const App = () => {
  return (
    <React.StrictMode>
    <Router>
    <div className="container">
    
      <NavBar />
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <SignIn />}
        />
        <Route
          path="/subjects"
          element={ <Subjects /> }
        />
        <Route
          path="/cities"
          element={<Cities /> }
        />
        <Route
          path="/become-a-sayar"
          element={ <BecomeASayar /> }
        />
        <Route
          path="/request-a-sayar"
          element={<RequestASayar /> }
        />

        <Route
            path="/tutor/:id" // New route for tutor details
            element={<TutorSinglePage />} // Tutor detail page component
          />

        <Route
            path="/job/:id" // New route for tutor details
            element={<JobSinglePage />} // Tutor detail page component
          />
      </Routes>

      
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 MySayar Private Tutor Finding Platform. All Rights Reserved.</p>
          <p>Developed by Hein Zarni Tun</p>
        </div>
      </footer>
      </div>
    </Router>
  </React.StrictMode>
  );
};

export default App;
