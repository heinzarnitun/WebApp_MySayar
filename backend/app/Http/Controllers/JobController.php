<?php

// app/Http/Controllers/JobController.php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
	  public function myJobs(Request $request)
{
    // Get user ID from the request (no need for authentication)
    $userId = $request->input('user_id');  // Expect user_id to be passed in the request
    $jobs = Job::where('user_id', $userId)->get();  // Fetch jobs by user ID
    return response()->json($jobs);
}


    public function index()
    {
        $jobs = Job::all();
        return response()->json($jobs);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'job_title' => 'required|string',
            'description' => 'required|string',
            'learner_name' => 'required|string',
            'learner_gender' => 'required|in:male,female,other',
            'location' => 'required|string',
            'address' => 'required|string',
            'tutoring_mode'=>'required|string',
            'wanted_tutor_qualification' => 'required|string',
            'hours_per_week' => 'required|integer',
            'salary_rate' => 'required|numeric',
            'start_date' => 'required|date',
            'special_request' => 'nullable|string',
        ]);

        $job = Job::create($validated);
        return response()->json($job, 201);
    }

    public function show($id)
    {
        $job = Job::findOrFail($id);
        return response()->json($job);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'job_title' => 'required|string',
            'description' => 'required|string',
            'learner_name' => 'required|string',
            'learner_gender' => 'required|in:male,female,other',
            'location' => 'required|string',
            'address' => 'required|string',
            'tutoring_mode'=>'required|string',
            'wanted_tutor_qualification' => 'required|string',
            'hours_per_week' => 'required|integer',
            'salary_rate' => 'required|numeric',
            'start_date' => 'required|date',
            'special_request' => 'nullable|string',
        ]);

        $job = Job::findOrFail($id);
        $job->update($validated);
        return response()->json($job);
    }

    public function destroy($id)
    {
        $job = Job::findOrFail($id);
        $job->delete();
        return response()->json(['message' => 'Job deleted successfully']);
    }

public function searchJobs(Request $request)
{
    

    $userId = $request->user_id;

    // If user_id is not provided, skip excluding the user's profile
   $query = Job::query();

    // If user_id is provided, exclude the current user's profile
    if ($userId) {
        $query->where('user_id', '!=', $userId);
    }


    if ($request->has('location')) {
        $query->where('location', 'LIKE', "%{$request->location}%");
    }
    
    if ($request->has('tutoring_mode')) {
        $query->where('tutoring_mode', $request->tutoring_mode);
    }
    
    if ($request->has('min_salary')) {
        $query->where('salary_rate', '>=', $request->min_salary);
    }

    if ($request->has('max_salary')) {
        $query->where('salary_rate', '<=', $request->max_salary);
    }

    if ($request->has('keyword')) {
        $query->where('title', 'LIKE', "%{$request->keyword}%")
              ->orWhere('description', 'LIKE', "%{$request->keyword}%");
    }

    $jobs = $query->get();
    return response()->json($jobs);
}

public function latestJobs(Request $request)
{
    // Get the user ID from the request, but don't require it
    $userId = $request->user_id;

    // Get the latest jobs
    $query = Job::latest()->limit(5);

    // If user_id is provided, exclude the user's posted jobs
    if ($userId) {
        $query->where('user_id', '!=', $userId);
    }

    $jobs = $query->get();

    return response()->json($jobs);
}


}
