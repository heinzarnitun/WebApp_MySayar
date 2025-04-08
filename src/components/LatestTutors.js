import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../api';

const LatestTutors = () => {
    const [tutors, setTutors] = useState([]);

    useEffect(() => {
        // Fetch the latest 5 tutors excluding the current user
        axios.get(`${API_URL}/api/tutors/LatestTutors`)
            .then(response => {
                setTutors(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the tutors!', error);
            });
    }, []);

    return (
        <div>
            <h2>Latest Tutors</h2>
            <ul>
                {tutors.map(tutor => (
                    <li key={tutor.id}>
                        <img src={`/storage/${tutor.image}`} alt={tutor.name} width="100" />
                        <h3>{tutor.name}</h3>
                        <p>{tutor.subjects}</p>
                        <p>{tutor.tutoring_mode}</p>
                        <p>Education: {tutor.education_background}</p>
                        <p>Experience: {tutor.experience} years</p>
                        <p>Rating: {tutor.avg_rating} ({tutor.review_count} reviews)</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LatestTutors;
