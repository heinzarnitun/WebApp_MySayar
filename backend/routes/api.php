<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware;
use App\Http\Controllers\TutorProfileController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\ApplyJobController;
use App\Http\Controllers\ReviewController;

/*Route::get('/send-test-email', function () {
    Mail::send([], [], function ($message) {
        $message->to('trharris.ais@gmail.com')
                ->subject('Test Email from API')
                ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
                ->setBody('This is a test email from the API.');
    });

    return response()->json(['message' => 'Test email sent!']);
});

// Verify email using a link
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return response()->json(['message' => 'Email successfully verified.']);
})->middleware(['auth:sanctum', 'signed']);

// Resend verification email
Route::post('/email/verify/resend', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification email sent.']);
})->middleware(['auth:sanctum']);*/

// Registration route
Route::post('/register', [RegisterController::class, 'register']);

// Login route
Route::post('/login', [LoginController::class, 'login']);


Route::post('/logout', [LogoutController::class, 'logout']);

Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->json(['message' => 'CSRF cookie set']);
});

Route::prefix('/tutor-profiles')->group(function () {
    Route::get('/', [TutorProfileController::class, 'index']); // Get all tutor profiles
    Route::get('/{id}', [TutorProfileController::class, 'show']); // Get a single tutor profile by ID
    Route::post('/', [TutorProfileController::class, 'store']); // Create a new tutor profile
    Route::put('/{id}', [TutorProfileController::class, 'update']); // Update an existing tutor profile
    Route::post('/{id}', [TutorProfileController::class, 'update']);
    Route::delete('/{id}', [TutorProfileController::class, 'destroy']); // Delete a tutor profile


});

// Create a new review for a tutor
Route::post('/tutor-profiles/{tutorId}/reviews', [ReviewController::class, 'store']);
// Get reviews for a specific tutor
Route::get('/tutor-profiles/{tutorId}/reviews', [ReviewController::class, 'index']);

// Update a review (only the user who created it can update it)
Route::put('/reviews/{reviewId}', [ReviewController::class, 'update']);
Route::delete('/reviews/{reviewId}', [ReviewController::class, 'destroy']);

// In routes/api.php (for API calls)
Route::get('/tutors/search', [TutorProfileController::class, 'searchTutors']);
Route::post('/tutors/search', [TutorProfileController::class, 'searchTutors']);

// Make this route accessible to everyone (no authentication required)
Route::get('/tutors/latest', [TutorProfileController::class, 'latestTutors']);


    Route::post('/offers', [OfferController::class, 'store']); // Send an offer
    Route::get('/offers', [OfferController::class, 'index']); // List new offers (notifications)
    Route::get('/offers/{id}', [OfferController::class, 'show']); // View offer details
    Route::put('/offers/{id}', [OfferController::class, 'update']); // Accept/reject offer


    Route::get('/offers/', [OfferController::class, 'getOffers']); 


Route::get('/my-jobs', [JobController::class, 'myJobs']);

#this is for jobs with users who created it
Route::get('/search-jobs', [JobController::class, 'searchJobs']);
Route::post('/search-jobs', [JobController::class, 'searchJobs']);
Route::get('/latest-jobs', [JobController::class, 'latestJobs']);


Route::get('jobs', [JobController::class, 'index']);
Route::post('jobs', [JobController::class, 'store']);
Route::get('jobs/{id}', [JobController::class, 'show']);
Route::put('jobs/{id}', [JobController::class, 'update']);
Route::delete('jobs/{id}', [JobController::class, 'destroy']);
// Logout route (protected by Sanctum)
//Route::middleware('auth:sanctum')->post('/logout', [LogoutController::class, 'logout']);

Route::post('/apply-jobs', [ApplyJobController::class, 'store']);
Route::get('/apply-jobs', [ApplyJobController::class, 'index']);
Route::put('/apply-jobs/{id}', [ApplyJobController::class, 'update']);
Route::get('/my-applications', [ApplyJobController::class, 'getApplications']);

Route::get('/test-db', function() {
    try {
        DB::connection()->getPdo();
        return "Connected successfully to database: " . DB::connection()->getDatabaseName();
    } catch (\Exception $e) {
        return "Error connecting to database: " . $e->getMessage();
    }
});