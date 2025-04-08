<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Events\UserRegistered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;


class RegisterController extends Controller
{
   



public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        // Send email verification
       $user->sendEmailVerificationNotification();
\Log::info("Verification email should be sent now.");



        // Create a token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered. Please check your email to verify your account.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

public function showRegistrationForm()
{
    return view('register'); // Ensure you have a Blade view at resources/views/auth/register.blade.php
}
}
