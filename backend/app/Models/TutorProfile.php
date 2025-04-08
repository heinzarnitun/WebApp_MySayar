<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TutorProfile extends Model
{
    use HasFactory;
    public function reviews()
    {
        return $this->hasMany(Review::class, 'tutor_id');
    }

    // The table associated with the model
    protected $table = 'tutor_profiles';

    // The attributes that are mass assignable
    protected $fillable = [
        'user_id',
        'image',
        'name',
        'gender',
        'date_of_birth',
        'biography',
        'subjects',
        'hourly_rate',
        'location',
        'tutoring_mode',
        'experience',
        'education_background',
    ];

    // Define the relationship to the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tutorProfiles()
{
    return $this->hasMany(TutorProfile::class);
}

}
