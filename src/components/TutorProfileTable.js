import React, { useEffect, useState } from 'react';
import TutorDetail from './TutorDetail';
import API_URL from '../api';

import { useNavigate } from 'react-router-dom';

const TutorProfileTable = () => {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Simulating logged-in user ID (Replace with actual authentication logic)
    const loggedInUserId = localStorage.getItem('user_id'); // Example: Get user ID from local storage or authentication context

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const response = await fetch(`${API_URL}/api/tutor-profiles`);
                const data = await response.json();

                // Filter to show only the logged-in user's profile
                const userProfiles = data.filter(tutor => tutor.user_id === parseInt(loggedInUserId));

                setTutors(userProfiles);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tutor profiles:', error);
                setLoading(false);
            }
        };

        fetchTutors();
    }, [loggedInUserId]);

    const handleEdit = (tutor) => {
        navigate(`/edit-tutor/${tutor.id}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

   return (
  <div className="container mt-4">
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h2 className="h4 mb-0">My Profile</h2>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '80px' }}>Image</th>
                <th>Name</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tutors.length > 0 ? (
                tutors.map((tutor) => (
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
                      <TutorDetail
                        type="Tutor"
                        imageUrl={`${API_URL}/storage/${tutor.image}`}
                        title={tutor.name}
                        tutor={tutor}
                        onEdit={handleEdit}
                        className="btn btn-sm btn-outline-primary"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-muted">
                    No profile found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
};

export default TutorProfileTable;
