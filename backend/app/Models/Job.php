<?php

// app/Models/Job.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'job_title',
        'description',
        'learner_name',
        'learner_gender',
        'location',
        'address',
        'tutoring_mode',
        'wanted_tutor_qualification',
        'hours_per_week',
        'salary_rate',
        'start_date',
        'special_request',
    ];

    // Define any relationships (for example, user)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
