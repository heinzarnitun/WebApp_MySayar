<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Job;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JobTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_job()
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/jobs', [
            'user_id' => $user->id,
            'job_title' => 'Math Tutor',
            'description' => 'Need a tutor for high school student.',
            'learner_name' => 'John',
            'learner_gender' => 'male',
            'location' => 'Yangon',
            'address' => '123 Street',
            'tutoring_mode' => 'online',
            'wanted_tutor_qualification' => 'Bachelor',
            'hours_per_week' => 5,
            'salary_rate' => 15000,
            'start_date' => now()->toDateString(),
            'special_request' => 'Can speak English',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseCount('jobs', 1);
    }

    public function test_can_list_all_jobs()
    {
        Job::factory()->count(3)->create();

        $response = $this->getJson('/api/jobs');

        $response->assertStatus(200)->assertJsonCount(3);
    }

    public function test_can_show_a_single_job()
    {
        $job = Job::factory()->create();

        $response = $this->getJson("/api/jobs/{$job->id}");

        $response->assertStatus(200)->assertJson([
            'id' => $job->id,
            'job_title' => $job->job_title,
        ]);
    }

    public function test_can_update_job()
    {
        $job = Job::factory()->create();

        $updatedData = [
            'user_id' => $job->user_id,
            'job_title' => 'Updated Title',
            'description' => 'Updated Description',
            'learner_name' => 'Jane',
            'learner_gender' => 'female',
            'location' => 'Mandalay',
            'address' => '456 Lane',
            'tutoring_mode' => 'offline',
            'wanted_tutor_qualification' => 'Master',
            'hours_per_week' => 10,
            'salary_rate' => 20000,
            'start_date' => now()->toDateString(),
            'special_request' => 'Flexible timing',
        ];

        $response = $this->putJson("/api/jobs/{$job->id}", $updatedData);

        $response->assertStatus(200);
        $this->assertEquals('Updated Title', $job->fresh()->job_title);
    }

    public function test_can_delete_job()
    {
        $job = Job::factory()->create();

        $response = $this->deleteJson("/api/jobs/{$job->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('jobs', ['id' => $job->id]);
    }

    public function test_can_get_my_jobs()
    {
        $user = User::factory()->create();
        Job::factory()->count(2)->create(['user_id' => $user->id]);
        Job::factory()->count(1)->create(); // not this user's job

        $response = $this->getJson("/api/my-jobs?user_id={$user->id}");

        $response->assertStatus(200)->assertJsonCount(2);
    }

    public function test_can_search_jobs()
    {
        $job = Job::factory()->create([
            'location' => 'Yangon',
            'salary_rate' => 20000,
            'tutoring_mode' => 'online',
        ]);

        $response = $this->getJson('/api/search-jobs?location=Yangon&min_salary=15000&tutoring_mode=online');

        $response->assertStatus(200)->assertJsonFragment([
            'id' => $job->id,
        ]);
    }

    public function test_can_get_latest_jobs()
    {
        Job::factory()->count(10)->create();

        $response = $this->getJson('/api/latest-jobs');

        $response->assertStatus(200)->assertJsonCount(5); // only 5 latest
    }
}
