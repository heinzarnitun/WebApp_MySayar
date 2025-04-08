<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;
    protected $table = 'bookings';

    protected $fillable = [
        'job_id', // The job being offered
        'tutor_profile_id', // The tutor being offered the job
        'created_by', // The user who created the job listing
        'applied_by', // The tutor receiving the offer (user_id from users table)
        'status', // Offer status (new, accepted, rejected)
        'type', // Type of offer (always "offer")
    ];

    // Relationship: An offer belongs to a job
    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    // Relationship: An offer belongs to a tutor profile
    public function tutorProfile()
    {
        return $this->belongsTo(TutorProfile::class, 'tutor_profile_id');
    }

    // Relationship: An offer is created by a user
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relationship: An offer is sent to a tutor (who is a user)
    public function tutor()
    {
        return $this->belongsTo(User::class, 'applied_by');
    }
}
