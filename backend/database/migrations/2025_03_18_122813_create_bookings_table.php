<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        if (!Schema::hasTable('bookings')) {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('job_id');
            $table->unsignedBigInteger('tutor_profile_id');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('applied_by')->nullable();
            $table->enum('status', ['new', 'accepted', 'rejected'])->default('new');
            $table->enum('type', ['offer', 'apply'])->default('apply');
            $table->timestamps();
        });
    }
    }

    public function down() {
        Schema::dropIfExists('bookings');
    }
};
