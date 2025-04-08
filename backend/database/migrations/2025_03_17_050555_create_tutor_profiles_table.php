<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('tutor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key referencing users table
            $table->string('image')->nullable();
            $table->string('name');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->date('date_of_birth');
            $table->text('biography');
            $table->string('subjects'); // Store subjects as JSON
            $table->decimal('hourly_rate', 8, 2);
            $table->string('location');
               $table->string('tutoring_mode'); 
            $table->integer('experience')->comment('Years of experience');
            $table->text('education_background');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('tutor_profiles');
    }
};
