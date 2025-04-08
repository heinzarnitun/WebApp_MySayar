<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key referencing users table
            $table->string('job_title');
            $table->text('description');
            $table->string('learner_name');
            $table->enum('learner_gender', ['male', 'female', 'other']);
            $table->string('location');
            $table->string('address');
             $table->string('tutoring_mode');
            $table->string('wanted_tutor_qualification');
            $table->integer('hours_per_week');
            $table->decimal('salary_rate', 8, 2);
            $table->date('start_date');
            $table->text('special_request')->nullable();
            $table->timestamps();

        });
    }

    public function down() {
        Schema::dropIfExists('jobs');
    }
};
