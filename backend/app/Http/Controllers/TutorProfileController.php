<?php
namespace App\Http\Controllers;

use App\Models\TutorProfile;
use Illuminate\Http\Request;
use App\Models\Review;


class TutorProfileController extends Controller
{
    // Display a list of all tutor profiles
    public function index()
    {
        $tutorProfiles = TutorProfile::all();
        return response()->json($tutorProfiles); // Return JSON response
    }

   // Filter tutor profiles based on search criteria (subjects, location, and tutoring mode)
public function searchTutors(Request $request)
{
    $query = TutorProfile::query();

    // Filter by free text search (search any field, like name, subjects, location)
    if ($request->has('search') && !empty($request->search)) {
        $searchTerm = $request->search;
        $query->where(function($q) use ($searchTerm) {
            $q->where('name', 'LIKE', '%' . $searchTerm . '%')
              ->orWhere('subjects', 'LIKE', '%' . $searchTerm . '%')
              ->orWhere('location', 'LIKE', '%' . $searchTerm . '%');
        });
    }

    // Filter by gender
    if ($request->has('gender') && !empty($request->gender)) {
        $query->where('gender', $request->gender);
    }

    // Filter by subjects
    if ($request->has('subjects') && !empty($request->subjects)) {
        $query->where('subjects', 'LIKE', '%' . $request->subjects . '%');
    }

    // Filter by location
    if ($request->has('location') && !empty($request->location)) {
        $query->where('location', 'LIKE', '%' . $request->location . '%');
    }

    // Filter by tutoring mode
    if ($request->has('tutoring_mode') && !empty($request->tutoring_mode)) {
        $query->where('tutoring_mode', 'LIKE', '%' . $request->tutoring_mode . '%');
    }

    // Fetch tutors based on the filters
    $tutorProfiles = $query->get();

    return response()->json($tutorProfiles); // Return filtered results
}


  public function latestTutors(Request $request)
{
    // Get the user ID from the request, but don't require it
    $userId = $request->user_id;

    // If user_id is not provided, skip excluding the user's profile
    $query = TutorProfile::latest(); // Get the latest tutors

    // If user_id is provided, exclude the current user's profile
    if ($userId) {
        $query->where('user_id', '!=', $userId);
    }

    // Execute the query
    $tutorProfiles = $query->get();

    // Add ratings and reviews
    foreach ($tutorProfiles as $tutor) {
        $reviews = Review::where('tutor_id', $tutor->id)
            ->whereNotNull('rating') // Exclude reviews with NULL ratings
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as review_count')
            ->first();

        // Round the average rating to 1 decimal place
        $tutor->avg_rating = $reviews && $reviews->avg_rating !== null ? round($reviews->avg_rating, 1) : 'No reviews yet';
        $tutor->review_count = $reviews ? $reviews->review_count : 0;
    }

    return response()->json($tutorProfiles);
}



    // Show a single tutor profile
  public function show($id)
{
    // Find the tutor profile by ID
    $tutorProfile = TutorProfile::find($id);

    if (!$tutorProfile) {
        return response()->json(['message' => 'Tutor not found'], 404); // Return 404 if tutor not found
    }

    // Calculate average rating and review count
    $reviews = Review::where('tutor_id', $tutorProfile->id)
        ->whereNotNull('rating') // Exclude reviews with NULL ratings
        ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as review_count')
        ->first();

    // Add average rating and review count to the response
    $tutorProfile->avg_rating = $reviews && $reviews->avg_rating !== null ? round($reviews->avg_rating, 2) : 'No reviews yet';
    $tutorProfile->review_count = $reviews ? $reviews->review_count : 0;

    return response()->json($tutorProfile); // Return JSON response
}

    // Create a new tutor profile
    public function store(Request $request)
    {

        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'name' => 'required|string',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'biography' => 'required|string',
            'subjects' => 'required|string', // Ensure subjects is an array
            'hourly_rate' => 'required|numeric',
            'location' => 'required|string',
            'tutoring_mode' => 'required|string',
            'experience' => 'required|integer',
            'education_background' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Handle image upload
        $validatedData = $request->all(); // Get all validated data
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('tutor_images', 'public');
            $validatedData['image'] = $imagePath; // Store the image path
        }

        // Create the tutor profile
        $tutorProfile = TutorProfile::create($validatedData);

        return response()->json([
            'message' => 'Tutor profile created successfully.',
            'data' => $tutorProfile
        ], 201); // Return JSON response with a 201 status
    }

    // Update an existing tutor profile
    public function update(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'name' => 'required|string',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'biography' => 'required|string',
            'subjects' => 'required|string',
            'hourly_rate' => 'required|numeric',
            'location' => 'required|string',
            'tutoring_mode' => 'required|string',
            'experience' => 'required|integer',
            'education_background' => 'required|string',
        ]);

        // Handle image upload if any
        $validatedData = $request->all();
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('tutor_images', 'public');
            $validatedData['image'] = $imagePath;
        }

        // Get the tutor profile and update it
        $tutorProfile = TutorProfile::findOrFail($id);
        $tutorProfile->update($validatedData);

        return response()->json([
            'message' => 'Tutor profile updated successfully.',
            'data' => $tutorProfile
        ]); // Return JSON response
    }

    // Delete a tutor profile
    public function destroy($id)
    {
        $tutorProfile = TutorProfile::findOrFail($id);
        $tutorProfile->delete();

        return response()->json([
            'message' => 'Tutor profile deleted successfully.'
        ]); // Return JSON response
    }
}
