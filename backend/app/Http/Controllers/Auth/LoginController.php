<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        // Validate email and password
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Check if the credentials match
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();

            // Generate a personal access token for the user
            $token = $user->createToken('YourAppName')->plainTextToken;

            // Return user details without password and the generated token
            return response()->json([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]
            ], 200);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }

    public function showLoginForm()
    {
        return view('auth.login');
    }
}
