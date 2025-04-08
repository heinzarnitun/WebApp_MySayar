import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import API_URL from '../api';

const JobsOffered = () => {
    const [offers, setOffers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await fetch(`${API_URL}/api/offers`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    let offers = await response.json();

                    // Get the current user ID from localStorage
                    const currentUserId = localStorage.getItem('user_id');

                    // Filter the offers in JavaScript
                    offers = offers.filter(
                        (offer) => offer.applied_by == currentUserId && offer.type === 'offer'
                    );

                    setOffers(offers);
                }
            } catch (error) {
                console.error('Error fetching offers:', error);
            }
        };

        fetchOffers();
    }, []);

    const handleDecision = async (offerId, status) => {
  try {
    console.log("Updating Offer ID:", offerId, "New Status:", status);
    
    const response = await fetch(`${API_URL}/api/offers/${offerId}`, {
      method: 'POST', // Using POST with _method for Laravel
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ 
        status,
        _method: 'PUT'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Offer update failed:', errorData.message || response.statusText);
      return; // Silent failure
    }

    const result = await response.json();
    console.log('Offer update successful:', result);
    
    // Update local state only
    setOffers(offers.map(offer => 
      offer.id === offerId ? { ...offer, status } : offer
    ));

  } catch (error) {
    console.error('Network error updating offer:', error);
  }
};
    const handleViewMore = (offer) => {
        setSelectedOffer(offer);
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    return (
        <div>
            <h2>Job Offers</h2>
            {offers.length === 0 ? (
                <p>No job offers available.</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Description</th>
                            <th>Salary</th>
                            <th>Location</th>
                            <th>Start Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offers.map((offer) => (
                            <tr key={offer.id?.id}>
                                <td>{offer.job?.job_title || 'N/A'}</td>
                                <td>{offer.job?.description || 'N/A'}</td>
                                <td>{offer.job?.salary_rate ? `$${offer.job.salary_rate}` : 'N/A'}</td>
                                <td>{offer.job?.location || 'N/A'}</td>
                                <td>{offer.job?.start_date || 'N/A'}</td>
                                <td>{offer.status}</td>
                                <td>
                                    <div className="d-flex justify-content-between">
                                        <button 
                                            className="btn btn-info" 
                                            onClick={() => handleViewMore(offer)}
                                        >
                                            View 
                                        </button>
                                        {offer.status === 'accepted' && (
                                            <button 
                                                className="btn btn-danger" 
                                                onClick={() => handleDecision(offer.id, 'rejected')}
                                            >
                                                Reject
                                            </button>
                                        )}
                                        {offer.status === 'rejected' && (
                                            <button 
                                                className="btn btn-success" 
                                                onClick={() => handleDecision(offer.id, 'accepted')}
                                            >
                                                Accept
                                            </button>
                                        )}
                                        {offer.status === 'new' && (
                                            <>
                                                <button 
                                                    className="btn btn-success" 
                                                    onClick={() => handleDecision(offer.id, 'accepted')}
                                                >
                                                    Accept
                                                </button>
                                                <button 
                                                    className="btn btn-danger" 
                                                    onClick={() => handleDecision(offer.id, 'rejected')}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Bootstrap Modal for View More */}
            {selectedOffer && (
                <div 
                    className={`modal ${showModal ? 'show' : ''}`} 
                    tabIndex="-1" 
                    aria-labelledby="exampleModalLabel" 
                    aria-hidden={!showModal}
                    style={{ display: showModal ? 'block' : 'none' }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Job Offer Details</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    data-bs-dismiss="modal" 
                                    aria-label="Close" 
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
    <p><strong>Job Title:</strong> {selectedOffer.job?.job_title || 'N/A'}</p>
    <p><strong>Description:</strong> {selectedOffer.job?.description || 'N/A'}</p>
    <p><strong>Learner Name:</strong> {selectedOffer.job?.learner_name || 'N/A'}</p>
    <p><strong>Learner Gender:</strong> {selectedOffer.job?.learner_gender || 'N/A'}</p>
    <p><strong>Location:</strong> {selectedOffer.job?.location || 'N/A'}</p>
    <p><strong>Address:</strong> {selectedOffer.job?.address || 'N/A'}</p>
    <p><strong>Tutoring Mode:</strong> {selectedOffer.job?.tutoring_mode || 'N/A'}</p>
    <p><strong>Required Tutor Qualification:</strong> {selectedOffer.job?.wanted_tutor_qualification || 'N/A'}</p>
    <p><strong>Hours Per Week:</strong> {selectedOffer.job?.hours_per_week || 'N/A'}</p>
    <p><strong>Salary Rate:</strong> {selectedOffer.job?.salary_rate ? `Ks ${selectedOffer.job.salary_rate}` : 'N/A'}</p>
    <p><strong>Start Date:</strong> {selectedOffer.job?.start_date || 'N/A'}</p>
    <p><strong>Special Requests:</strong> {selectedOffer.job?.special_request || 'N/A'}</p>
    <p><strong>Status:</strong> {selectedOffer.status}</p>
</div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobsOffered;
