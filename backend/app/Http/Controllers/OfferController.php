<?php


namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    // 1️⃣ Send an Offer
    public function store(Request $request)
    {
        $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'tutor_profile_id' => 'required|exists:tutor_profiles,id',
            'created_by' => 'required|exists:users,id',
            'applied_by' => 'required|exists:users,id',
        ]);

        $offer = Offer::create([
            'job_id' => $request->job_id,
            'tutor_profile_id' => $request->tutor_profile_id,
            'created_by' => $request->created_by,
            'applied_by' => $request->applied_by,
            'status' => 'new',
            'type' => 'offer',
        ]);

        return response()->json(['message' => 'Offer sent successfully', 'offer' => $offer], 201);
    }

    // 2️⃣ Get Job Offers for a Tutor (to be displayed in notifications)
    public function index(Request $request)
    {
        $offers = Offer::where('applied_by', $request->user()->id)
                        ->where('status', 'new')
                        ->with('job')
                        ->get();

        return response()->json($offers);
    }

    // 3️⃣ View More Details About an Offer
    public function show($id)
    {
        $offer = Offer::with('job', 'creator')->findOrFail($id);
        return response()->json($offer);
    }

    // 4️⃣ Accept or Reject an Offer
    public function update(Request $request, $id)
{
    \Log::info("Update function called with ID: $id, Request Data: " . json_encode($request->all()));

    $request->validate(['status' => 'required|in:accepted,rejected']);

    $offer = Offer::find($id);

    if (!$offer) {
        \Log::error("Offer not found with ID: $id");
        return response()->json(['error' => 'Offer not found'], 404);
    }

    // Update the status of the offer
    $offer->update(['status' => $request->status]);

    return response()->json(['message' => 'Offer updated successfully', 'offer' => $offer]);
}


    public function getOffers(Request $request) {
    $userId = $request->query('applied_by') ?? ($request->user() ? $request->user()->id : null);

    $query = Offer::query();

    if ($userId) {
        $query->where('applied_by', $userId);
    }

    // Ensure job details are included
    $offers = $query->with('job')->get();

    return response()->json($offers);
}



}
