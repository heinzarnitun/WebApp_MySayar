<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model {
    use HasFactory;

    protected $fillable = [
        'job_id',
        'tutor_profile_id',
        'created_by',
        'applied_by',
        'status',
        'type',
    ];

    public function job() {
        return $this->belongsTo(Job::class);
    }

    public function tutorProfile() {
        return $this->belongsTo(TutorProfile::class);
    }

    public function createdByUser() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function appliedByUser() {
        return $this->belongsTo(User::class, 'applied_by');
    }
}
