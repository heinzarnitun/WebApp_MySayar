<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\TutorProfile; // Add this import
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase; // Use the Laravel TestCase class

class TutorProfileTest extends TestCase
{
    use RefreshDatabase; // Automatically refresh the database after each test

    /**
     * Test storing a tutor profile.
     *
     * @return void
     */
    public function test_store_tutor_profile()
    {
        // Create a user to associate with the tutor profile
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // Simulating the request payload
        $data = [
            'user_id' => $user->id,
            'name' => 'John Doe',
            'gender' => 'male',
            'date_of_birth' => '1985-06-15',
            'biography' => 'Experienced tutor with 5 years of experience.',
            'subjects' => 'Math, Science',
            'hourly_rate' => 25,
            'location' => 'Mandalay',
            'tutoring_mode' => 'Online',
            'experience' => 5,
            'education_background' => 'B.Sc in Mathematics',
        ];

        // Send POST request to store tutor profile
        $response = $this->json('POST', '/api/tutor-profiles', $data);

        // Assert that a tutor profile was created
        $response->assertStatus(201);
        $response->assertJson(['message' => 'Tutor profile created successfully.']);
        $response->assertJsonStructure([
            'message',
            'data' => ['id', 'user_id', 'name', 'gender', 'date_of_birth', 'biography', 'subjects', 'hourly_rate', 'location', 'tutoring_mode', 'experience', 'education_background'],
        ]);
    }

    /**
     * Test updating a tutor profile.
     *
     * @return void
     */
    public function test_update_tutor_profile()
    {
        // Create a user
        $user = \App\Models\User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create a tutor profile
        $tutorProfile = TutorProfile::create([
            'user_id' => $user->id,
            'name' => 'John Doe',
            'gender' => 'male',
            'date_of_birth' => '1985-06-15',
            'biography' => 'Experienced tutor with 5 years of experience.',
            'subjects' => 'Math, Science',
            'hourly_rate' => 25,
            'location' => 'Mandalay',
            'tutoring_mode' => 'Online',
            'experience' => 5,
            'education_background' => 'B.Sc in Mathematics',
        ]);

        // Simulate updating the tutor profile
        $updateData = [
            'user_id' => $user->id,  // Ensure user_id is included
            'name' => 'John Updated',
            'gender' => 'male',
            'date_of_birth' => '1985-06-15',
            'biography' => 'Experienced tutor with 7 years of experience.',
            'subjects' => 'Math, Science, English',
            'hourly_rate' => 30,
            'location' => 'Yangon',
            'tutoring_mode' => 'Offline',
            'experience' => 7,
            'education_background' => 'M.Sc in Mathematics',
        ];

        // Send PUT request to update tutor profile
        $response = $this->json('PUT', "/api/tutor-profiles/{$tutorProfile->id}", $updateData);

        // Assert that the tutor profile was updated
        $response->assertStatus(200);
        $response->assertJson(['message' => 'Tutor profile updated successfully.']);
        $response->assertJsonStructure([
            'message',
            'data' => ['id', 'user_id', 'name', 'gender', 'date_of_birth', 'biography', 'subjects', 'hourly_rate', 'location', 'tutoring_mode', 'experience', 'education_background'],
        ]);
    }

    /**
     * Test showing a tutor profile.
     *
     * @return void
     */
    public function test_show_tutor_profile()
{
    // Create a user
    $user = \App\Models\User::create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    // Create a tutor profile
    $tutorProfile = TutorProfile::create([
        'user_id' => $user->id,
        'name' => 'Nyein Chan',
        'gender' => 'male',
        'date_of_birth' => '1990-05-12',
        'biography' => 'Experienced tutor specializing in Mathematics and Physics.',
        'subjects' => 'Math, Science',
        'hourly_rate' => 20000,
        'location' => 'Yangon',
        'tutoring_mode' => 'Online, In-person, Both',
        'experience' => 5,
        'education_background' => 'B.Sc in Physics from Yangon University',
    ]);

    // Send GET request to retrieve the tutor profile
    $response = $this->json('GET', "/api/tutor-profiles/{$tutorProfile->id}");

    // Assert that the tutor profile is returned with the correct structure
    $response->assertStatus(200);
    $response->assertJsonStructure([
        'id', 'user_id', 'image', 'name', 'gender', 'date_of_birth', 'biography', 'subjects', 'hourly_rate', 'location', 'tutoring_mode', 'experience', 'education_background', 'created_at', 'updated_at'
    ]);
}


    /**
     * Test deleting a tutor profile.
     *
     * @return void
     */
    public function test_delete_tutor_profile()
    {
        // Create a user to associate with the tutor profile
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create a tutor profile to delete
        $tutorProfile = TutorProfile::create([
            'user_id' => $user->id,
            'name' => 'John Doe',
            'gender' => 'male',
            'date_of_birth' => '1985-06-15',
            'biography' => 'Experienced tutor with 5 years of experience.',
            'subjects' => 'Math, Science',
            'hourly_rate' => 25,
            'location' => 'Mandalay',
            'tutoring_mode' => 'Online',
            'experience' => 5,
            'education_background' => 'B.Sc in Mathematics',
        ]);

        // Send DELETE request to delete the tutor profile
        $response = $this->json('DELETE', "/api/tutor-profiles/{$tutorProfile->id}");

        // Assert that the tutor profile was deleted
        $response->assertStatus(200);
        $response->assertJson(['message' => 'Tutor profile deleted successfully.']);
    }
}
