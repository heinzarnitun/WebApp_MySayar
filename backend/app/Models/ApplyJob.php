<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplyJob extends Model
{
    use HasFactory;
protected $table = 'bookings';
    protected $fillable = [
        'job_id',
        'tutor_profile_id',
        'created_by',
        'applied_by',
        'status',
    ];

    // Relationship with the Job model
    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    // Relationship with the TutorProfile model
    public function tutorProfile()
    {
        return $this->belongsTo(TutorProfile::class);
    }

    // Relationship with the User model (created_by)
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relationship with the User model (applied_by)
    public function applicant()
    {
        return $this->belongsTo(User::class, 'applied_by');
    }
}