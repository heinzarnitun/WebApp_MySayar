<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

// Verify email using a link
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return response()->json(['message' => 'Email successfully verified.']);
})->middleware(['auth:sanctum', 'signed'])->name('verification.verify');


// Resend verification email
Route::post('/email/verify/resend', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification email sent.']);
})->middleware(['auth', 'signed']);


// Registration routes
Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register.show');
Route::post('/register', [RegisterController::class, 'register'])->name('register');

// Login routes
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login.show');
Route::post('/login', [LoginController::class, 'login'])->name('login');

// Logout route
Route::post('/logout', [LogoutController::class, 'logout'])->name('logout');

Route::get('/test-email', function () {
    Mail::send('test-email', [], function ($message) {
        // Ensure that a valid "from" email is set here
        $message->to('heinrichzine@gmail.com')
                ->subject('Test Email from Blade')
                ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME')); // This line sets the sender email
    });

    return 'Test email sent!';
});

