<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained('jobs')->onDelete('cascade');
            $table->foreignId('tutor_profile_id')->constrained('tutor_profiles')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade'); // User who created the booking
            $table->foreignId('applied_by')->constrained('users')->onDelete('cascade'); // User who applied for the job
            $table->enum('status', ['new', 'accepted', 'rejected'])->default('new'); // New, Accepted, Rejected
            $table->enum('type', ['offer', 'apply'])->default('apply'); // Offer or Apply status
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('bookings');
    }
};
