<?php

namespace App\Http\Controllers;

use App\Models\ApplyJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ApplyJobController extends Controller
{
    // 1️⃣ Apply for a Job
    public function store(Request $request)
    {
        $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'tutor_profile_id' => 'required|exists:tutor_profiles,id',
            'created_by' => 'required|exists:users,id', // Job owner
            'applied_by' => 'required|exists:users,id', // Current user applying
        ]);

        $applyJob = ApplyJob::create([
            'job_id' => $request->job_id,
            'tutor_profile_id' => $request->tutor_profile_id,
            'created_by' => $request->created_by,
            'applied_by' => $request->applied_by,
            'status' => 'new',
            'type'=> 'apply',
        ]);

        return response()->json(['message' => 'Job application submitted successfully', 'applyJob' => $applyJob], 201);
    }

    // 2️⃣ Get Job Applications for a User (Job Owner)
    public function index(Request $request)
    {
        // Get the user_id from the query parameter
        $userId = $request->query('user_id');

        // If user_id is provided, filter by applied_by (for JobApplied)
        if ($userId) {
            $applications = ApplyJob::where('applied_by', $userId)
                                    ->with(['job', 'creator'])
                                    ->with(['tutorProfile'])
                                    ->get();
        }
        // If no user_id is provided, return all applications (for JobCreated)
        else {
            $applications = ApplyJob::with(['job', 'applicant', 'tutorProfile'])
                                    ->get();
        }

        return response()->json($applications);
    }

    // 3️⃣ Update Application Status (Accept/Reject)
    public function update(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:accepted,rejected']);

        $applyJob = ApplyJob::find($id);

        if (!$applyJob) {
            return response()->json(['error' => 'Application not found'], 404);
        }

        $applyJob->update(['status' => $request->status]);

        return response()->json(['message' => 'Application status updated successfully', 'applyJob' => $applyJob]);
    }

    // 4️⃣ Get Applications for the Current User (Applicant)
    public function getApplications(Request $request)
    {
        $userId = $request->user()->id;
        $applications = ApplyJob::where('applied_by', $userId)
                                ->with(['job', 'creator'])
                                ->get();

        return response()->json($applications);
    }
}