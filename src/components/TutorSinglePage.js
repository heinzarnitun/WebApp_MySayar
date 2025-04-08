import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StarRating from './StarRating'; // Import the StarRating component
import API_URL from '../api';

const TutorSinglePage = () => {
  const { id } = useParams(); // Get the tutor ID from the URL
  const [tutor, setTutor] = useState(null); // Tutor details
  const [jobs, setJobs] = useState([]); // Jobs for the logged-in user
  const [selectedJob, setSelectedJob] = useState(''); // Selected job for hiring
  const [message, setMessage] = useState(''); // Success/error message
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Check if user is logged in
  const [reviews, setReviews] = useState([]); // Tutor reviews
  const [rating, setRating] = useState(0); // Selected rating for review
  const [review, setReview] = useState(''); // Comment for review
  const [editingReviewId, setEditingReviewId] = useState(null); // ID of the review being edited
  const [userId, setUserId] = useState(null); // State to hold the userId

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId); // Save the userId in the state
    }
  }, []);

  // Fetch tutor details, jobs, and reviews when the component mounts
  useEffect(() => {
    // Fetch tutor details
    const fetchTutorDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tutor-profiles/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTutor(data);
        } else {
          console.error("Failed to fetch tutor details");
        }
      } catch (error) {
        console.error("Error fetching tutor details:", error);
      }
    };

    // Fetch jobs for the logged-in user
    const fetchUserJobs = async () => {
      try {
        if (!userId) return; // Don't fetch jobs if userId is not available yet
        const response = await fetch(`${API_URL}/api/my-jobs?user_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched jobs:', data);
          setJobs(data);
        } else {
          console.error("Failed to fetch jobs");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    // Fetch reviews for the tutor
    const fetchReviews = async () => {
      try {
         console.log("Tutor ID:", id); 
        const response = await fetch(`${API_URL}/api/tutor-profiles/${id}/reviews`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Data:", data); 
          setReviews(data.data);
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchTutorDetails();
    fetchReviews();
    if (isLoggedIn) {
      fetchUserJobs();
    }
  }, [id, isLoggedIn, userId]); // Add userId as a dependency

  // Handle hiring the tutor
  const handleHireTutor = async () => {
    if (!isLoggedIn) {
      alert("Please sign in to hire this tutor.");
      return;
    }

    if (!selectedJob) {
      alert("Please select a job before hiring.");
      return;
    }

    try {
      // Fetch the tutor profile to get the applied_by value (user_id from the tutor profile)
      const responseTutor = await fetch(`${API_URL}/api/tutor-profiles/${id}`);
      if (!responseTutor.ok) {
        throw new Error('Failed to fetch tutor profile');
      }
      const tutorData = await responseTutor.json();
      const appliedBy = tutorData.user_id; // User ID from the tutor profile (the tutor profile owner)

      // Get the logged-in user's ID (created_by, the hirer)
      const userId = localStorage.getItem('user_id');

      // Send the offer
      const response = await fetch(`${API_URL}/api/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          job_id: selectedJob,
          tutor_profile_id: id, // The tutor profile you are hiring
          created_by: userId, // The logged-in user (hirer, the creator of the offer)
          applied_by: appliedBy, // The user who owns the tutor profile (the applier)
          status: 'new',
          type: 'offer',
        }),
      });

      if (response.ok) {
        setMessage("Job offer sent successfully!");
      } else {
        setMessage("Failed to send job offer.");
      }
    } catch (error) {
      console.error("Error sending job offer:", error);
      setMessage("Error occurred while sending job offer.");
    }
  };

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      alert("Please sign in to submit a review.");
      return;
    }

    // Get the user_id from localStorage and convert it to an integer
    const userId = parseInt(localStorage.getItem('user_id'), 10);

    // Check if userId exists
    if (!userId) {
      alert("User ID not found.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tutor-profiles/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,        // Rating submitted by the user
          review,        // Review submitted by the user (previously comment)
          user_id: userId,  // Use the userId from localStorage
        }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log('Fetched review data:', data);  // Log the response data for debugging

        setReviews([...reviews, data.data]); // Add the new review to the list of reviews
        setRating(0); // Reset the rating
        setReview(''); // Reset the review input
        setMessage("Review submitted successfully!"); // Display success message
      } else {
        setMessage("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("Error occurred while submitting review.");
    }
  };

  // Handle updating a review
  const handleUpdateReview = async (reviewId) => {
    const userId = parseInt(localStorage.getItem('user_id'), 10); // Get user ID from localStorage
    if (!userId) {
      alert("User ID not found.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          rating,
          review,
          user_id: userId,  // Include userId here too
        }),
      });

      if (response.ok) {
        const updatedReview = await response.json();
        setReviews(reviews.map(review => review.id === reviewId ? updatedReview.data : review)); // Update the review
        setRating(0); // Reset rating
        setReview(''); // Reset comment
        setEditingReviewId(null); // Reset editing state
        setMessage("Review updated successfully!");
      } else {
        setMessage("Failed to update review.");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      setMessage("Error occurred while updating review.");
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId, reviewUserId) => {
    const userId = parseInt(localStorage.getItem('user_id'), 10); // Get user ID from localStorage
    if (!userId) {
      alert("User ID not found.");
      return;
    }

    // Check if the logged-in user is the one who created the review
    if (userId !== reviewUserId) {
      alert("You can only delete your own reviews.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Add Content-Type header
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setReviews(reviews.filter(review => review.id !== reviewId)); // Remove review from state
        setMessage("Review deleted successfully!");
      } else {
        const errorData = await response.json(); // Parse error response
        setMessage(`Failed to delete review: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      setMessage("Error occurred while deleting review.");
    }
  };

  // If tutor details are still loading, show loading message
  if (!tutor) return <div>Loading...</div>;

  // Check if the current user is viewing their own tutor profile
  const isOwnProfile = userId && tutor.user_id === parseInt(userId);

  return (
    <div className="container py-5">
      <div className="row">
        {/* Left Column - Tutor Profile */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <img
                src={`${API_URL}/storage/${tutor.image || 'tutor_images/default.jpg'}`}
                alt={tutor.name}
                className="img-fluid rounded-circle shadow-sm mb-3"
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              />
              <h1 className="h3 mb-3">{tutor.name}'s Profile</h1>
              <div className="d-flex flex-column align-items-center mb-3">
                <span className="mb-1"><strong>Rating:</strong></span>
                {tutor.avg_rating ? (
                  <StarRating rating={tutor.avg_rating} isEditable={false} />
                ) : (
                  <span className="text-muted">No reviews yet</span>
                )}
              </div>
              <div className="text-left">
                <p className="mb-2"><strong>Gender:</strong> {tutor.gender}</p>
                <p className="mb-2"><strong>Date of Birth:</strong> {tutor.date_of_birth}</p>
                <p className="mb-2"><strong>Hourly Rate:</strong> {tutor.hourly_rate} ks/hour</p>
                <p className="mb-2"><strong>Location:</strong> {tutor.location}</p>
                <p className="mb-2"><strong>Tutoring Mode:</strong> {tutor.tutoring_mode}</p>
                <p className="mb-2"><strong>Experience:</strong> {tutor.experience} years</p>
                <p className="mb-2"><strong>Subjects:</strong> {tutor.subjects}</p>
                
                <div className="mb-2">
                  <h5 className="mb-1"><strong>Education Background:</strong></h5>
                  <p>{tutor.education_background}</p>
                </div>
                
                <div>
                  <h5 className="mb-1"><strong>Biography:</strong></h5>
                  <p>{tutor.biography}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Hiring & Reviews */}
        <div className="col-md-6">
          {/* Hire Section */}
          {isLoggedIn ? (
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h2 className="h4 mb-3">Hire This Tutor</h2>
                {isOwnProfile ? (
                  <div className="alert alert-warning">
                    You can't hire your own tutor profile.
                  </div>
                ) : (
                  <>
                    <div className="form-group mb-3">
                      <select 
                        className="form-control"
                        value={selectedJob} 
                        onChange={(e) => setSelectedJob(e.target.value)}
                      >
                        <option value="">Select a job</option>
                        {jobs.map((job) => (
                          <option key={job.id} value={job.id}>
                            {job.job_title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button 
                      className="btn btn-primary btn-block"
                      onClick={handleHireTutor}
                      disabled={isOwnProfile}
                    >
                      Hire Tutor
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="alert alert-info mb-4">
              Please <a href="/login" className="alert-link">sign in</a> to hire this tutor.
            </div>
          )}

          {/* Reviews Section */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="h4 mb-3">Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-muted">No reviews yet.</p>
              ) : (
                <ul className="list-unstyled">
                  {reviews.map((review) => (
                    <li key={review.id} className="mb-4 pb-3 border-bottom">
                      <div className="mb-2">
                        <strong>Rating:</strong> <StarRating rating={review.rating} isEditable={false} />
                      </div>
                      <div className="mb-2">
                        <strong>Review:</strong> <p className="mb-0">{review.review}</p>
                      </div>
                      {isLoggedIn && review.user_id === parseInt(userId) && (
                        <div>
                          <button
                            className="btn btn-sm btn-outline-primary mr-2"
                            onClick={() => {
                              setRating(review.rating);
                              setReview(review.review);
                              setEditingReviewId(review.id);
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteReview(review.id, review.user_id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Review Form */}
          {isLoggedIn && (
            <div className="card shadow-sm">
              <div className="card-body">
                {isOwnProfile ? (
                  <div className="alert alert-warning">
                    You can't review your own tutor profile.
                  </div>
                ) : (
                  <>
                    <h2 className="h4 mb-3">{editingReviewId ? 'Edit Your Review' : 'Leave a Review'}</h2>
                    <div className="form-group mb-3">
                      <label className="d-block mb-2"><strong>Rating:</strong></label>
                      <StarRating rating={rating} onRatingChange={setRating} isEditable={true} />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="reviewText" className="mb-2"><strong>Review:</strong></label>
                      <textarea
                        id="reviewText"
                        className="form-control"
                        rows="4"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                      />
                    </div>
                    <button
                      className={`btn ${editingReviewId ? 'btn-warning' : 'btn-primary'}`}
                      onClick={editingReviewId ? () => handleUpdateReview(editingReviewId) : handleSubmitReview}
                      disabled={isOwnProfile}
                    >
                      {editingReviewId ? 'Update Review' : 'Submit Review'}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mt-4`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorSinglePage;