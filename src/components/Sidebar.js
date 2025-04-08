import './sidebar.css'; // Custom styles
import AddTutorProfile from './AddTutorProfile'; // Import your AddTutorProfile component
import Listings from './Listings';
import React, { useEffect, useState } from 'react';
import JobsOffered from './JobsOffered';
import JobCreated from './JobCreated';
import JobApplied from './JobApplied';
import API_URL from '../api';

const Sidebar = ({ onNavigate }) => {
    const [offerCount, setOfferCount] = useState(0);

    useEffect(() => {
        // Fetch the count of new job offers for the current logged-in user (applier)
        const fetchOffers = async () => {
            try {
                const userId = localStorage.getItem('user_id');  // Get the logged-in user's ID
               const response = await fetch(`${API_URL}/api/offers?applied_by=${userId}`, {

                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const offers = await response.json();
                    
                    // Filter for offers where the user is the applier and the offer status is 'new'
const newOffersForUser = offers.filter((offer) => offer.status === 'new' && offer.type === 'offer' && offer.applied_by === parseInt(userId, 10));

                    console.log('User ID:', userId);

                    console.log('Filtered New Offers for User:', newOffersForUser);
                    setOfferCount(newOffersForUser.length);
                }
            } catch (error) {
                console.error('Error fetching offers:', error);
            }
        };

        fetchOffers();
    }, []);

    return (
        <div className="sidebar">
            <ul>
                <li onClick={() => onNavigate('listings')}>Listings</li>
                <li onClick={() => onNavigate('add-tutor-profile')}>Add Tutor Profile</li>
                <li onClick={() => onNavigate('AddJobs')}>Add Jobs</li>

                {/* Job Offers Link with Count */}

               

                <div className="notification">
                <li onClick={() => onNavigate('JobsOffered')}>

                    Jobs Offered {offerCount > 0 && <span className="badge">{offerCount}</span>}
                </li>
                </div>

                <li onClick={() => onNavigate('job-applied')}>Jobs Applied</li>
                <li onClick={() => onNavigate('job-created')}>Jobs Created</li>
                <li onClick={() => onNavigate('my-account')}>My Account</li>
            </ul>
        </div>
    );
};

export default Sidebar;
