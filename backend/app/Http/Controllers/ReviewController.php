<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\TutorProfile;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
	
public function store(Request $request, $tutorId)
{
    $request->validate([
        'rating' => 'required|integer|between:1,5', // Rating between 1 and 5
        'review' => 'nullable|string', // Change comment to review here
        'user_id' => 'required|integer', // Validate user_id passed in the body
    ]);

    // Ensure the tutor exists
    $tutor = TutorProfile::find($tutorId);
    if (!$tutor) {
        return response()->json(['message' => 'Tutor not found'], 404); // Not Found
    }

    // Create the review
    $review = new Review([
        'user_id' => $request->user_id, // Use the user_id passed in the request
        'rating' => $request->rating,
        'review' => $request->review, // Store review content in the 'review' column
    ]);

    // Associate the review with the tutor
    $tutor->reviews()->save($review);

    return response()->json([
        'message' => 'Review created successfully.',
        'data' => $review
    ], 201); // 201 Created
}


    // List all reviews for a specific tutor
    public function index($tutorId)
    {
        // Get reviews for the tutor
        $reviews = TutorProfile::findOrFail($tutorId)->reviews;

        return response()->json([
            'data' => $reviews
        ]);
    }

    public function update(Request $request, $reviewId)
{
    $request->validate([
        'rating' => 'required|integer|between:1,5',
        'review' => 'nullable|string',
        'user_id' => 'required|integer', // Validate user_id passed in the body
    ]);

    // Find the review
    $review = Review::findOrFail($reviewId);

    // Check if the review belongs to the user_id passed in the request
    if ($review->user_id !== $request->user_id) {
        return response()->json(['message' => 'You can only update your own review.'], 403); // Forbidden
    }

    // Update the review
    $review->update([
        'rating' => $request->rating,
        'review' => $request->review,
    ]);

    return response()->json([
        'message' => 'Review updated successfully.',
        'data' => $review
    ]);
}

    public function destroy($reviewId)
{
    // Find the review
    $review = Review::find($reviewId);

    if (!$review) {
        return response()->json(['message' => 'Review not found'], 404); // Not Found
    }

    // Delete the review
    $review->delete();

    return response()->json([
        'message' => 'Review deleted successfully.',
    ]);
}


}
