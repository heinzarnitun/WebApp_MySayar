import React from 'react';

const Listings = ({ onNavigate }) => {
  return (
    <div className="listings-container">
      <h2>Listings</h2>
      <ul>
        <li onClick={() => onNavigate('tutor-listings')}>Tutor Profile Listings</li>
        <li onClick={() => onNavigate('job-listings')}>Job Listings</li>
      </ul>
    </div>
  );
};

export default Listings;
